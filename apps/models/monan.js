const model = require("../common/mongoose");

function getAllMonAn(fn_result) {
    model().find({"name_per":"nguoinau"}).select("nguoinau.monan").exec(function(err, result) {
        if(err) return fn_result(false);
        return fn_result(result);
    });
}
function getMonAnById(id, fn_result) {
    model().find({"_id": "id", "name_per":"nguoinau"}).select("nguoinau.monan").exec(function(err, result) {
        if(err) return fn_result(false);
        return fn_result(result);
    });
}
function getMonAnByName(name, fn_result) {
    model().find({"name_per":"nguoinau", "name_per":"nguoinau", "nguoinau.monan.tenmon" : name}).select("nguoinau.monan").exec(function(err, result) {
        if(err) return fn_result(false);
        return fn_result(result);
    });
}


module.exports = {
    getAllMonAn : getAllMonAn,
    getMonAnById : getMonAnById,
    getMonAnByName : getMonAnByName
}