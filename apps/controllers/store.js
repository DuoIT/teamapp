const express = require("express");
const data_User_From_DB = require("../models/user");
const bcrypt = require("../helpers/encode_password");

var router = express.Router();
//---------------------API------------------------
router.get("/", function(req, res) {
    console.log("Came into store's page");
}); 
//---------API SIGNUP FOR USERS ON WEB APP-----------
router.post("/signup", function(req, res) {
    console.log("into signup of store");
    var user = req.body;
    var username = user.username;
    var encode_Password = bcrypt.encode_Password(user.password);

    var name = user.name;
    var address = user.address;
    var phonenumber = user.phonenumber;
    var tenthanhpho = user.tenthanhpho;
    var tenquan = user.tenquan;
    var tenduong = user.tenduong;
    var mota = user.mota;
    //have to edit schema for new DB
    var data_Of_DichVu = {
        username : username,
        password : encode_Password,
        role : {
            name_role : "store",
            description : "Co the ban do an",
            licensed : true,
            permission : [{
                name_per : "monan",
                description : "CRUD monan cua minh",
                per_detail : {
                    view : true,
                    create : true,
                    update : true,
                    delete : true
                }
            },
            {
                name_per : "comment",
                description : "CRUD comment trong monan cua minh",
                per_detail : {
                    view : true,
                    create : false,
                    update : false,
                    delete : false
                }
            }]
        },
        infomation : {
            name : name,
            address : address, 
            phonenumber : phonenumber,
            avatar_url : null,
        },
        dichvu : {
            ten : name,
            diachi : {
                tenthanhpho : tenthanhpho,
                tenquan : tenquan,
                tenduong : tenduong
            },
            mota : mota, 
            avatar_url : null,
        }
    }
    data_User_From_DB.getUserByUsername(username, function(result){
        if(result.length != 0) res.status(400).json({notification:"username is exist"});                                                 //status 400 for same username
        else data_User_From_DB.createUser(data_Of_DichVu, function(result) {
            if(result)          
                res.status(200).json({_id : result._id});            
            else res.status(500).json({notification:"server error"});                                                                //status 500 for no know erroe
        });
        
    });
});


//------------------EXPORT MODULE------------------
module.exports = router;

