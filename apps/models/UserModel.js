const mongoose = require("../common/mongoose");
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

function getFoodbyCate(id, fn_result) {
    mongoose.model_dichvu.findOne({ _id : id_danhmuc }).select("dichvu.danhmuc").exec(function(err, result) {
        if (err) return fn_result(false);
        return fn_result(result);
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
        if (err) console.log(err);
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
module.exports = {
    getUserByIdToCheckRole: getUserByIdToCheckRole,
    getAllStores: getAllStores,
    getFoodByStoreId: getFoodByStoreId,
    getAllCategoryFoods: getAllCategoryFoods,
    getUserByUsername: getUserByUsername,
    createUser: createUser,
    getDetailStoreById: getDetailStoreById,
    getFoodbyCate: getFoodbyCate,
    getListStoreOfQuan: getListStoreOfQuan

}