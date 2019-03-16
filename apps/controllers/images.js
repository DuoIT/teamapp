const express = require("express");
const fs = require("fs");
var router = express.Router();

router.get("/avatar", function(req, res) {
    var filename = req.query.id;
    // console.log(filename);
    // var options = {
    //     root: __dirname + "/public/imgs/",
    //     dotfiles: 'allow',
    //     headers: {
    //         'x-timestamp': Date.now(),
    //         'x-sent': true
    //     }
    //   };
    
    //   res.sendFile(filename + ".jpg", options, function (err) {
    //     if (err) {
    //       console.log("error get imgs");
    //     } else {
    //       console.log('Sent:', filename);
    //     }
    //   });
    res.contentType('image/jpeg');
    var project_name = "public";
    var director = __dirname.substring(0, __dirname.lastIndexOf(project_name) + project_name.length) + "imgs/avatar/";
    console.log(director);
    data = fs.readFileSync(director + filename + ".jpg");
    res.send(data);
})
router.get("/monan", function(req, res) {
    var filename = req.query.id;
    res.contentType('image/jpeg');
    
    var director = __dirname.substring(0, __dirname.lastIndexOf("DA") + 3) + "public\\imgs\\monan\\";
    console.log(director);
    data = fs.readFileSync(director + filename + ".jpg");
    res.send(data);
})


module.exports = router;