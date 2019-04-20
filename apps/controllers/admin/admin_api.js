const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const config = require("config");
const multer = require("multer");
const fs = require("fs");
const data_User_From_DB = require(path.join(__dirname, "../../", "/models/adminUser")); //"../models/user"
const data_Monan_From_DB = require(path.join(__dirname, "../../", "/models/adminMonan")); //"../models/user"
const data_Order_From_DB = require(path.join(__dirname, "../../", "/models/order")); //"../models/order"
const data_Doanhthu_From_DB = require(path.join(__dirname, "../../", "/models/adminDoanhthu")); //"../models/order"
const bcrypt = require(path.join(__dirname, "../../", "/helpers/encode_password")); //"../helpers/encode_password"

var router = express.Router();

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
                        if (result.role.name_role == "admin" && result.role.licensed == true) {
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
//----LISTSANPHAM-----thieu delete
router.get("/listsanpham", function(req, res) {
    data_Monan_From_DB.getListMonAnById(function(result) {
        if (!result) res.status(500).json({ success: false } );
        else res.status(200).json({
            success: true,
            result: result
        });

    });
});
router.delete("/listsanpham/:id", function(req, res) {
    var id_monan = req.query.id || req.body.id || req.params["id"];

    if (!id_monan || id_monan.trim().length == 0)
        return res.status(400).json({ success: false, notification: "input's wrong" });

    data_Monan_From_DB.deleteMonAnById(id_monan, function(result) {
        if (!result) res.status(500).json({ success: false, notification: "You can't ADD monanunknown error" });
        else res.status(200).json({ 
            success: true, 
            notification: "delete is success" 
        });
    })

})
//--------doanhthu---------
router.get("/listdoanhthu", function(req, res) {
        data_Doanhthu_From_DB.getListDoanhThu(function(result) {
            if (!result) res.status(500).json({ success: false });
            else res.status(200).json({
                success: true,
                result: result
            })
        })
})
//--------User---------
router.get("/users/:id", function(req, res, next) {
    var id = req.query.id || req.body.id || req.params["id"];
    if(!id) return next();
    console.log(id);

    data_User_From_DB.getProfileUserById(id ,function(result) {
        if (!result) res.status(500).json({ success: false });
        else res.status(200).json({
            success: true,
            result: result
        })
    })
})
router.get("/users", function(req, res) {
        data_User_From_DB.getAllUsers(function(result) {
            if (!result) res.status(500).json({ success: false });
            else res.status(200).json({
                success: true,
                result: result
            })
        })
})
router.delete("/users/:id", function(req , res) {
    var id = req.body.id || req.query.id || req.params["id"];
    if(!id) return res.status(401).json({ success: false, notification:"HAVE NO ID!" });
    data_User_From_DB.deleteUser(id, function(result) {
        if (!result) res.status(500).json({ success: false });
            else res.status(200).json({
                success: true,
                notification:"DELETE SUCCESS!"
            })
    })
});
router.post("/users", function(req, res) {
    console.log(req.user);
    var user = req.body;
    var username = user.username;
    var password = config.get("defaultpassword");

    var name = user.ten;
    var address = user.address;
    var phonenumber = user.phonenumber;
    var name_role = user.name_role.trim();
    var avatar_default_url = req.headers.host + "/images/avatar?id=avatar_default.jpg";
    var dichvu_default_url = req.headers.host + "/images/avatar?id=dichvu_default.jpg";
    //CHECK INPUT VALID
    if (!username || username.trim().length == 0 || !phonenumber || phonenumber.trim().length == 0 ||
        !name || name.trim().length == 0 || !name_role || name_role.length == 0)
        return res.status(400).json({ data: { success: false, notification: "ban phai nhap day du thong tin" } });
    if(name_role != "store" && name_role != "user") 
        return res.status(400).json({ data: { success: false, notification: "phai nhap role: store hoac user" } });
    //ENCODE PASSWORD
    var encode_Password = bcrypt.encode_Password(password);
    //have to edit schema for new DB
    var data = null;
    if(name_role == "store") {
        data = {
            username: username,
            password: encode_Password,
            role: {
                name_role: "store",
                description: "Co the ban do an",
                licensed: true,
                permission: [{
                        name_per: "monan",
                        description: "CRUD monan cua minh",
                        per_detail: {
                            view: true,
                            create: true,
                            update: true,
                            delete: true
                        }
                    },
                    {
                        name_per: "comment",
                        description: "CRUD comment trong monan cua minh",
                        per_detail: {
                            view: true,
                            create: true,
                            update: false,
                            delete: true
                        }
                    },
                    {
                        name_per: "profile",
                        description: "EDIT profile cua minh",
                        per_detail: {
                            view: false,
                            create: false,
                            update: true,
                            delete: false
                        }
                    }
                ]
            },
            information: {
                name: name,
                address: address,
                phonenumber: phonenumber,
                avatar_url: avatar_default_url,
            },
            dichvu: {
                avatar_url: dichvu_default_url,
                danhmuc: [{
                        ten: "com",
                        mota: "Cơm là một loại thức ăn được làm ra từ gạo bằng cách đem nấu với một lượng vừa đủ nước.",
                    },
                    {
                        ten: "thucan",
                        mota: "thức ăn kèm cơm",
                    },
                    {
                        ten: "canh",
                        mota: "thức ăn, cơm kèm canh",
                    }
                ]
            }
        }
    }
    else if(name_role == "user") {
        data = {
            username: username,
            password: encode_Password,
            role: {
                name_role: "user",
                description: "Co the tim kiem do an",
                licensed: true,
                permission: [
                    {
                        name_per: "comment",
                        description: "CRUD comment cua minh",
                        per_detail: {
                            view: true,
                            create: true,
                            update: true,
                            delete: true
                        }
                    }
                ]
            },
            infomation: {
                name: name,
                address: address,
                phonenumber: phonenumber,
                avatar_url: avatar_default_url,
            },
        }
    }
    
    if(!data) return res.status(500).json({ data: { success: false, notification: "khong xac dinh" } });

    data_User_From_DB.getUserByUsername(username, function(result) {
        console.log(result);
        if (result) return res.status(401).json({ data: { success: false, notification: "username was exist" } }); //status 400 for same username
        data_User_From_DB.createUser(data, function(result) {
            if (result) return res.status(200).json({ data: { success: true } });
            return res.status(500).json({ data: { success: false } }); //status 500 for no know erroe
        });

    });
});
var storage_Profile = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/imgs/avatar');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().getTime() + "_" + file.originalname);
    }
})
var upload_Profile = multer({ storage: storage_Profile });
router.put("/users/:id", upload_Profile.single("avatar"),function(req, res) {
    var id = req.query.id || req.body.id || req.params["id"];
    console.log(id);
    var profile = req.body;

    var name_personal = profile.name;
    var address_personal = profile.address;
    var phonenumber_personal = profile.phonenumber;
    var avatar_url_personal = profile.avatar_url;
    if(req.file) avatar_url_personal = req.headers.host + "/images/avatar?id=" + req.file.filename;
    var name_role = profile.name_role.trim(); 
    
    if (!name_personal || name_personal.trim().length == 0 || !name_role || name_role.length == 0 || !address_personal || address_personal.length == 0 ||
         !phonenumber_personal || phonenumber_personal.trim().length == 0)
        {
            if(req.file) deleteImage(req);
            return res.status(400).json({ success: false, notification: "ban phai nhap day du thong tin" });}
    
    var data = {
        name_personal: name_personal,
        address_personal: address_personal,
        phonenumber_personal: phonenumber_personal,
        avatar_url_personal: avatar_url_personal,
        name_role: name_role
    }

    data_User_From_DB.updateProfileUserById(id, data, function(result) {
        if (!result) {
            if(req.file) deleteImage(req);
            res.status(500).json({ success: false } );}
        else res.status(200).json({ 
            success: true, 
            notification: "updated is success" 
        });
    })
})
function deleteImage(req) {
    fs.unlink(path.join(__dirname, "../../../", "public/imgs/avatar/" + req.file.filename), function(err) {
        if (err) {
            console.log(err);
        }
        else console.log("delete img is success");
    });
}
//-----------MODULE EXPORTS -----------
module.exports = router;