const mongoose = require("../common/mongoose");

function getProfileUserById(id, fn_result) {
    mongoose.model_dichvu.findOne({ _id: id }).select("information").exec(function(err, result) {
        if (err) fn_result(false);
        return fn_result(result);
    })
}

module.exports = {
    getProfileUserById: getProfileUserById
}