const mongoose = require("../common/mongoose");

function getListOrderOfStoreById(id, fn_result) {
    mongoose.model_dichvu.findOne({_id : id}).select("dichvu.doanhthu.order").exec(function(err, result) {
        if(err) fn_result(false);
        else {
            var data = {
                order : result.dichvu.doanhthu.order
            }
            fn_result(data.order);
        }
    });
}
function deleteOrderOfStoreById(id, id_Order, fn_result) {
    mongoose.model_dichvu.findOne({_id : id, "dichvu.doanhthu.order._id": id_Order}).exec(function(err, result) {
        if(err) return fn_result(false);
        else {
            if(result) {
                result.dichvu.doanhthu.order.forEach(function(elem) {
                    if(elem._id == id_Order) {
                        id_infor = elem.information.id;
                        if(!id_infor) {
                            mongoose.model_dichvu.findOneAndUpdate({_id : id}, 
                                {$pull: {"dichvu.doanhthu.order" : {"_id": id_Order}}}, function(err, result) {
                                if(err) fn_result(false);
                                else {
                                    mongoose.model_dichvu.findOneAndUpdate({_id : id}, 
                                    {$pull: {"dichvu.information.order" : {"_id": id_infor}}}, function(err, result){
                                        if(err) return fn_result(false);
                                        return fn_result(true);
                                    })
                                }
                            })
                        }
                        break;
                    };

                });
                
            }
        }
    })
    
    
}

//-----------------------MODULE EXPORTS--------------------
module.exports = {
    getListOrderOfStoreById : getListOrderOfStoreById,
    deleteOrderOfStoreById : deleteOrderOfStoreById
}