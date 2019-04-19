const mongoose = require("../common/mongoose");

function getListMonAnById(fn_result) {
    mongoose.model_dichvu.find().select("dichvu.danhmuc").exec(function(err, result) {
        if(err) return fn_result(false);
        else {
            var monan = [];
            result.forEach(function(elem_result) {
                danhmuc = elem_result.dichvu.danhmuc;
                danhmuc.forEach(function(elem_danhmuc) {
                    elem_danhmuc.monan.forEach(function(elem_monan) {
                        var rs_monan = elem_monan.toObject();
                        rs_monan.id_danhmuc = elem_danhmuc._id;
                        rs_monan.ten_danhmuc = elem_danhmuc.ten;
                        rs_monan.mota_danhmuc = elem_danhmuc.mota;
                        rs_monan.id_dichvu = elem_result._id;
                        monan.push(rs_monan);
                    });  
                })
            })
            fn_result(monan);
        }
    });
}
function deleteMonAnById(id_Monan, fn_result) {
    // mongoose.model_dichvu.find({"dichvu.danhmuc"})
}





//EXPORT
module.exports = {
    getListMonAnById: getListMonAnById,
    deleteMonAnById: deleteMonAnById
}