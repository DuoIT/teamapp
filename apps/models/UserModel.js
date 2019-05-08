const mongoose = require("../common/mongoose");
const config = require("config");
//bcrypt
const bcrypt = require("../helpers/encode_password");

function getUserByIdToCheckRole(id, fn_result) {
    mongoose.model_dichvu.findOne({ _id: id }).select("role").exec((err, result) => {
        if (err) return fn_result(false);
        return fn_result(result);
    })
}

function getAllStores(fn_result) {
    var ATTRIBUTE_NEED_SHOW = "dichvu.ten dichvu.diachi dichvu.mota dichvu.avatar_url dichvu.rating";
    mongoose.model_dichvu.find({ "role.name_role": "store" }).select(ATTRIBUTE_NEED_SHOW).exec((err, results) => {
        if (err) fn_result(false);
        return fn_result(results);
    })
}

function getDetailStoreById(id, fn_result) {
    mongoose.model_dichvu.findOne({ _id : id}).select("dichvu").exec(function(err, result) {
        if (err) fn_result(false);
        else {
            result.dichvu.doanhthu = undefined;
            result.dichvu.danhmuc = undefined;
            fn_result(result);
        }
    })
}

function getFoodByStoreId(id, fn_result) {
    mongoose.model_dichvu.findOne({ "_id" : id}).select("dichvu.danhmuc").exec(function(err, result) {
        if (err) fn_result(false);
        else {
            var monan = [];
            if (!result.dichvu) return fn_result(false);          
            danhmuc = result.dichvu.danhmuc;
            danhmuc.forEach(function (elem_danhmuc) {
                elem_danhmuc.monan.forEach(function (elem_monan) {
                    var rs_monan = elem_monan.toObject();
                    rs_monan.id_danhmuc = elem_danhmuc._id;
                    rs_monan.ten_danhmuc = elem_danhmuc.ten;
                    rs_monan.mota_danhmuc = elem_danhmuc.mota;
                    monan.push(rs_monan);
                });
            })
            fn_result(monan);
        }
    })
}

function getAllCategoryFoods(id, fn_result) {
    mongoose.model_dichvu.findOne({ "_id" : id }).select("dichvu.danhmuc").exec((err, result) => {
        if (err) fn_result(false);
        //return fn_result(result);
        else {
            var danhmuc = [];
            dichvu = result.dichvu.danhmuc;
            dichvu.forEach(function (elem_danhmuc) {
                var rs_danhmuc = elem_danhmuc.toObject();
                rs_danhmuc.monan = undefined;
                danhmuc.push(rs_danhmuc);
            })
            fn_result(danhmuc);
        }  
    })
}

function getFoodbyCate(id, nameCate, fn_result) {
    mongoose.model_dichvu.find({_id: id, "role.name_role": "store" }).select("dichvu").exec(function(err, result) {
        if (err) fn_result(false);
        else {
            var monan = [];
            result.forEach(function(elem_user) {
                elem_user.dichvu.danhmuc.forEach(function (elem_danhmuc) {
                    if (nameCate == elem_danhmuc.ten) {
                        elem_danhmuc.monan.forEach(function (elem_monan) {
                            monan.push(elem_monan);
                        })
                    }
                })
            })            
            fn_result(monan);
        }
    })
}

function getAllFoods(id, fn_result){
    mongoose.model_dichvu.find({_id: id ,"role.name_role": "store" }).select("dichvu.danhmuc").exec(function(err, stores) {
        if (err) fn_result(false);
        else {
            var monan = [];
            stores.forEach(function(elem_Store) {
                elem_Store.dichvu.danhmuc.forEach(function (elem_Danhmuc) {
                        elem_Danhmuc.monan.forEach(function (elem_monan) {
                            monan.push(elem_monan);
                        })
                })
            })            
            fn_result(monan);
        }
    })
}

