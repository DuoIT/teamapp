const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const config = require("config");
const multer = require("multer");
const fs = require("fs");
const data_User_From_DB = require(path.join(__dirname, "../../", "/models/user")); //"../models/user"
const data_Monan_From_DB = require(path.join(__dirname, "../../", "/models/monan")); //"../models/user"
const data_Profile_From_DB = require(path.join(__dirname, "../../", "/models/profile")); //"../models/profile"
const data_Order_From_DB = require(path.join(__dirname, "../../", "/models/order")); //"../models/order"
const data_Doanhthu_From_DB = require(path.join(__dirname, "../../", "/models/doanhthu")); //"../models/order"
const data_Comment_From_DB = require(path.join(__dirname, "../../", "/models/comment")); //"../models/order"
const bcrypt = require(path.join(__dirname, "../../", "/helpers/encode_password")); //"../helpers/encode_password"

var router = express.Router();

//---------------------check role-------------------
router.use(function(req, res, next) {
    //kiem tra co nhan bearer token tu authorization khong
    var tokenBearer = req.headers['authorization'];
    var bearer = null;
    if(typeof tokenBearer !== 'undefined') {
        tokenBearerSplit = tokenBearer.split(' ');
        bearer = tokenBearerSplit[1];
    }
    //thuc hien kiem tra token
    var token = req.body.token || req.query.token || bearer;
    console.log("token in image:" + token);
    if (!token) return res.status(403).json({ success: false, notification: "no token" });
    else {
        jwt.verify(token, config.get("jsonwebtoken.codesecret"), function(err, decoded) {
            if (err) res.status(403).json({ success: false, notification: "token error" });
            else {
                var id = decoded._id;
                data_User_From_DB.getUserByIdToCheckRole(id, function(result) {
                    if (!result) res.status(403).json({ success: false, notification: "token error, not found user" });
                    else {
                        if (result.role.name_role == "store" && result.role.licensed == true) {
                            decoded.role = result.role;
                            //chuyen thong tin user duoc decode vao req.user
                            req.user = decoded;
                            next();
                        } else res.status(401).json({ success: false, notification: "this account can't access" });
                    }
                })
            }
        })
    }
});
//---------API FOR STORE--------------
function check_Permission(permission, name_permission, id) {
    //kiem tra cac permission co duoc chap nhan khong
    for (i = 0; i < permission.length; i++) {
        if (permission[i].name_per == name_permission) {
            if (id == 1) {
                if (permission[i].per_detail.view == true) {
                    return true;
                }
            } else if (id == 2) {
                if (permission[i].per_detail.create == true) {
                    return true;
                }
            } else if (id == 3) {
                if (permission[i].per_detail.update == true) {
                    return true;
                }
            } else if (id == 4) {
                if (permission[i].per_detail.delete == true) {
                    return true;
                }
            }
        }
    }
    return false;
}
//xem-them-sua-xoa
//listcomment
router.get("/listcomments", function(req, res) {
    //get thong tin user tu req.user ra
    var user = req.user;
    var id = user._id;
    var permission = user.role.permission;
    //------CHECK PERMISSION-------------
    //check xem user co quyen su dung khong
    if (check_Permission(permission, "comment", 1) == false) return res.status(401).json({success: false, notification: "You can't view monan"});
    data_Comment_From_DB.getListCommentsById(id, function(result) {
        if(!result) res.status(500).json({ success: false } );
        else res.status(200).json({
            success: true,  
            result: result
        });
    })
})
//-----sanpham-------------
router.get("/listsanpham", function(req, res, next) {
    //get thong tin user tu req.user ra
    var user = req.user;
    var id = user._id;
    var permission = user.role.permission;
    //check xem co nhan duoc field khong, neu khong thi chuyen sang router khac cung ten
    var id_Monan = req.body.id || req.query.id;
    if(!id_Monan || id_Monan.trim().length == 0) return next();
    //check xem user co quyen su dung khong
    if (check_Permission(permission, "monan", 1) == false) return res.status(401).json({success: false, notification: "You can't view monan"});

    data_Monan_From_DB.getMonAnById(id, id_Monan, function(result) {
        if(!result) res.status(500).json({success: false});
        else res.status(200).json({
            success: true,
            result: result
        });
    })
})
router.get("/listsanpham", function(req, res) {
    //get thong tin user tu req.user ra
    var user = req.user;
    var id = user._id;
    var permission = user.role.permission;
    //------CHECK PERMISSION-------------
    if (check_Permission(permission, "monan", 1) == false) return res.status(401).json({success: false, notification: "You can't view monan"});

    data_Monan_From_DB.getListMonAnById(id, function(result) {
        if (!result) res.status(500).json({success: false});
        else res.status(200).json({
            success: true,
            result: result
        });

    });
})
router.post("/listsanpham", function(req, res) {
    var user = req.user;
    var id = user._id;
    var permission = user.role.permission;
    var name_dictionary = "monan";
    //---CHECK PERMISSION-----
    if (check_Permission(permission, "monan", 2) == false) 
        return res.status(401).json({success: false, notification: "You can't ADD monan"});

    var sanpham = req.body;
    var danhmuc = sanpham.danhmuc;
    var ten = sanpham.ten;
    var mota = sanpham.mota;
    //check: thiet lap uu tien: file > link_url
    var hinhanh_url = config.get("protocol") + req.headers.host + "/images/monan?id=monan_default.jpg";
    if(sanpham.hinhanh_url) hinhanh_url = sanpham.hinhanh_url;
    //ss
    var check_Upload_File_AV1 = false;
    var name_File1 = null;
    if(sanpham.avatar_base64) {
        var avatar_url_per = sanpham.avatar_base64;
        if(!avatar_url_per || avatar_url_per.trim().length == 0) avatar_url_per = null;
        else {
            try {
                //kiem tra dinh dang base64 
                var base64Data = null;
                if(avatar_url_per.indexOf("data:image\/jpeg;base64,") != -1){
                    base64Data = avatar_url_per.replace("data:image\/jpeg;base64,", "");
                    name_File1 = String(new Date().getTime()) + ".jpg";
                }  
                else if(avatar_url_per.indexOf("data:image\/png;base64,") != -1) {
                    base64Data = avatar_url_per.replace("data:image\/png;base64,", "");
                    name_File1 = String(new Date().getTime()) + ".png";
                }
                if(base64Data){
                    //luu anh
                    fs.writeFileSync(path.join(__dirname, "../../../", "public/imgs/avatar/" + name_File1), base64Data, 'base64');   
                    //luu lai url vao db
                    hinhanh_url = config.get("protocol") + req.headers.host + "/images/avatar?id=" + name_File1;
                    check_Upload_File_AV1 = true;
                }       
            } catch (error) {
                console.log(error);
            }         
        }
    }
    var gia = sanpham.gia;
    var soluong = sanpham.soluong;
    var trungbinhsao = 0;


    //CHECK INPUT VALID
    if (!danhmuc || danhmuc.trim().length == 0) {
        if(check_Upload_File_AV1) deleteImageAvatarV2(name_File1);
        return res.status(400).json({success: false, notification: "input's wrong"});}
    else if (danhmuc.trim() != "com" && danhmuc.trim() != "thucan" && danhmuc.trim() != "canh"){
        if(check_Upload_File_AV1) deleteImageAvatarV2(name_File1); 
        return res.status(400).json({success: false, notification: "danhmuc have to 1 in 3 values ('com','canh','thucan')"});}

    if (!sanpham) {
        if(check_Upload_File_AV1) deleteImageAvatarV2(name_File1);
        return res.status(400).json({success: false, notification: "input's wrong"});}

    if (!ten || ten.trim().length == 0 || !gia || Number.isNaN(gia) || !soluong || Number.isNaN(soluong))
        {
            if(check_Upload_File_AV1) deleteImageAvatarV2(name_File1);
            return res.status(400).json({success: false, notification: "input's wrong"});
        }
    var data = {
        ten: ten,
        mota: mota,
        hinhanh_url: hinhanh_url,
        gia: gia,
        soluong: soluong,
        trungbinhsao: trungbinhsao
    }

    data_Monan_From_DB.createMonAnOfStore(id, danhmuc, data, function(result) {
        if (!result) {
            if(check_Upload_File_AV1) deleteImageAvatarV2(name_File1);
            res.status(500).json({success: false, notification: "unknown error"});}
        else res.status(200).json({
            success: true, 
            notification: "created is success" 
        });
    });


})
router.delete("/listsanpham", function(req, res) {
    var user = req.user;
    var id = user._id;
    var permission = user.role.permission;
    //-----CHECK PERMISSION----
    if (check_Permission(permission, "monan", 4) == false) return res.status(401).json({success: false, notification: "You can't DELETE monan"});
    var id_monan = req.query.id || req.body.id;

    if (!id_monan || id_monan.trim().length == 0)
        return res.status(400).json({success: false, notification: "input's wrong"});

    data_Monan_From_DB.deleteMonAnById(id, id_monan, function(result) {
        if (!result) res.status(500).json({success: false, notification: "You can't ADD monanunknown error"});
        else res.status(200).json({
            success: true, 
            notification: "delete is success"
        });
    })

})

