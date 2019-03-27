const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const config = require("config");
const data_User_From_DB = require(path.join(__dirname, "../../", "/models/user"));//"../models/user"
const data_Monan_From_DB = require(path.join(__dirname, "../../", "/models/monan"));//"../models/user"
const data_Profile_From_DB = require(path.join(__dirname, "../../", "/models/profile"));//"../models/profile"
const data_Order_From_DB = require(path.join(__dirname, "../../", "/models/order"));//"../models/order"
const data_Doanhthu_From_DB = require(path.join(__dirname, "../../", "/models/doanhthu"));//"../models/order"
const bcrypt = require(path.join(__dirname, "../../", "/helpers/encode_password"));//"../helpers/encode_password"

var router = express.Router();

//---------------------check role-------------------
router.use(function(req, res, next) {
    var token = req.body.token || req.query.token;
    
    if(!token) return res.status(403).json({ notification: "no token" });    
    else {
        jwt.verify(token, config.get("jsonwebtoken.codesecret"), function(err, decoded) {
            if(err) res.status(403).json({data:{success:false, notification:"token error"}});  
            else {
                var id = decoded._id;
                data_User_From_DB.getUserByIdToCheckRole(id, function(result) {
                    if(!result) res.status(403).json({data:{success:false, notification:"token error, not found user"}});
                    else {
                        console.log(result.role.name_role);
                        if(result.role.name_role == "store" && result.role.licensed == true) {
                            console.log("here");
                            decoded.role = result.role;
                            req.user = decoded;
                            next();
                        }
                        else res.status(401).json({data:{success:false, notification:"this account can't access"}});
                    }
                })
                
            }
        })
    }
});
//---------API FOR STORE--------------
function check_Permission(permission, name_permission, id) {
    for(i = 0; i < permission.length; i++) {
        if(permission[i].name_per == name_permission) {
            if(id == 1) {
                if(permission[i].per_detail.view == true) {
                    return true;
                }
            }else if(id == 2) {
                if(permission[i].per_detail.create == true) {
                    return true;
                }
            }else if(id == 3) {
                if(permission[i].per_detail.update == true) {
                    return true;
                }
            }else if(id == 4) {
                if(permission[i].per_detail.delete == true) {
                    return true;
                }
            }
        }
    }
    return false;
}
//-----sanpham-------------
router.get("/listsanpham", function(req, res) {
    var user = req.user;
    var id = user._id;
    var permission = user.role.permission;
    //------CHECK PERMISSION-------------
    if(check_Permission(permission, "monan", 1) == false) return res.status(401).json({data:{success:false, notification:"You can't view monan"}});

    data_Monan_From_DB.getMonAnById(id, function(result) {
        if(!result) res.status(500).json({data:{success:false}});
        else res.status(200).json({
            data:{
                success : true,
                result : result
            }});
    
    });
})
router.post("/listsanpham/add", function(req, res) {
    var user = req.user;
    var id = user._id;
    var permission = user.role.permission;
    console.log(id);
    //---CHECK PERMISSION-----
    if(check_Permission(permission, "monan", 2) == false) return res.status(401).json({data:{success:false, notification:"You can't ADD monan"}});

    var sanpham = req.body;
    var danhmuc = sanpham.danhmuc;
    var ten = sanpham.ten;
    var mota = sanpham.mota;
    var hinhanh_url = null;
    var gia = sanpham.gia;
    var soluong = sanpham.soluong;
    var trungbinhsao = 0;
    //CHECK INPUT VALID
    if(!danhmuc || danhmuc.trim().length == 0) return res.status(400).json({data:{success:false, notification:"input's wrong"}});
    else if(danhmuc.trim() != "com" && danhmuc.trim() != "thucan" && danhmuc.trim() != "canh") 
    return res.status(400).json({data:{success:false, notification:"danhmuc have to 1 in 3 values ('com','canh','thucan')"}});

    if(!sanpham) return res.status(400).json({data:{success:false, notification:"input's wrong"}});

    if(!ten || ten.trim().length == 0 || !gia || !soluong ) 
    return res.status(400).json({data:{success:false, notification:"input's wrong"}});

    var data = {
        ten : ten,
        mota : mota,
        hinhanh_url : hinhanh_url,
        gia : gia,
        soluong : soluong,
        trungbinhsao : trungbinhsao
    }

    data_Monan_From_DB.createMonAnOfStore(id, danhmuc, data, function(result) {
        if(!result) res.status(500).json({data:{success:false, notification:"unknown error"}});
        else res.status(200).json({data:{success:true, notification:"created is success"}});
    });


})
//------profile---------
router.get("/profile", function(req, res) {
    var id = req.user._id;

    data_Profile_From_DB.getProfileUserById(id, function(result) {
        if(!result) res.status(500).json({data:{success:false}});
        else res.status(200).json({
            data:{
                success : true,
                result : result
            }})
    })
});
//------order--------
router.get("/listorder", function(req, res) {
    var id = req.user._id;

    data_Order_From_DB.getListOrderById(id, function(result) {
        if(!result) res.status(500).json({data:{success:false}});
        else res.status(200).json({
            data:{
                success : true,
                result : result
            }})
    })
});
//--------doanhthu---------
router.get("/listdoanhthu", function(req, res) {
    var id = req.user._id;

    data_Doanhthu_From_DB.getListDoanhThu(id, function(result) {
        if(!result) res.status(500).json({data:{success:false}});
        else res.status(200).json({
            data:{
                success : true,
                result : result
            }})
    })
})
//-----------MODULE EXPORTS -----------
module.exports = router;