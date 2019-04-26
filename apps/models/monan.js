const mongoose = require("../common/mongoose");

function getMonAnById(id, id_Monan, fn_result) {
    mongoose.model_dichvu.findOne({"_id" : id}).select("dichvu.danhmuc").exec(function(err, result) {
        if(err) return fn_result(false);
        else {
            if(result){
                var monan = null;
                danhmuc = result.dichvu.danhmuc;
                danhmuc.forEach(function(elem_danhmuc) {
                    elem_danhmuc.monan.forEach(function(elem_monan) {
                        if(elem_monan._id == id_Monan) {
                            var rs_monan = elem_monan.toObject();
                            rs_monan.id_danhmuc = elem_danhmuc._id;
                            rs_monan.ten_danhmuc = elem_danhmuc.ten;
                            rs_monan.mota_danhmuc = elem_danhmuc.mota;
                            monan = rs_monan;
                            return;
                        }
                    });  
                })
                fn_result(monan);
            }else fn_result(false);
        }
    });
}
function getListMonAnById(id, fn_result) {
    mongoose.model_dichvu.findOne({"_id" : id}).select("dichvu.danhmuc").exec(function(err, result) {
        if(err) return fn_result(false);
        else {
            var monan = [];
            danhmuc = result.dichvu.danhmuc;
            danhmuc.forEach(function(elem_danhmuc) {
                elem_danhmuc.monan.forEach(function(elem_monan) {
                    var rs_monan = elem_monan.toObject();
                    rs_monan.id_danhmuc = elem_danhmuc._id;
                    rs_monan.ten_danhmuc = elem_danhmuc.ten;
                    rs_monan.mota_danhmuc = elem_danhmuc.mota;
                    rs_monan.id_dichvu = result._id;
                    monan.push(rs_monan);
                });  
            })
            fn_result(monan);
        }
    });
}
//-----------ADD MONAN-------------
function createMonAnOfStore(id, danhmuc, monan, fn_result) {
    mongoose.model_dichvu.findOneAndUpdate({_id : id, "dichvu.danhmuc.ten": danhmuc}, {$push: {"dichvu.danhmuc.$.monan": monan}},
    {safe: true, upsert: true, new : true}, function(err, result) {
        if(err) fn_result(false);
        else fn_result(result);
    })
}
//-----------DELETE MONAN--------------
function deleteMonAnById(id, id_monan, fn_result) {
    //, "dichvu.danhmuc.$.monan._id" : id_monan
    mongoose.model_dichvu.findOne({_id : id}, function(err, result) {
        if(err) return fn_result(false);
        else if(result){
             if(result.dichvu) {
                result.dichvu.danhmuc.forEach(function(elem_danhmuc) {     
                    if(elem_danhmuc.monan) {
                        for(i = elem_danhmuc.monan.length - 1; i >= 0; i--) {
                            if(elem_danhmuc.monan[i]._id == id_monan) elem_danhmuc.monan.splice(i, 1);
                        }
                    }
                })
                var user = new mongoose.model_dichvu(result);
                user.save();
                return fn_result(true);
            }
        }
    })
}
function updateMonAnById(id, id_monan, danhmuc, data, fn_result) {
    mongoose.model_dichvu.findOne({_id : id}).exec(function(err, result) {
        if(err) return fn_result(false);
        if(result.dichvu) {
            try {
                result.dichvu.danhmuc.forEach(function(elem_danhmuc) {     
                        if(elem_danhmuc.monan) {
                            monans = elem_danhmuc.monan;
                            for(i = 0; i < monans.length; i++) {
                                if(monans[i]._id == id_monan) {
                                    monans[i].ten = data.ten;
                                    monans[i].mota = data.mota;
                                    if(data.hinhanh_url) monans[i].hinhanh_url = data.hinhanh_url;
                                    monans[i].gia = data.gia;
                                    monans[i].soluong = data.soluong;

                                    if(elem_danhmuc.ten != danhmuc) {
                                        for(j = 0; j < result.dichvu.danhmuc.length; j++) {
                                            if(result.dichvu.danhmuc[j].ten == danhmuc) {
                                                result.dichvu.danhmuc[j].monan.push(monans[i]);
                                                break;
                                            }
                                        }
                                        elem_danhmuc.monan.splice(i, 1);
                                    }

                                }
                            }  
                        }
                })
                var user = new mongoose.model_dichvu(result);
                user.save();
                return fn_result(true);
            } catch (error) {
                fn_result(false);
            }
        }
        else fn_result(false);
    })
}

module.exports = {
    getMonAnById : getMonAnById,
    getListMonAnById : getListMonAnById,
    createMonAnOfStore : createMonAnOfStore,
    deleteMonAnById : deleteMonAnById,
    updateMonAnById : updateMonAnById
}