router.put("/listsanpham/:ignore", function(req, res) {
        //DEFINE CODDE........
        var user = req.user;
        var id = user._id;
        var permission = user.role.permission;
        if (check_Permission(permission, "monan", 3) == false) 
            return res.status(401).json({ success: false, notification: "You can't EDIT monan"});
        var id_monan =req.body.id ||  req.query.id;
        var danhmuc = req.query.ten_danhmuc || req.body.ten_danhmuc;
        var ten = req.query.ten || req.body.ten;
        var mota = req.query.mota || req.body.mota;
        var hinhanh_url = req.query.hinhanh_url || req.body.hinhanh_url;
        var avatar_base64 = req.query.avatar_base64 || req.body.avatar_base64;
        //---CHECK FILE TU FE
        var check_Upload_File_AV1 = false;
        var name_File1 = null;
        if(avatar_base64) {
            var avatar_url_per = avatar_base64;
            if(!avatar_url_per || avatar_url_per.trim().length == 0) avatar_url_per = null;
            else {
                try {
                    var base64Data = null;
                    if(avatar_url_per.indexOf("data:image\/jpeg;base64,") != -1){
                        base64Data = avatar_url_per.replace("data:image\/jpeg;base64,", "");
                        name_File1 = String(new Date().getTime()) + ".jpg";
                    }  
                    else if(avatar_url_per.indexOf("data:image\/png;base64,") != -1) {
                        base64Data = avatar_url_per.replace("data:image\/png;base64,", "");
                        name_File1 = String(new Date().getTime()) + ".png";
                    }
                    if(base64Data){
                        //luu anh
                        fs.writeFileSync(path.join(__dirname, "../../../", "public/imgs/avatar/" + name_File1), base64Data, 'base64');   
                        //luu lai
                        hinhanh_url = config.get("protocol") + req.headers.host + "/images/avatar?id=" + name_File1;
                        check_Upload_File_AV1 = true;
                    }       
                } catch (error) {
                    console.log(error);
                }         
            }
        }

        var gia = req.query.gia || req.body.gia;
        var soluong = req.query.soluong || req.body.soluong;
        if (!danhmuc || danhmuc.trim().length == 0) return res.status(400).json({success: false, notification: "input's wrong"});
        else if (danhmuc.trim() != "com" && danhmuc.trim() != "thucan" && danhmuc.trim() != "canh")
            {
                if(check_Upload_File_AV1) deleteImageAvatarV2(name_File1);
                return res.status(400).json({ success: false, notification: "danhmuc have to 1 in 3 values ('com','canh','thucan')"});}

        if (!ten || ten.trim().length == 0 || !gia || Number.isNaN(gia) || !soluong || Number.isNaN(soluong))
            {
                if(check_Upload_File_AV1) deleteImageAvatarV2(name_File1);
                return res.status(400).json({ success: false, notification: "input's wrong" });}

        var data = {
            ten: ten,
            mota: mota,
            hinhanh_url: hinhanh_url,
            gia: gia,
            soluong: soluong,
        }

        data_Monan_From_DB.updateMonAnById(id, id_monan, danhmuc, data, function(result) {
            if (!result) {
                if(check_Upload_File_AV1) deleteImageAvatarV2(name_File1);
                res.status(500).json({ success: false, notification: "unknow error" });}
            else res.status(200).json({ 
                success: true,
                notification: "updated is success" 
            });
        })
    })
    //------profile---------
