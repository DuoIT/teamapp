const express = require("express");
const path = require("path");
const config = require("config");
const data_User_From_DB = require(path.join(__dirname, "../../", "/models/UserModel")); //"../models/user"
const data_Diachi_From_DB = require(path.join(__dirname, "../../", "/models/diachiUsersModel")); //"../models/user"
const data_Comment_From_DB = require(path.join(__dirname, "../../", "/models/commentUsersModel"));
const bcrypt = require(path.join(__dirname, "../../", "/helpers/encode_password")); //"../helpers/encode_password"

var router = express.Router();
//---------------------Route API------------------------
router.get("/", function(req, res) {});
router.use("/api", require("./user_api"));
//---------API SIGNUP FOR USERS ON MOBILE APP-----------
router.post("/signup", function(req, res) {
    console.log("into signup of users");
    var user = req.body;
    var username = user.username;
    //var encode_Password = bcrypt.encode_Password(user.password);
    var password = user.password;

    var name = user.name;
    var address = user.address;
    var phonenumber = user.phonenumber;
    var avatar_url_user = user.avatar_url;
    // CHECK Input Valid
    if (!username || username.trim().lenght == 0 || !password || password.trim().lenght == 0 || !name || name.trim().lenght == 0 || 
    !address || address.trim().lenght || !phonenumber || address.trim().lenght == 0) 
        return res.status(400).json({ data: { success: false, notification: "ban phai nhap day du thong tin" }});
    //ENCODE PASSWORD
    var encode_Password = bcrypt.encode_Password(password);
    //have to edit schema for new DB
    var data_Of_DichVu = {
        username: username,
        password: encode_Password,
        role: {
            name_role: "user",
            description: "Co the tim kiem do an",
            licensed: true,
            permission: [{
                    name_per: "monan",
                    description: "CRUD monan cua minh",
                    per_detail: {
                        view: false,
                        create: false,
                        update: false,
                        delete: false
                    }
                },
                {
                    name_per: "comment",
                    description: "CRUD comment trong monan cua minh",
                    per_detail: {
                        view: true,
                        create: true,
                        update: true,
                        delete: true
                    }
                }
            ]
        },
        information: {
            name: name,
            address: address,
            phonenumber: phonenumber,
            avatar_url: avatar_url_user,
        }
    }
    data_User_From_DB.getUserByUsername(username, function(result) {
        if (result) return res.status(401).json({ data: { success: false, notification: "username was exist" } });//status 400 for same username
        else data_User_From_DB.createUser(data_Of_DichVu, function(result) {
            if (result) return res.status(200).json({ data: { success: true } });
            else res.status(500).json({ data: { success: false } }); //status 500 for no know erroe
        });

    });
});

// không check token
var stores = [];    
router.get("/liststore", function(req, res, next) {
    var zipcode_quan = req.query.zipcode || req.body.zipcode;
    var page = req.query.page || req.body.page;
    if(!page || page.trim().lenght == 0) return res.status(400).json({ data: { success: false } });
    if(!zipcode_quan || zipcode_quan == "") return next();
    data_User_From_DB.getListStoreOfQuan(zipcode_quan, function(result) {
        if(!result) res.status(500).json({success: false});
        else {
            var fiveStore = [];
            if(stores.length == 0 || page == 1) stores = result;
            if(stores) {
                if(stores.length >= page*5){
                    for(i = (page - 1) *5; i < page *5; i++) {
                        fiveStore.push(stores[i]);
                    }
                }else {
                    for(i = (page - 1) *5; i < stores.length; i++) {
                        fiveStore.push(stores[i]);
                    }
                }
            }
            res.status(200).json({
                    success: true,
                    result: fiveStore
            })
        }
    })
})
router.get("/liststore", function(req, res) {
    var page = req.query.page || req.body.page;
    if(!page || page.trim().lenght == 0) return res.status(400).json({ data: { success: false } });
    data_User_From_DB.getAllStores(function(result) {
        if (!result) res.status(500).json({ data: { success: false } });
        else {
            var fiveStore = [];
            if(stores.length == 0 || page == 1) stores = result;
            if(stores) {
                var index = 0;
                if(stores.length >= page*5){
                    for(i = (page - 1) *5; i < page *5; i++) {
                        fiveStore.push(stores[i]);
                    }
                }else {
                    for(i = (page - 1) *5; i < stores.length; i++) {
                        fiveStore.push(stores[i]);
                    }
                }
            }
            res.status(200).json({
                success: true,
                result: fiveStore,
            })
        }
    });
});
router.get("/detailstore", function(req, res) {
    var id = req.query.idstore || req.body.idstore;

    data_User_From_DB.getDetailStoreById(id, function (result) {
        if (!result) res.status(500).json({ data: { success: false }});
        else res.status(200).json({
            data: {
                success: true,
                result: result
            }
        })
    })
});

