const mongoose = require("../common/mongoose");

function getListMonAnById(fn_result) {
    mongoose.model_dichvu.find({"role.name_role":"store"}).select("dichvu.danhmuc").exec(function(err, result) {
        if(err) return fn_result(false);
        else {
            if(result) {
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
                            rs_monan.ten_dichvu = elem_result.dichvu.ten;
                            monan.push(rs_monan);
                        });  
                    })
                })
                fn_result(monan);
            }else fn_result(false);
        }
    });
}
function deleteMonAnById(id_Monan, fn_result) {
    mongoose.model_dichvu.find({"role.name_role":"store"}).exec(function(err, result) {
        if(err) return fn_result(false);
        else {
            var found_user = null;
            result.forEach(function(elem_result) {
                danhmuc = elem_result.dichvu.danhmuc;
                danhmuc.forEach(function(elem_danhmuc) {
                    var index = 0;
                    elem_danhmuc.monan.forEach(function(elem_monan) {
                        if(elem_monan._id == id_Monan) {
                            elem_danhmuc.monan.splice(index, 1);
                            found_user = elem_result;
                            return;
                        }
                        index++;
                    });  
                })
            })
            if(!found_user) return fn_result(false);
            var user = new mongoose.model_dichvu(found_user);
            user.save(function(err) {
                if(err) return fn_result(false);
                else fn_result(true);
            })
        }
    });
}





//EXPORT
module.exports = {
    getListMonAnById: getListMonAnById,
    deleteMonAnById: deleteMonAnById
}