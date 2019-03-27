const mogoose = require("../common/mongoose");

function getListOrderById(id, fn_result) {
    mogoose.model_dichvu.findOne({_id : id}).select("dichvu.doanhthu.order").exec(function(err, result) {
        if(err) fn_result(false);
        else {

            var data = {
                order : result.dichvu.doanhthu.order
            }
            fn_result(data);
        }
    });
}


//-----------------------MODULE EXPORTS--------------------
module.exports = {
    getListOrderById : getListOrderById
}