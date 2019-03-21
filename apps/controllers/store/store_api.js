const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const config = require("config");
const data_User_From_DB = require(path.join(__dirname, "../../", "/models/user"));//"../models/user"
const bcrypt = require(path.join(__dirname, "../../", "/helpers/encode_password"));//"../helpers/encode_password"

var router = express.Router();

//---------------------check role-------------------
router.use(function(req, res, next) {
    var token = req.body.token || req.query.token;

    if(!token) return res.status(403).json({ notification: "no token" });    
    else {
        jwt.verify(token, config.get("jsonwebtoken.codesecret"), function(err, decoded) {
            if(err) return res.json({notification: "token is error" });  
            else {
                req.user = JSON.stringify(decoded);
                next();
            }
        })
    }
});
//---------API FOR STORE--------------
router.get("/listsanpham", function(req, res) {
    res.json(req.user);
})

//-----------MODULE EXPORTS -----------
module.exports = router;