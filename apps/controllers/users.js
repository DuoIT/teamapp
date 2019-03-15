const express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
    console.log("da vao user");
}); 

module.exports = router;

