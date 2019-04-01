const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const config = require("config");

const data_Profile_From_DB = require(path.join(__dirname, "../../", "/models/profile")); //"../models/profile"

var router = express.Router();

//profile for user
router.get("/profileUser", function(req, res) {
    var id = req.user._id;
    data_Profile_From_DB.
});

router.put("/profileUser/updateUser", function(req, res) {

});
//-----------MODULE EXPORTS -----------
module.exports = router;