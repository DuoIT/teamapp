const mongoose = require("../common/mongoose");

function getListThanhPho(fn_result) {
    mongoose.model_diachi.find().select("tenthanhpho zipcode").exec(function(err, result) {
        if(err) fn_result(false);
        else {
            fn_result(result);
        }
    })
}
function getListQuan(zipcode, fn_result) {
    mongoose.model_diachi.findOne({zipcode: zipcode}).exec(function(err, result) {
        if(err) fn_result(false);
        else {
            var data = result.quan;
            fn_result(data);
        }
    })
}
module.exports = {
    getListThanhPho: getListThanhPho,
    getListQuan: getListQuan
}