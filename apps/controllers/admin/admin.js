const express = require("express");
const path = require("path");
const data_User_From_DB = require(path.join(__dirname, "../../", "/models/user")); //"../models/user"
const data_MonAn_From_Db = require(path.join(__dirname, "../../", "/models/monan")); //"../models/monan"

var router = express.Router();

router.get("/", function(req, res) {
    //check admin...
    data_Users_From_Db.getAllUsers(function(results) {
        console.log(results);
    })
});
//---------------------------------Manager user--------------------------
router.get("/users", function(req, res) {
    //check account accessed this place, is that admin's account
    //...
    data_Users_From_Db.getAllUsers(function(results) {
        if (results) res.status(200).json(results);
        else res.status(200).json();
    })
})
router.get("/users/nguoinau", function(req, res) {
    //................get user nguoi nau
    data_Users_From_Db.getAllUsersNguoiNau(function(results) {
        if (results) res.status(200).json(results);
        else res.status(200).json();
    })
});
router.get("users/khachhang", function(req, res) {
    //...................get usser khach hang
    data_Users_From_Db.getAllUsersKhachHang(function(results) {
        if (results) res.status(200).json(results);
        else res.status(200).json();
    })
});
router.post("/users", function(req, res) {
    //check admin...
    var user = req.body;
    var username = user.username;
    var encode_Password = bcrypt.encode_Password(user.password);
    var data_Of_User;
    if (user.check_NguoiNau) {
        data_Of_User = {
            username: user.username,
            password: encode_Password,
            per_detail: [{
                action_name: "comment",
                action_code: 2,
                check_action: true
            }, {
                action_name: "view",
                action_code: 1,
                check_action: true
            }],
            khachhang: {
                name: user.name,
                phonenumber: user.phonenumber,
                address: user.address,
            }
        }
    } else {
        data_Of_User = {
            username: user.username,
            password: encode_Password,
            per_detail: [{
                action_name: "post",
                action_code: 3,
                check_action: true
            }, {
                action_name: "comment",
                action_code: 2,
                check_action: true
            }, {
                action_name: "view",
                action_code: 1,
                check_action: true
            }],
            nguoinau: {
                name: user.name,
                phonenumber: user.phonenumber,
                address: user.address,
            }
        }
    }

    data_User_From_DB.getUserByUsername(username, function(result) {
        if (result.length != 0) res.status(200).json({ notification: "false" });
        else data_User_From_DB.createUser(data_Of_User, function(result) {
            if (result) res.status(201).json({ notification: "true" });
            else res.status(200).json({ notification: "false" });
        });

    });
});
router.delete("/users", function(req, res) {
    //check admin...
    var id_admin = req.body._id;
    var id = req.body.id_user;
    data_Users_From_Db.deleteUser(id, function(result) {
        if (!result) res.status(200).json({ notification: "Delete fail" });
        else res.status(200).json({ notification: "Delete success!" });
    });
});
router.put("/users", function(req, res) {
    var user = req.body;
    //check admin...equal ID
    //id_admin = user._id;

    data_Users_From_Db.updateUser(user, function(result) {
        if (result) res.status(200).json({ notification: "update success!" });
        else res.status(200).json({ notification: "update fail!" });
    });
});
//---------------------------------Manager Monan--------------------------
router.get("/monan", function(req, res) {
    data_MonAn_From_Db.getAllMonAn(function(result) {
        if (!result) res.status(200).json({ notification: "False" });
        else res.status(200).json(result);
    })
})
module.exports = router;