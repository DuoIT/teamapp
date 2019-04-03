const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const config = require("config");

const data_User_From_DB = require("../models/user");//"../models/user"
var router = express.Router();
var trangThaiToken = false;

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/imgs/avatar');
    },
    filename : function(req, file, cb) {
        cb(null, new Date().getTime() + "_" + file.originalname);
    }
})
var upload = multer({ storage : storage});
// var upload =multer();
router.post("/avatar/store", upload.single("avatar"), function(req, res, next) {
    var token = req.body.token || req.query.token;
    console.log("token in image:"+token);
    if(!token) {
        deleteImage(req);
        return res.status(401).json({data:{success:false, notification:"this account can't access"}});    }
    else {
        jwt.verify(token, config.get("jsonwebtoken.codesecret"), function(err, decoded) {
            if(err) {
                deleteImage(req);
                return res.status(500).json({data:{success:false}});}  
            else {
                var id = decoded._id;
                data_User_From_DB.getUserByIdToCheckRole(id, function(result) {
                    if(!result) {
                        deleteImage(req);
                        res.status(403).json({data:{success:false, notification:"token error, not found user"}});}
                    else {
                        console.log(result.role.name_role);
                        if(result.role.name_role == "store" && result.role.licensed == true) {
                            decoded.role = result.role;
                            req.user = decoded;
                            console.log("file_name:" + req.file.filename);
                            var avatar_url = req.headers.host + "/images/avatar?id=" + req.file.filename;
                            data_User_From_DB.updateAvatarOfStore(decoded._id, avatar_url, function(result) {
                                if(!result) {
                                    deleteImage(req);
                                    res.status(500).json({data:{success:false}});}
                                else return res.status(200).json({data:{success:true, result : {url : avatar_url}}});
                            });
                        }
                        else {
                            deleteImage(req);
                            res.status(401).json({data:{success:false, notification:"this account can't access"}});}
                    }
                })
            }
        })
    }
    
})
router.post("/avatar/user", upload.single("avatar"), function(req, res, next) {
    var token = req.body.token || req.query.token;
    console.log("token in image:"+token);
    if(!token) {
        deleteImage(req);
        return res.status(401).json({data:{success:false, notification:"this account can't access"}});  }  
    else {
        jwt.verify(token, config.get("jsonwebtoken.codesecret"), function(err, decoded) {
            if(err) {
                deleteImage(req);
                return res.status(500).json({data:{success:false}}); } 
            else {
                var id = decoded._id;
                data_User_From_DB.getUserByIdToCheckRole(id, function(result) {
                    if(!result) res.status(403).json({data:{success:false, notification:"token error, not found user"}});
                    else {
                        console.log(result.role.name_role);
                        if((result.role.name_role == "store" || result.role.name_role == "user") && result.role.licensed == true) {
                            decoded.role = result.role;
                            req.user = decoded;
                            console.log("file_name:" + req.file.filename);
                            var avatar_url = req.headers.host + "/images/avatar?id=" + req.file.filename;
                            data_User_From_DB.updateAvatarOfUser(decoded._id, avatar_url, function(result) {
                                if(!result) {
                                    deleteImage(req);
                                    res.status(500).json({data:{success:false}});}
                                else return res.status(200).json({data:{success:true, result : {url : avatar_url}}});
                            });
                        }
                        else {
                            deleteImage(req);
                            res.status(401).json({data:{success:false, notification:"this account can't access"}});}
                    }
                })
            }
        })
    }
    
    
})
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
function deleteImage(req) {
    fs.unlink(path.join(__dirname, "../../", "public/imgs/avatar/"+req.file.filename), function(err) {
        if(err) console.log("loiunlinkimg");
        else console.log("success");
    });
}
//------------upload image--avatar----------------

// var upload = multer({ storage : storage});
// router.post("/avatar", upload.single('proFile'),function(req, res) {
//     var avarta = req.body || req.query;
//     console.log("davaoday");
//     console.log(req.file);
//     console.log(avarta.name);
    
//     // if(trangThaiToken == true) {
//     //     var id = req.user._id;

//     // }
    
// })


module.exports = router;