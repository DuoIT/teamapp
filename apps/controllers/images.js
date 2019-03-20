const express = require("express");
const fs = require("fs");
const path = require("path");
var router = express.Router();

router.get("/avatar", function(req, res) {
    var filename = req.query.id;
    res.contentType('image/jpeg');
    var project_name = "apps";
    // var director = __dirname.substring(0, __dirname.lastIndexOf(project_name)) + "public/imgs/avatar/";
    //var director = path.normalize(__dirname);
    // console.log(director);
    var director = path.join(__dirname, "../../", "public/imgs/avatar/");
    console.log(director);
    data = fs.readFileSync(director + filename);
    res.send(data);
})
router.get("/monan", function(req, res) {
    var filename = req.query.id;
    res.contentType('image/jpeg');
    
    // var director = __dirname.substring(0, __dirname.lastIndexOf("DA") + 3) + "public\\imgs\\monan\\";
    var director = path.join(__dirname, "../../", "public/imgs/monan/");
    console.log(director);
    data = fs.readFileSync(director + filename);
    res.send(data);
})


module.exports = router;