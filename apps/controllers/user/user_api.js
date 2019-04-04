const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const config = require("config");

const data_User_From_DB = require(path.join(__dirname, "../../", "/models/user")); //"../models/user"
const data_Profile_From_DB = require(path.join(__dirname, "../../", "/models/profile")); //"../models/profile"
const bcrypt = require(path.join(__dirname, "../../", "/helpers/encode_password")); //"../helpers/encode_password"

var router = express.Router();

//---------------Check role----------------
router.use(function(req, res, next) {
    var token = req.body.token || req.query.token;

    if (!token) res.status(403).json({ notification: "no token" });
    else {
        jwt.verify(token, config.get("jsonwebtoken.codesecret"), function(err, decoded) {
            var id = decoded._id;
            data_User_From_DB.getUserByIdToCheckRole(id, function(result) {
                if (!result) res.status(403).json({ data: { success: false, notification: "token error, not found user" } });
                else {
                    console.log(result.role.name_role);
                    if (result.role.name_role == "khachhang" && result.role.licensed == true) {
                        console.log("here");
                        decoded.role = result.role;
                        req.user = decoded;
                        next();
                    } else {
                        res.status(401).json({ data: { success: false, notification: "this account can't access" } });
                    }
                }
            })
        })
    }
})

// API for users
router.get("/listmonan", function(req, res) {

});

router.get("/liststore", function(req, res) {
    var user = req.user;
    var id = user._id;
    var permission = user.role.permission;

    // check permission
    //if (check_Permission(permission, "user", 1) == false) return res.status(401).json({ data: { success: false, notification: "You can't view list nguoi nau" } });
    data_User_From_DB.getAllUsersNguoiNau(id, function(result) {
        if (!result) res.status(500).json({ data: { success: false } });
        else res.status(200).json({
            data: {
                success: true,
                result: result,
            }
        })
    });
});
router.post("/addorder", function(req, res) {

});
router.get("/listdanhmuc", function(req, res) {

});

//profile for user
router.get("/profileUser", function(req, res) {
    var id = req.user._id;
});

router.put("/profileUser/updateUser", function(req, res) {

});

//-----------MODULE EXPORTS -----------
module.exports = router;