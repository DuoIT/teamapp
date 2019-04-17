const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const config = require("config");
const data_User_From_DB = require(path.join(__dirname, "../../", "/models/user")); //"../models/user"
const data_Monan_From_DB = require(path.join(__dirname, "../../", "/models/monan")); //"../models/user"
const data_Profile_From_DB = require(path.join(__dirname, "../../", "/models/profile")); //"../models/profile"
const data_Order_From_DB = require(path.join(__dirname, "../../", "/models/order")); //"../models/order"
const data_Doanhthu_From_DB = require(path.join(__dirname, "../../", "/models/doanhthu")); //"../models/order"
const bcrypt = require(path.join(__dirname, "../../", "/helpers/encode_password")); //"../helpers/encode_password"

var router = express.Router();

//---------------------check role-------------------
router.use(function(req, res, next) {
    var tokenBearer = req.headers['authorization'];
    var bearer = null;
    if(typeof tokenBearer !== 'undefined') {
        tokenBearerSplit = tokenBearer.split(' ');
        bearer = tokenBearerSplit[1];
    }
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
                        console.log(result.role.name_role);
                        if (result.role.name_role == "store" && result.role.licensed == true) {
                            console.log("here");
                            decoded.role = result.role;
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
//-----sanpham-------------
router.get("/listsanpham", function(req, res, next) {
    var user = req.user;
    var id = user._id;
    var permission = user.role.permission;

    var id_Monan = req.body.id || req.query.id;
    if(!id_Monan || id_Monan.trim().length == 0) return next();
    if (check_Permission(permission, "monan", 1) == false) return res.status(401).json({success: false, notification: "You can't view monan"});


})
router.get("/listsanpham", function(req, res) {
    var user = req.user;
    var id = user._id;
    var permission = user.role.permission;
    //------CHECK PERMISSION-------------
    if (check_Permission(permission, "monan", 1) == false) return res.status(401).json({success: false, notification: "You can't view monan"});

    data_Monan_From_DB.getMonAnById(id, function(result) {
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
    console.log(id);
    //---CHECK PERMISSION-----
    if (check_Permission(permission, "monan", 2) == false) return res.status(401).json({success: false, notification: "You can't ADD monan"});

    var sanpham = req.body;
    var danhmuc = sanpham.danhmuc;
    var ten = sanpham.ten;
    var mota = sanpham.mota;
    var hinhanh_url = req.headers.host + "/images/monan?id=monan_default.jpg";
    var gia = sanpham.gia;
    var soluong = sanpham.soluong;
    var trungbinhsao = 0;
    //CHECK INPUT VALID
    if (!danhmuc || danhmuc.trim().length == 0) return res.status(400).json({success: false, notification: "input's wrong"});
    else if (danhmuc.trim() != "com" && danhmuc.trim() != "thucan" && danhmuc.trim() != "canh")
        return res.status(400).json({success: false, notification: "danhmuc have to 1 in 3 values ('com','canh','thucan')"});

    if (!sanpham) return res.status(400).json({success: false, notification: "input's wrong"});

    if (!ten || ten.trim().length == 0 || !gia || Number.isNaN(gia) || !soluong || Number.isNaN(soluong))
        return res.status(400).json({success: false, notification: "input's wrong"});
    var data = {
        ten: ten,
        mota: mota,
        hinhanh_url: hinhanh_url,
        gia: gia,
        soluong: soluong,
        trungbinhsao: trungbinhsao
    }

    data_Monan_From_DB.createMonAnOfStore(id, danhmuc, data, function(result) {
        if (!result) res.status(500).json({success: false, notification: "unknown error"});
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
router.put("/listsanpham", function(req, res) {
        //DEFINE CODDE........
        var user = req.user;
        var id = user._id;
        var permission = user.role.permission;
        if (check_Permission(permission, "monan", 3) == false) return res.status(401).json({ success: false, notification: "You can't EDIT monan"});
        var id_monan = req.query.id_monan || req.body.id_monan;
        var danhmuc = req.query.danhmuc || req.body.danhmuc;
        var ten = req.query.ten || req.body.ten;
        var mota = req.query.mota || req.body.mota;
        var hinhanh_url = null;
        var gia = req.query.gia || req.body.gia;
        var soluong = req.query.soluong || req.body.soluong;

        if (!danhmuc || danhmuc.trim().length == 0) return res.status(400).json({success: false, notification: "input's wrong"});
        else if (danhmuc.trim() != "com" && danhmuc.trim() != "thucan" && danhmuc.trim() != "canh")
            return res.status(400).json({ success: false, notification: "danhmuc have to 1 in 3 values ('com','canh','thucan')"});

        if (!ten || ten.trim().length == 0 || !gia || Number.isNaN(gia) || !soluong || Number.isNaN(soluong))
            return res.status(400).json({ success: false, notification: "input's wrong" });

        var data = {
            ten: ten,
            mota: mota,
            hinhanh_url: hinhanh_url,
            gia: gia,
            soluong: soluong,
        }

        data_Monan_From_DB.updateMonAnById(id, id_monan, danhmuc, data, function(result) {
            if (!result) res.status(500).json({ success: false, notification: "unknow error" });
            else res.status(200).json({ 
                success: true,
                notification: "updated is success" 
            });
        })
    })
    //------profile---------
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
router.put("/profile", function(req, res) {
        var id = req.user._id;
        var user = req.body;

        var name_personal = user.name_personal;
        var address = user.address;
        var name_store = user.name_store;
        var phonenumber = user.phonenumber;
        var tenthanhpho = user.tenthanhpho;
        var tenquan = user.tenquan;
        var tenduong = user.tenduong;
        var mota = user.mota;
        var avarta_url = null;

        if (!phonenumber || phonenumber.trim().length == 0 ||
            !tenthanhpho || tenthanhpho.trim().length == 0 || !tenquan || tenquan.trim().length == 0 || !name_personal || name_personal.trim().length == 0 ||
            !name_store || name_store.trim().length == 0)
            return res.status(400).json({ success: false, notification: "ban phai nhap day du thong tin" });

        var data = {
            name_personal: name_personal,
            address: address,
            name_store: name_store,
            phonenumber: phonenumber,
            tenthanhpho: tenthanhpho,
            tenquan: tenquan,
            tenduong: tenduong,
            mota: mota,
            avarta_url: avarta_url
        }

        data_Profile_From_DB.updateProfileStoreById(id, data, function(result) {
            if (!result) res.status(500).json({ success: false } );
            else res.status(200).json({ 
                success: true, 
                notification: "updated is success" 
            });
        })
    })
    //------order--------
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
//--------doanhthu---------
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

    var data = {
        tongtien: soluong * gia,
        giodat: giodat,
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
        }]
    }

    data_Doanhthu_From_DB.addOrderDoanhThuById(id, data, function(result) {
        if (result) {
            console.log("result:" + result);
        } else console.log("khong co ket qua");
    })
})
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


//-----------MODULE EXPORTS -----------
module.exports = router;