router.get("/listfood", function (req, res) {
    var id = req.query.id_dv || req.body.id_dv;
    data_User_From_DB.getFoodByStoreId(id, function (result) {
        if (!result) res.status(500).json({ data: { success: false} });
        else res.status(200).json({
            data: {
                success: true,
                result: result
            }
        })
    })
});

router.get("/listcategoryfoods", function(req, res) {
    var id = req.query.id_dv || req.body.id_dv;
    data_User_From_DB.getAllCategoryFoods(id, function(result) {
        if (!result) res.status(500).json({data: {success: false}});
        else res.status(200).json({
            data: {
                success: true,
                result: result,
            }
        })
    })
});
var food = [];
router.get("/listfoodcate", function(req, res, next) {
    var nameCate = req.query.namecate || req.body.namecate;
    var page = req.query.page || req.body.page;
    if(!nameCate || nameCate.trim().lenght == 0) return next();
    if(!page || page.trim().lenght == 0 || isNaN(page)) return res.status(400).json({success: false, notification:"page nhap sai hoac khong ton tai!"});
    //check namecate phat giong quy dinh.
    var kiemTraNameCate = false;
    config.get("danhmuc").forEach(function(elem_Danhmuc) {
        if(elem_Danhmuc == nameCate) kiemTraNameCate = true;
    })
    if(kiemTraNameCate == false) return res.status(400).json({success: false, notification:"nameCate phai giong quy dinh!"});

    data_User_From_DB.getFoodbyCate(nameCate, function(result) {
        if (!result) res.status(500).json({ data: {success: false} });
        else{
            var fiveFoods = [];
            if(food.length == 0 || page == 1) food = result;
            if(food) {
                if(food.length >= page*5){
                    for(i = (page - 1) *5; i < page *5; i++) {
                        fiveFoods.push(food[i]);
                    }
                }else {
                    for(i = (page - 1) *5; i < food.length; i++) {
                        fiveFoods.push(food[i]);
                    }
                }
            }
            res.status(200).json({
                data: {
                    success: true,
                    result: fiveFoods
                }
            })
        }     
    })
});
router.get("/listfoodcate", function(req, res) {
    var nameCate = req.query.namecate || req.body.namecate;
    var page = req.query.page || req.body.page;
    if(!page || page.trim().lenght == 0 || isNaN(page)) return res.status(400).json({success: false, notification:"page nhap sai hoac khong ton tai!"});
    console.log(nameCate);
    data_User_From_DB.getAllFoods(function(result) {
        if (!result) res.status(500).json({ data: {success: false} });
        else {
            var fiveFoods = [];
            if(food.length == 0 || page == 1) food = result;
            if(food) {
                if(food.length >= page*5){
                    for(i = (page - 1) *5; i < page *5; i++) {
                        fiveFoods.push(food[i]);
                    }
                }else {
                    for(i = (page - 1) *5; i < food.length; i++) {
                        fiveFoods.push(food[i]);
                    }
                }
            }
            res.status(200).json({
                data: {
                    success: true,
                    result: fiveFoods
                }
            })
        }
    })
});
//list thanh pho
router.get("/listthanhpho", function(req, res) {
    data_Diachi_From_DB.getListThanhPho(function(result) {
        if(!result) res.status(500).json({ data: {success: false} });
        else res.status(200).json({
            data: {
                success: true,
                result: result
            }
        })
    })
})
router.get("/listquan", function(req, res) {
    var zipcode_quan = req.query.zipcode || req.body.zipcode;
    if(!zipcode_quan) return res.status(400).json({ data: {success: false} });
    data_Diachi_From_DB.getListQuan(zipcode_quan, function(result) {
        if(!result) res.status(500).json({ data: {success: false} });
        else res.status(200).json({
            data: {
                success: true,
                result: result
            }
        })
    })
})
router.get("/listcomment", function(req, res) {
    var id_monan = req.query.id || req.body.id;
    if(!id_monan) return res.status(400).json({ data: {success: false} });

    data_Comment_From_DB.getListCommentOfMonan(id_monan, function(result) {
        if(!result) res.status(500).json({ data: {success: false} });
        else res.status(200).json({
            data: {
                success: true,
                result: result
            }
        })
    })
})
//------------------EXPORT MODULE------------------
module.exports = router;