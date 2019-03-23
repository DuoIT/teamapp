const mongoose = require("../common/mongoose");

function getAllMonAn(fn_result) {
    mongoose.model_dichvu.find({"name_per":"nguoinau"}).select("nguoinau.monan").exec(function(err, result) {
        if(err) return fn_result(false);
        return fn_result(result);
    });
}
function getMonAnById(id, fn_result) {
    mongoose.model_dichvu.findOne({"_id" : id}).select("dichvu.danhmuc").exec(function(err, result) {
        if(err) return fn_result(false);
        else {
            var data = {
                danhmuc : result.dichvu.danhmuc
            }
            fn_result(data);
        }
    });
}
function getMonAnByName(name, fn_result) {
    mongoose.model_dichvu.find({"name_per":"nguoinau", "name_per":"nguoinau", "nguoinau.monan.tenmon" : name}).select("nguoinau.monan").exec(function(err, result) {
        if(err) return fn_result(false);
        return fn_result(result);
    });
}


module.exports = {
    getAllMonAn : getAllMonAn,
    getMonAnById : getMonAnById,
    getMonAnByName : getMonAnByName
}