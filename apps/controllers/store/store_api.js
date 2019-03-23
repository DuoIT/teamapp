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
//-----sanpham-------------
router.get("/listsanpham", function(req, res) {
    var id = req.user._id;
    
    data_Monan_From_DB.getMonAnById(id, function(result) {
        if(!result) res.status(500).json({data:{success:false}});
        else res.status(200).json({
            data:{
                success : true,
                result : result
            }});
    
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