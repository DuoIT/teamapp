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
    var ATTRIBUTE_NEED_SHOW = "dichvu.danhmuc dichvu.danhmuc.monan dichvu.danhmuc.monan.ten dichvu.danhmuc.monan.mota dichvu.danhmuc.monan.hinhanh_url dichvu.danhmuc.monan.gia dichvu.danhmuc.monan.soluong dichvu.danhmuc.monan.trungbinhsao dichvu.danhmuc.monan.danhgia";
    mongoose.model_dichvu.findOne({_id : id}).select(ATTRIBUTE_NEED_SHOW).exec((err, result) => {
        if (err) fn_result(false);
        return fn_result(result);
    })
}

function getAllCategoryFoods(id, fn_result) {
    var ATTRIBUTE_NEED_SHOW = "dichvu.danhmuc dichvu.danhmuc.ten dichvu.danhmuc.mota";
    mongoose.model_dichvu.findOne({ _id: id }).select(ATTRIBUTE_NEED_SHOW).exec((err, results) => {
        if (err) fn_result(false);
        return fn_result(results);
    })
}
function getUserByUsername(username, fn_result) {
    mogoose.model_dichvu.findOne({ username: username }).exec((err, result) => {
        if (err) return fn_result(false);
        return fn_result(result);
    });
}
function createUser(user, fn_result) {
    mogoose.model_dichvu.create(user, (err, result) => {
        if (err) console.log(err);
        return fn_result(result);
    })
}
module.exports = {
    getUserByIdToCheckRole: getUserByIdToCheckRole,
    getAllStores: getAllStores,
    getFoodByStoreId: getFoodByStoreId,
    getAllCategoryFoods: getAllCategoryFoods,
    getUserByUsername: getUserByUsername,
    createUser: createUser
}