const mongoose = require("../common/mongoose");

function getProfileUserById(id, fn_result) {
    mongoose.model_dichvu.findOne({ _id: id }).select("information").exec(function(err, result) {
        if (err) fn_result(false);
        else {
            result.information.danhgia = undefined;
            result.information.order = undefined;
            fn_result(result);
        }
    })
}

function updateProfileUserById(id, data, fn_result) {
    mongoose.model_dichvu.findOne({ _id: id }).exec(function(err, result) {
        if(err) return fn_result(false);
        if(!result) return fn_result(false);

        result.information.name = data.name_per;
        result.information.address = data.address_per;
        if (data.avatar_url_per) result.information.avatar_url = data.avatar_url_per;

        var user = new mongoose.model_dichvu(result);
        user.save(function(err, result) {
            if(err) fn_result(false);
            return fn_result(result);
        })
    })
}

module.exports = {
    getProfileUserById: getProfileUserById,
    updateProfileUserById: updateProfileUserById
}