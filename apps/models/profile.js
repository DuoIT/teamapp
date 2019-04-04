const mogoose = require("../common/mongoose");

function getProfileStoreById(id, fn_result) {
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
function updateProfileStoreById(id, data, fn_result) {
    mogoose.model_dichvu.findOne({_id : id}).exec(function(err, result) {
        if(err) return fn_result(false);
        if(!result) return fn_result(false);
        result.information.name = data.name_personal;
        result.information.address = data.address; 
        result.information.phonenumber = data.phonenumber;
        result.information.avarta_url = data.avarta_url;

        result.dichvu.ten = data.name_store;
        result.dichvu.mota = data.mota;
        result.dichvu.avarta_url = data.avarta_url;
        result.dichvu.diachi.tenthanhpho = data.tenthanhpho;
        result.dichvu.diachi.tenquan = data.tenquan;
        result.dichvu.diachi.tenduong = data.tenduong;

        var user = new mogoose.model_dichvu(result);
        user.save(function(err, result) {
            if(!err) return fn_result(result);
            else return fn_result(false);
        });
        
    })
}
//-----------------MODULE EXPORTS----------------------
module.exports = {
    getProfileStoreById : getProfileStoreById,
    updateProfileStoreById : updateProfileStoreById
}