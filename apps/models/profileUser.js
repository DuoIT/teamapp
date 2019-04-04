const mongoose = require("../common/mongoose")

function GetProfileUserById(id, fn_result) {
    mongoose.model_dichvu.findOne({ _id, id }).select()
}