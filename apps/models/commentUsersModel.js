const mongoose = require("../common/mongoose");

function getListCommentOfMonan(id_Monan, fn_Result) {
    mongoose.model_dichvu.find({"role.name_role": "store"}).select("dichvu.danhmuc").exec(function(err, stores) {
        if(err) return fn_Result(false);
        if(stores && stores.length != 0 ){
            var trangThaiBoQua = false;
            stores.forEach(function(elem_Store) {
                elem_Store.dichvu.danhmuc.forEach(function(elem_Danhmuc) {
                    elem_Danhmuc.monan.forEach(function(elem_Monan) {
                        if(elem_Monan._id == id_Monan) {
                            trangThaiBoQua = true;
                            return fn_Result(elem_Monan.danhgia);
                        }
                    })
                    if(trangThaiBoQua == true) return;
                })
                if(trangThaiBoQua == true) return;
            })
            if(trangThaiBoQua == false) fn_Result(false);
        }else fn_Result(false);
    })
}

module.exports = {
    getListCommentOfMonan: getListCommentOfMonan
}