const mogoose = require("../common/mongoose");

function getListDoanhThu(id, fn_result) {
    mogoose.model_dichvu.findOne({_id : id}).select("dichvu.doanhthu").exec(function(err, result) {
        if(err) fn_result(false);
        else {
            var data = {
                doanhthu : result.dichvu.doanhthu
            }
            fn_result(data);
        }
    })
}


//-------------------module exports---------------
module.exports = {
    getListDoanhThu : getListDoanhThu
}