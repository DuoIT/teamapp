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
            fn_result(result.dichvu.danhmuc);
        }
    });
}
function getMonAnByName(name, fn_result) {
    mongoose.model_dichvu.find({"name_per":"nguoinau", "name_per":"nguoinau", "nguoinau.monan.tenmon" : name})
    .select("nguoinau.monan").exec(function(err, result) {
        if(err) return fn_result(false);
        return fn_result(result);
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
function deleteMonAnById(id, id_monan, danhmuc, fn_result) {
    //, "dichvu.danhmuc.$.monan._id" : id_monan
    mongoose.model_dichvu.findOneAndUpdate({_id : id, "dichvu.danhmuc.ten": danhmuc}, {$pull: {"dichvu.danhmuc.$.monan" : {"_id": id_monan}}}
    , function(err, result) {
        if(err) fn_result(false);
        else fn_result(result);
    })
}
function updateMonAnById(id, id_monan, danhmuc, data, fn_result) {
    mongoose.model_dichvu.findOne({_id : id}).exec(function(err, result) {
        if(err) return fn_result(false);
        if(result.dichvu) {
            result.dichvu.danhmuc.forEach(function(danhmuc) {     
                if(danhmuc.monan) {
                    danhmuc.monan.forEach(function(monan) {
                        if(monan && monan._id == id_monan) {
                            monan.ten = data.ten;
                            monan.mota = data.mota;
                            monan.hinhanh_url = data.hinhanh_url;
                            monan.gia = data.gia;
                            monan.soluong = data.soluong;
                        }
                    })        
                }
            })
            var user = new mongoose.model_dichvu(result);
            user.save();
            return fn_result(true);
        }
        else fn_result(false);
    })
}

module.exports = {
    getAllMonAn : getAllMonAn,
    getMonAnById : getMonAnById,
    getMonAnByName : getMonAnByName,
    createMonAnOfStore : createMonAnOfStore,
    deleteMonAnById : deleteMonAnById,
    updateMonAnById : updateMonAnById
}