//search
var elementsForSearch = [];
function searchByType(type, zipcode_quan, page, content, fn_result) {
    //cac field can show ra cho FE
    var ATTRIBUTE_NEED_SHOW = "dichvu.ten dichvu.diachi dichvu.mota dichvu.avatar_url dichvu.rating dichvu.danhmuc";
    var query = null;
    //kiem tra zipquan khong ton tai thi lay tat ca store/ neu co thi lay store co zipcode trung
    if(!zipcode_quan || zipcode_quan.trim().lenght == 0) 
    query = mongoose.model_dichvu.find({"role.name_role": "store"});
    else query = mongoose.model_dichvu.find({"role.name_role": "store", "dichvu.diachi.zipcode": zipcode_quan});
    //lay data tu DB ve
    query.select(ATTRIBUTE_NEED_SHOW).exec(function(err, stores) {
        if(err) fn_result(false);
        else {
            //page = 1 hoac mang rong thi load lai data
            if(page == 1 || elementsForSearch.length == 0) {
                elementsForSearch.splice(0, elementsForSearch.length);
                stores.forEach(function(elem_Store) {
                    if(type == config.get("typesearch")[1]) {
                        //neu khong nhap gi thi se search tat ca cac store, con khong thi tim store co ten giong voi content
                        if(!content || content.trim().lenght == 0) elementsForSearch.push(elem_Store);
                        else if(elem_Store.dichvu.ten.toLowerCase().search(content.toLowerCase()) != -1) elementsForSearch.push(elem_Store);
                    }
                    else if(type == config.get("typesearch")[0]) {
                        elem_Store.dichvu.danhmuc.forEach(function(elem_Danhmuc) {
                            elem_Danhmuc.monan.forEach(function(elem_Monan) {
                                //neu khong nhap gi thi se search tat ca cac food, con khong thi tim food co ten giong voi content
                                var rs_monan = elem_Monan.toObject();
                                rs_monan.ten_store = elem_Store.dichvu.ten;
                                elem_Monan.ten_store = elem_Store.dichvu.ten;
                                if(!content || content.trim().lenght == 0) elementsForSearch.push(rs_monan);
                                else if(elem_Monan.ten.toLowerCase().search(content.toLowerCase()) != -1) elementsForSearch.push(rs_monan);
                            })
                        })
                    }
                })
            }
            //neu type tim kiem co dang food thi thuc hien phan trang
            if(type == config.get("typesearch")[1]) {
                var fiveStore = [];
                if(elementsForSearch) {
                    if(elementsForSearch.length >= page* config.get("paginate")){
                        for(i = (page - 1) *config.get("paginate"); i < page *config.get("paginate"); i++) {
                            fiveStore.push(elementsForSearch[i]);
                        }
                    }else {
                        for(i = (page - 1) *config.get("paginate"); i < elementsForSearch.length; i++) {
                            fiveStore.push(elementsForSearch[i]);
                        }
                    }
                }                
                return fn_result(fiveStore)
            };
            //neu type tim kiem co dang store thi thuc hien phan trang
            if(type == config.get("typesearch")[0]) {
                var fiveFoods = [];
                if(elementsForSearch) {
                    if(elementsForSearch.length >= page* config.get("paginate")){
                        for(i = (page - 1) *config.get("paginate"); i < page *config.get("paginate"); i++) {
                            fiveFoods.push(elementsForSearch[i]);
                        }
                    }else {
                        for(i = (page - 1) *config.get("paginate"); i < elementsForSearch.length; i++) {
                            fiveFoods.push(elementsForSearch[i]);
                        }
                    }
                }
                return fn_result(fiveFoods);
            }
        }
    })
}

function getUserByUsername(username, fn_result) {
    mongoose.model_dichvu.findOne({ username: username }).exec((err, result) => {
        if (err) return fn_result(false);
        return fn_result(result);
    });
}

function createUser(user, fn_result) {
    mongoose.model_dichvu.create(user, (err, result) => {
        if (err) return fn_result(false);
        return fn_result(result);
    })
}

function getListStoreOfQuan(zipcode, fn_result) {
    var ATTRIBUTE_NEED_SHOW = "dichvu.ten dichvu.diachi dichvu.mota dichvu.avatar_url dichvu.rating";
    mongoose.model_dichvu.find({ "role.name_role": "store", "dichvu.diachi.zipcode": zipcode }).select(ATTRIBUTE_NEED_SHOW).exec((err, results) => {
        if (err) {
            console.log(err);
            fn_result(false);
        }
        else fn_result(results);    
    })
}

//phan trang store v2
function getListStoreOfQuanV2(zipcode, page, fn_result) {
    var ATTRIBUTE_NEED_SHOW = "dichvu.ten dichvu.diachi dichvu.mota dichvu.avatar_url dichvu.rating";
    var query = null;

    if(!zipcode || isNaN(zipcode))
    query = mongoose.model_dichvu.find({"role.name_role": "store"});
    else query = mongoose.model_dichvu.find({"role.name_role": "store", "dichvu.diachi.zipcode": zipcode});

    query.select(ATTRIBUTE_NEED_SHOW)
    .limit(config.get("paginate"))
    .skip(config.get("paginate")* (page - 1))
    .exec(function(err, stores) {
        if(err) fn_result(false);
        else if(stores) {
            fn_result(stores);
        }else fn_result(false);
    })
}

module.exports = {
    getUserByIdToCheckRole: getUserByIdToCheckRole,
    getAllStores: getAllStores,
    getFoodByStoreId: getFoodByStoreId,
    getAllCategoryFoods: getAllCategoryFoods,
    getUserByUsername: getUserByUsername,
    createUser: createUser,
    getDetailStoreById: getDetailStoreById,
    getFoodbyCate: getFoodbyCate,
    getListStoreOfQuan: getListStoreOfQuan,
    getListStoreOfQuanV2: getListStoreOfQuanV2,
    getAllFoods: getAllFoods,
    searchByType: searchByType
}