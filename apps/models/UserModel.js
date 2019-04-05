const mogoose = require("../common/mongoose");
//bcrypt
const bcrypt = require("../helpers/encode_password");

function getUserByIdToCheckRole(id, fn_result) {
    mogoose.model_dichvu.findOne({ _id: id }).select("role").exec((err, result) => {
        if (err) return fn_result(false);
        return fn_result(result);
    });
}

function getAllStores(fn_result) {
    var ATTRIBUTE_NEED_SHOW = "username role.licensed role.name_role dichvu.ten dichvu.diachi dichvu.mota dichvu.avatar_url";
    mogoose.model_dichvu.find({ "role.name_role": "store" }).select(ATTRIBUTE_NEED_SHOW).exec((err, results) => {
        if (err) fn_result(false);
        return fn_result(results);
    })
}

function getAllFoods(fu_result) {
    var ATTRIBUTE_NEED_SHOW = "username role.licensed role.name_role monan.ten";
    mogoose.model_dichvu.find({ "role.name_role": "store" }).select(ATTRIBUTE_NEED_SHOW).exec((err, results) => {
        if (err) fn_result(false);
        return fn_result(results);
    })
}

module.exports = {
    getUserByIdToCheckRole: getUserByIdToCheckRole,
    getAllStores: getAllStores,
}