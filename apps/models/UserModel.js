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
    var ATTRIBUTE_NEED_SHOW = "dichvu.ten dichvu.diachi dichvu.mota dichvu.avatar_url dichvu.rating";
    mogoose.model_dichvu.find({ "role.name_role": "store" }).select(ATTRIBUTE_NEED_SHOW).exec((err, results) => {
        if (err) fn_result(false);
        return fn_result(results);
    })
}

function getAllFoods(id, fn_result) {
    mogoose.model_dichvu.findOne({ _id: id }).select("danhmuc.monan").exec(function(err, result) {
        if (err) fn_result(false);
        else {
            var data = {
                monan: result
            }
            fn_result(data.monan);
        } 
    })
}

function getAllCategoryFoods(fn_result) {
    var ATTRIBUTE_NEED_SHOW  = "dichvu.danhmuc";
    mogoose.model_dichvu.find({"role.name_role": "store" }).select(ATTRIBUTE_NEED_SHOW).exec((err, results) => {
        if (err) fn_result(false);
        return fn_result(results);
    })
}


module.exports = {
    getUserByIdToCheckRole: getUserByIdToCheckRole,
    getAllStores: getAllStores,
    getAllFoods: getAllFoods,
    getAllCategoryFoods: getAllCategoryFoods
}