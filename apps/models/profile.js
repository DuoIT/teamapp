const mogoose = require("../common/mongoose");

function getProfileUserById(id, fn_result) {
    mogoose.model_dichvu.findOne({_id : id}).select("information dichvu").exec(function(err, result) {
        if(err) fn_result(false);
        else {
            result.information.danhgia = undefined;
            result.information.order = undefined;
            result.dichvu.doanhthu = undefined;
            result.dichvu.danhmuc = undefined;
            fn_result(result);
        }
    })
}

//-----------------MODULE EXPORTS----------------------
module.exports = {
    getProfileUserById : getProfileUserById
}