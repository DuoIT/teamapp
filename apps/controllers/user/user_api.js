const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const config = require("config");

const data_User_From_DB = require(path.join(__dirname, "../../", "/models/UserModel")); //"../models/user"
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
                    if (result.role.name_role == "user" && result.role.licensed == true) {
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

// API for users
router.get("/listmonan", function(req, res) {

});

// router.get("/liststore", function(req, res) {
//     var user = req.user;
//     var id = user._id;
//     data_User_From_DB.getAllStores(id, function(result) {
//         if (!result) res.status(500).json({ data: { success: false } });
//         else res.status(200).json({
//             data: {
//                 success: true,
//                 result: result,
//             }
//         })
//     });
// });
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