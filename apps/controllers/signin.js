const express = require("express");
const user_Service = require("../models/user");
const bcrypt = require("../helpers/encode_password");
var router = express.Router();
//------------FOR TEST---------------
router.get("/", function(req, res) {
    console.log("da vao signin");
    res.render("signin", {data:{error:""}});
}); 
//-------------SIGNIN API------------
router.post("/", function(req, res) {
    var user = req.body;
    var input_password = user.password;
    var input_username = user.username;
    user_Service.getUserForSignin(input_username, input_password, function(result) {
        if(!result) res.status(400).json({notification:"sai username hoac password"});
        else res.status(200).json(
            {_id : result._id,
             role : result.role.name_role});                             //json return a role value
    });
});
//------------FOR EXPORT MODULE------------------   
module.exports = router;