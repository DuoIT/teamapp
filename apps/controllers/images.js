const express = require("express");
const fs = require("fs");
const path = require("path");
var router = express.Router();

router.get("/avatar", function(req, res) {
    var filename = req.query.id || req.body.id;
    res.contentType('image/jpeg');
    
    var director = path.join(__dirname, "../../", "public/imgs/avatar/");
    data = fs.readFileSync(director + filename);
    res.send(data);
})
router.get("/monan", function(req, res) {
    var filename = req.query.id;
    res.contentType('image/jpeg');

    var director = path.join(__dirname, "../../", "public/imgs/monan/");            //path to monan model
    data = fs.readFileSync(director + filename);
    res.send(data);
})


module.exports = router;