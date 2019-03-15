const express = require("express");
const data_User_From_DB = require("../models/user");
const bcrypt = require("../helpers/encode_password");

var router = express.Router();

router.get("/", function(req, res) {
    console.log("came into signup");
    //response the signin's page
    res.render("signup", {data:{error:""}});
}); 

router.post("/", function(req, res) {
    var user = req.body;
    var username = user.username;
    var encode_Password = bcrypt.encode_Password(user.password);
    var data_Of_User;
    if(user.check_NguoiNau) {
        data_Of_User = {
            username : user.username,
            password : encode_Password,
            per_detail : [{
                action_name : "comment",
                action_code : 2,
                check_action : true
            },{
                action_name : "view",
                action_code : 1,
                check_action : true
            }],
            khachhang : {
                name : user.name,
                phonenumber : user.phonenumber,
                address : user.address,
            }
        }
    }else {
        data_Of_User = {
            username : user.username,
            password : encode_Password,
            per_detail : [{
                action_name : "post",
                action_code : 3,
                check_action : true
            },{
                action_name : "comment",
                action_code : 2,
                check_action : true
            },{
                action_name : "view",
                action_code : 1,
                check_action : true
            }],
            nguoinau : {
                name : user.name,
                phonenumber : user.phonenumber,
                address : user.address,
            }
        }
    }
    
    data_User_From_DB.getUserByUsername(username, function(result){
       if(result.length != 0) res.status(200).json({notification : "false"});
       else data_User_From_DB.createUser(data_Of_User, function(result) {
            if(result) res.status(201).json({notification : "true"});
            else res.status(200).json({notification : "false"});
       });
       
    });
});

router.post("/update", function(req, res) {
    var user = req.body;
    if(user.check_NguoiNau) {
        data_Of_User = {
            khachhang : {
                sex: user.sex,
                birthday : user.birthday
            }
        }
    }else {
        data_Of_User = {
            nguoinau : {
                avarta : user.avarta,
                thoigian_giaohang : user.thoigian_giaohang,
                tb_star : user.tb_star
            }
        }
    }
    //command line of updation data for user
})

module.exports = router;