router.get("/profile", function(req, res, next) {
    var id = req.user._id;

    var id_Profile = req.body.id || req.query.id;
    if(!id_Profile || id_Profile.trim().length == 0) return next();

    data_Profile_From_DB.getProfileStoreById(id, function(result) {
        if (!result) res.status(500).json({ success: false });
        else res.status(200).json({
            success: true,
            result: result
        })
    })
});    
router.get("/profile", function(req, res) {
    var id = req.user._id;
    
    data_Profile_From_DB.getProfileStoreById(id, function(result) {
        if (!result) res.status(500).json({ success: false });
        else res.status(200).json({
            success: true,
            result: [result]
        })
    })
});
//EDIT PROFILE-------------------------
router.put("/profile/:ignore", function(req, res) {
        var id = req.user._id;
        var profile = req.body;
        var name_personal = profile.information.name;
        var address_personal = profile.information.address;
        var phonenumber_personal = profile.information.phonenumber;
        var avatar_url_personal = profile.information.avatar_url;
        var check_Upload_File_AV1 = false;
        var name_File1 = null;
        if(profile.information.avatar_base64) {
            var avatar_url_per = profile.information.avatar_base64;
            if(!avatar_url_per || avatar_url_per.trim().length == 0) avatar_url_per = null;
            else {
                try {
                    var base64Data = null;
                    if(avatar_url_per.indexOf("data:image\/jpeg;base64,") != -1){
                        base64Data = avatar_url_per.replace("data:image\/jpeg;base64,", "");
                        name_File1 = String(new Date().getTime()) + ".jpg";
                    }  
                    else if(avatar_url_per.indexOf("data:image\/png;base64,") != -1) {
                        base64Data = avatar_url_per.replace("data:image\/png;base64,", "");
                        name_File1 = String(new Date().getTime()) + ".png";
                    }
                    if(base64Data){
                        //luu anh
                        fs.writeFileSync(path.join(__dirname, "../../../", "public/imgs/avatar/" + name_File1), base64Data, 'base64');   
                        //luu lai
                        avatar_url_personal = config.get("protocol") + req.headers.host + "/images/avatar?id=" + name_File1;
                        check_Upload_File_AV1 = true;
                    }       
                    else avatar_url_per = null;
                } catch (error) {
                    avatar_url_per = null;
                }         
            }
        }
        var name_store = profile.dichvu.ten;
        var phonenumber_store = profile.dichvu.phonenumber;
        var tenthanhpho_store = profile.dichvu.diachi.tenthanhpho;
        var tenquan_store = profile.dichvu.diachi.tenquan;
        var tenduong_store = profile.dichvu.diachi.tenduong;
        var mota_store = profile.dichvu.mota;
        var avatar_url_store = profile.dichvu.avatar_url;
        var check_Upload_File_AV2 = false;
        var name_File2 = null;
        if(profile.dichvu.avatar_base64) {
            var avatar_url_per = profile.dichvu.avatar_base64;
           
            if(!avatar_url_per || avatar_url_per.trim().length == 0) avatar_url_per = null;
            else {
                try {
                    var base64Data = null;
                    if(avatar_url_per.indexOf("data:image\/jpeg;base64,") != -1){
                        base64Data = avatar_url_per.replace("data:image\/jpeg;base64,", "");
                        name_File2 = String(new Date().getTime()) + ".jpg";
                    }  
                    else if(avatar_url_per.indexOf("data:image\/png;base64,") != -1) {
                        base64Data = avatar_url_per.replace("data:image\/png;base64,", "");
                        name_File2 = String(new Date().getTime()) + ".png";
                    }
                    if(base64Data){
                        //luu anh
                        fs.writeFileSync(path.join(__dirname, "../../../", "public/imgs/avatar/" + name_File2), base64Data, 'base64');   
                        //luu lai
                        avatar_url_store = config.get("protocol") + req.headers.host + "/images/avatar?id=" + name_File2;
                        check_Upload_File_AV2 = true;
                    }       
                } catch (error) {
                    console.log(error);
                }         
            }
        }
        if (!phonenumber_store || phonenumber_store.trim().length < 10 ||
            !tenthanhpho_store || tenthanhpho_store.trim().length == 0 || !tenquan_store || tenquan_store.trim().length == 0 || 
            !name_personal || name_personal.trim().length == 0 ||
            !name_store || name_store.trim().length == 0 || !phonenumber_personal || phonenumber_personal.trim().length < 10)
            {
                if(check_Upload_File_AV2) deleteImageAvatarV2(name_File2);
                if(check_Upload_File_AV1) deleteImageAvatarV2(name_File1);
                return res.status(400).json({ success: false, notification: "ban phai nhap day du thong tin" });
            }
        
        var data = {
            name_personal: name_personal,
            address_personal: address_personal,
            phonenumber_personal: phonenumber_personal,
            avatar_url_personal: avatar_url_personal,
            name_store: name_store,
            phonenumber_store: phonenumber_store,
            tenthanhpho_store: tenthanhpho_store,
            tenquan_store: tenquan_store,
            tenduong_store: tenduong_store,
            mota_store: mota_store,
            avatar_url_store: avatar_url_store
        }

        data_Profile_From_DB.updateProfileStoreById(id, data, function(result) {
            if (!result) {
                if(check_Upload_File_AV2) deleteImageAvatarV2(name_File2);
                if(check_Upload_File_AV1) deleteImageAvatarV2(name_File1);
                res.status(500).json({ success: false } );}
            else res.status(200).json({ 
                success: true, 
                notification: "updated is success" 
            });
        })
    })
    //------order--------
