const mongoose = require("../common/mongoose");
//bcrypt
const bcrypt = require("../helpers/encode_password");

function getUserByIdToCheckRole(id, fn_result) {
    mongoose.model_dichvu.findOne({ _id: id }).select("role").exec((err, result) => {
        if (err) return fn_result(false);
        return fn_result(result);
    });
}

function getAllStores(fn_result) {
    var ATTRIBUTE_NEED_SHOW = "dichvu.ten dichvu.diachi dichvu.mota dichvu.avatar_url dichvu.rating";
    mongoose.model_dichvu.find({ "role.name_role": "store" }).select(ATTRIBUTE_NEED_SHOW).exec((err, results) => {
        if (err) fn_result(false);
        return fn_result(results);
    })
}

function getFoodByStoreId(id, fn_result) {
    var ATTRIBUTE_NEED_SHOW = "dichvu.danhmuc danhmuc.monan monan.ten monan.mota monan.hinhanh_url monan.gia monan.soluong monan.trungbinhsao monan.danhgia";
    mongoose.model_dichvu.findOne({_id : id}).select(ATTRIBUTE_NEED_SHOW).exec((err, result) => {
        if (err) fn_result(false);
        return fn_result(result);
    })
}

function getAllCategoryFoods(id, fn_result) {
    var ATTRIBUTE_NEED_SHOW  = "dichvu.danhmuc danhmuc.ten danhmuc.mota danhmuc.monan monan.ten";
    mongoose.model_dichvu.findOne({ _id: id }).select(ATTRIBUTE_NEED_SHOW).exec((err, results) => {
        if (err) fn_result(false);
        return fn_result(results);
    })
}


module.exports = {
    getUserByIdToCheckRole: getUserByIdToCheckRole,
    getAllStores: getAllStores,
    getFoodByStoreId: getFoodByStoreId,
    getAllCategoryFoods: getAllCategoryFoods
}