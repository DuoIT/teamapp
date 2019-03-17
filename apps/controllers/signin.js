const express = require("express");
const user_Service = require("../models/user");
const bcrypt = require("../helpers/encode_password");
var router = express.Router();

router.get("/", function(req, res) {
    console.log("da vao signin");
    res.render("signin", {data:{error:""}});
}); 

router.post("/", function(req, res) {
    var user = req.body;
    var input_password = user.password;
    var input_username = user.username;
    console.log(input_username);
    console.log(input_password);
    user_Service.getUserForSignin(input_username, input_password, function(result) {
        if(!result) res.status(404).json({error : "true"});
        else res.status(200).json(result);
    });
});

module.exports = router;