router.get("/listorder", function(req, res, next) {
    var id = req.user._id;

    var id_Order = req.body.id || req.query.id;
    if(!id_Order || id_Order.trim().length == 0) return next();

    data_Order_From_DB.getOrderById(id, id_Order, function(result) {
        if (!result) res.status(500).json({ success: false });
        else res.status(200).json({
            success: true,
            result: result
        })
    })
});
router.get("/listorder", function(req, res) {
    var id = req.user._id;

    data_Order_From_DB.getListOrderOfStoreById(id, function(result) {
        if (!result) res.status(500).json({ success: false });
        else res.status(200).json({
            success: true,
            result: result
        })
    })
});
router.put("/listorder/:id", function(req, res) {
    var id = req.user._id;
    var id_Order = req.body.id || req.query.id || req.params["id"];
    var trangthai = req.body.trangthai || req.query.trangthai;
    if(!trangthai || trangthai.trim() != "dagiao") return res.status(400).json({success:false, notification:"Nhap thieu!"});
    if(!id_Order || id_Order.trim().length == 0) return res.status(400).json({success:false, notification:"Nhap thieu!"});
    data_Order_From_DB.setTrangThaiOrder(id, id_Order, trangthai, function(result) {
        if (!result) res.status(500).json({ success: false });
        else res.status(200).json({
            success: true
        })
    })
})
//--------doanhthu---------
router.get("/listdoanhthu", function(req, res, next) {
    var id = req.user._id;

    var id_Doanhthu = req.query.id;
    if(!id_Doanhthu) return next();

    data_Doanhthu_From_DB.getDoanhThuById(id, id_Doanhthu, function(result) {
        if(!result) res.status(500).json({ success: false });
        else res.status(200).json({
            success: true,
            result: result
        })
    })
})
router.get("/listdoanhthu", function(req, res) {
        var id = req.user._id;
        var doanhthu = [];
        data_Doanhthu_From_DB.getListDoanhThu(id, function(result) {
            if (!result) res.status(500).json({ success: false });
            else {
                // rs_result = result.toObject();
                result.thoigian = "alldays";
                result._id = "1";
                doanhthu.push(result);
                data_Doanhthu_From_DB.getListOrderTheoNgayById(id, 30, function(result1) {
                    if (!result) res.status(500).json({ success: false });
                    else {
                        // rs_result1 = result1.toObject();
                        result1.thoigian = "30days";
                        result1._id = "2";
                        doanhthu.push(result1);
                        data_Doanhthu_From_DB.getListOrderTheoNgayById(id, 7, function(result2) {
                            if (!result) res.status(500).json({ success: false });
                            else {
                                // rs_result2 = result2.toObject();
                                result2.thoigian = "7days";
                                result2._id = "3";
                                doanhthu.push(result2);
                                res.status(200).json({
                                success: true,
                                result: doanhthu           
                                 })}
                        });
                    }
                });
            }
        })
    })
    //--Using to add order into doanhthu to DEMO
