const express = require("express");
const path = require("path");
const data_User_From_DB = require(path.join(__dirname, "../../", "/models/UserModel")); //"../models/user"
const bcrypt = require(path.join(__dirname, "../../", "/helpers/encode_password")); //"../helpers/encode_password"

var router = express.Router();
//---------------------Route API------------------------
router.get("/", function(req, res) {});
router.use("/api", require("./user_api"));
//---------API SIGNUP FOR USERS ON MOBILE APP-----------
router.post("/signup", function(req, res) {
    console.log("into signup of users");
    var user = req.body;
    var username = user.username;
    var encode_Password = bcrypt.encode_Password(user.password);

    var name = user.name;
    var address = user.address;
    var phonenumber = user.phonenumber;
    //have to edit schema for new DB
    var data_Of_DichVu = {
        username: username,
        password: encode_Password,
        role: {
            name_role: "user",
            description: "Co the tim kiem do an",
            licensed: true,
            permission: [{
                    name_per: "monan",
                    description: "CRUD monan cua minh",
                    per_detail: {
                        view: false,
                        create: false,
                        update: false,
                        delete: false
                    }
                },
                {
                    name_per: "comment",
                    description: "CRUD comment trong monan cua minh",
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
            avatar_url: null,
        }
    }
    data_User_From_DB.getUserByUsername(username, function(result) {
        if (result.length != 0) res.status(400).json({ notification: "username is exist" }); //status 400 for same username
        else data_User_From_DB.createUser(data_Of_DichVu, function(result) {
            if (result)
                res.status(200).json({ _id: result._id });
            else res.status(500).json({ notification: "server error" }); //status 500 for no know erroe
        });

    });
});

// không check token
router.get("/liststore", function(req, res) {
    data_User_From_DB.getAllStores(function(result) {
        if (!result) res.status(500).json({ data: { success: false } });
        else res.status(200).json({
            data: {
                success: true,
                result: result,
            }
        })
    });
});

router.get("/listfood", function(req, res) {
    data_User_From_DB.getAllFoods(function(result) {
        if(!result) res.status(500).json({data: {success: false}});
        else res.status(200).json({
            data: {
                success: true,
                result: result,
            }
        })
    });
});

router.get("/listcategoryfoods", function(req, res) {
    data_User_From_DB.getAllCategoryFoods(function(result) {
        if (!result) res.status(500).json({data: {success: false}});
        else res.status(200).json({
            data: {
                success: true,
                result: result,
            }
        })
    });
});

//------------------EXPORT MODULE------------------
module.exports = router;