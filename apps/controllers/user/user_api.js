const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const config = require("config");
const multer = require("multer");
const data_User_From_DB = require(path.join(__dirname, "../../", "/models/UserModel")); //"../models/user"
const data_Profile_From_DB = require(path.join(__dirname, "../../", "/models/profileUsersModel")); //"../models/profile"
const data_Order_From_DB = require(path.join(__dirname, "../../", "/models/orderUsersModel")); //"../models/profile"
const data_Comment_From_DB = require(path.join(__dirname, "../../", "/models/commentUsersModel"));
const bcrypt = require(path.join(__dirname, "../../", "/helpers/encode_password")); //"../helpers/encode_password"

var router = express.Router();

//---------------Check role----------------
router.use(function(req, res, next) {
    var tokenBearer = req.headers['authorization'];
    var bearer = null;
    if (typeof tokenBearer !== 'undefined') {
        tokenBearerSplit = tokenBearer.split(' ');
        bearer = tokenBearerSplit[1];
    }

    var token = req.body.token || req.query.token || bearer;
    try {
        if (!token) res.status(403).json({ notification: "no token" });
        else {
            jwt.verify(token, config.get("jsonwebtoken.codesecret"), function(err, decoded) {
                var id = decoded._id;
                data_User_From_DB.getUserByIdToCheckRole(id, function(result) {
                    if (!result) res.status(403).json({ data: { success: false, notification: "token error, not found user" } });
                    else {
                        console.log(result.role.name_role);
                        if (result.role.name_role == "user" && result.role.licensed == true) {
                            console.log("here");
                            decoded.role = result.role;
                            req.user = decoded;
                            next();
                        } else {
                            res.status(401).json({ data: { success: false, notification: "this account can't access" } });
                        }
                    }
                })
            })
        }
    } catch (error) {
        return res.status(401).json({ data: { success: false, notification: "token error, not found user" } });
    }
})

function check_Permission(permission, name_permission, id) {
    for (i = 0; i < permission.length; i++) {
        if (permission[i].name_per == name_permission) {
            if (id == 1) {
                if (permission[i].per_detail.view == true) {
                    return true;
                }
            } else if (id == 2) {
                if (permission[i].per_detail.create == true) {
                    return true;
                }
            } else if (id == 3) {
                if (permission[i].per_detail.update == true) {
                    return true;
                }
            } else if (id == 4) {
                if (permission[i].per_detail.delete == true) {
                    return true;
                }
            }
        }
    }
    return false;
}

// API for users

router.get("/profile", function(req, res) {
    var id = req.user._id;

    data_Profile_From_DB.getProfileUserById(id, function (result) {
        if (!result) res.status(500).json({ data: { success: false } });
        else res.status(200).json({
            data: {
                success: true,
                result: result
            }
        })
    })
});
var storage_Profile = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/imgs/avatar');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().getTime() + "_" + file.originalname);
    }
})
var upload_Profile = multer({ storage: storage_Profile });
router.put("/profile", upload_Profile.single("avatar"), function(req, res) {
    var id = req.user._id;
    var profile = req.body;

    var name_per = profile.name;
    var address_per = profile.address;
    var phonenumber = profile.phonenumber;
    var avatar_url_per = null;
    try {
        if(req.file) avatar_url_per = config.get("protocol") + req.headers.host + "/images/avatar?id=" + req.file.filename;
    } catch (error) {
        deleteImageAvatar(req);
    }
    
    if (!name_per || name_per.trim().length == 0 || !address_per || address_per.trim().length == 0
        || !phonenumber || phonenumber.trim().length == 0) {
        deleteImageAvatar(req);
        return res.status(400).json({ success: false, notification: "ban phai nhap day du thong tin" });
    }
    var data = {
        name_per : name_per,
        address_per : address_per,
        avatar_url_per : avatar_url_per,
        phonenumber : phonenumber
    }

    data_Profile_From_DB.updateProfileUserById(id, data, function(result) {
        if (!result) {
            deleteImageAvatar(req);
            res.status(500).json({ success: false });}
        else res.status(200).json({
                success: true
        }) 
    })
});
router.post("/checkout", function(req, res) {
    var checkout = req.body;
    var user = req.user;
    if(!checkout || !checkout.diachi ||checkout.diachi.trim().length == 0) 
    return res.status(400).json({ success: false, notification: "Nhap thieu!" });
    data_Order_From_DB.addCheckoutToOrders(user, checkout, function(result) {
        if(!result) res.status(500).json({ data: { success: false } });
        else res.status(200).json({
                success: true,
                result: result
        }) 
    })
})
router.get("/listorder", function(req, res) {
    var user = req.user;
    var id = user._id;

    var page = req.query.page || req.body.page;
    if(!page || isNaN(page)) return res.status(400).json({success: false})

    data_Order_From_DB.getListOrder(id, page, function(result) {
        if(!result) res.status(500).json({ success: false });
        else res.status(200).json({
                success: true,
                result: result
        }) 
    })
})
router.post("/listcomment", function(req, res) {
    var id = req.user._id;
    var ten = req.user.ten;
    var avatar_url = req.user.avatar_url;
    var query = req.body;
    var id_monan = query.id;
    var content = query.content;
    var rating = query.rating;
    if(!rating) rating = 0;
    if(!content) content = "";
    if(!id_monan || id_monan.trim().length == 0)  return res.status(400).json({ data: { success: false, notification:"Nhap thieu id mon an!" } });
    var data = {
        comment: content,
        star: rating,
        nguoimua: {
            id: id,
            name: ten,
            avatar_url: avatar_url
        }
    }
    data_Comment_From_DB.addCommentForUser(id_monan, data, function(result) {
        if(!result) res.status(500).json({ data: { success: false} });
        else  res.status(200).json({
            success: true,
            result: result
        }) 
    })
})
function deleteImageAvatar(req) {
    try {
        if(req.file) {
            fs.unlink(path.join(__dirname, "../../../", "public/imgs/avatar/" + req.file.filename), function(err) {
                if (err) {
                    console.log(err);
                }
                else console.log("delete img is success");
            });
        }
        else res.status(500).json({success: false, notification: "unknown error"});
    } catch (error) {
        console.log(error);
    }
}
//-----------MODULE EXPORTS -----------
module.exports = router;