router.post("/addorder", function(req, res) {
    var id = req.user._id;
    var order = req.body;

    var giodat = new Date();
    var tenthanhpho = order.tenthanhpho;
    var tenquan = order.tenquan;
    var id_monan = order.id_monan;
    var ten_monan = order.ten_monan;
    var soluong = order.soluong;
    var gia = order.gia;
    var ten_information = order.ten_information;
    var id_information = order.id_information;
    var ten_dichvu = order.ten_dichvu;
    var id_dichvu = order.id_dichvu;
    var data = {
        tongtien: soluong * gia,
        giodat: giodat,
        trangthai: "chuagiao",
        diachi: {
            tenthanhpho: tenthanhpho,
            tenquan: tenquan
        },
        order_detail: [{
            monan: {
                ten: ten_monan,
                id: id_monan
            },
            soluong: soluong,
            gia: gia
        }],
        information: {
            ten: ten_information,
            id: id_information
        },
        dichvu: {
            ten: ten_dichvu,
            id: id_dichvu
        },
    }

    data_Doanhthu_From_DB.addOrderDoanhThuById(data, function(result) {
        if (result) {
            console.log("result:" + result);
        } else console.log("khong co ket qua");
    })
})
//test
router.get("/hahaorder", function(req, res) {
    var id = req.user._id;

    data_Doanhthu_From_DB.getAllOrderDoanhThu(id, function(result) {
        if(result) res.status(200).json({
            success: true,
            result: result           
        })
    })
})
//
router.get("/listdoanhthu7ngay", function(req, res) {
    var id = req.user._id;
    var soNgay = 7;
    if (!id || id.trim().length == 0) return res.status(400).json({ success: false });
    data_Doanhthu_From_DB.getListOrderTheoNgayById(id, soNgay, function(result) {
        if (!result) res.status(500).json({ success: false });
        else res.status(200).json({
            success: true,
            result: result           
        })
    });
})
router.get("/listdoanhthu30ngay", function(req, res) {
    var id = req.user._id;
    var soNgay = 30;
    if (!id || id.trim().length == 0) return res.status(400).json({ success: false });
    data_Doanhthu_From_DB.getListOrderTheoNgayById(id, soNgay, function(result) {
        if (!result) res.status(500).json({ success: false });
        else res.status(200).json({
            success: true,
            result: result
        })
    });
})
function deleteImage(req) {
    fs.unlink(path.join(__dirname, "../../../", "public/imgs/monan/" + req.files[0].filename), function(err) {
        if (err) {
            console.log(err);
        }
        else console.log("delete img is success");
    });
}
function deleteImageAvatar(req) {
    if(req.files) {
        req.files.forEach(function(elem_Img) {
            fs.unlink(path.join(__dirname, "../../../", "public/imgs/avatar/" + elem_Img.filename), function(err) {
                if (err) {
                    console.log(err);
                }
                else console.log("delete img is success");
            });
        })
    }
    else res.status(500).json({success: false, notification: "unknown error"});
}
function deleteImageAvatarV2(name_File) {
    try {
        fs.unlink(path.join(__dirname, "../../../", "public/imgs/avatar/" + name_File), function(err) {
            if (err) {
                console.log("daynay:"+err);
            }
            else console.log("delete img is success");
        });
    } catch (error) {
        console.log("day2:"+error);
    }
}
router.get("/notification", function(req, res) {
    var id = req.user._id;
    data_Order_From_DB.getNotificationOrdersToday(id, function(result) {
        if (!result) res.status(500).json({ success: false });
        else res.status(200).json({
            success: true,
            result: result
        })
    })
})
//-----------MODULE EXPORTS -----------
module.exports = router;