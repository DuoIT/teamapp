const mongoose = require("../common/mongoose");

function getOrderById(id, id_Order, fn_result){
    mongoose.model_order.findOne({_id: id_Order}).exec(function(err, result) {
        if(err) fn_result(false);
        else {
            try{
            var data = {};
            data.address = result.address;
            var order_Detail = result.order_detail;
            var ten_SoLuong_Monan = "";
            // var soluong_Monan = null;
            order_Detail.forEach(function(elem_OrderDetail) {
                console.log(elem_OrderDetail.monan.ten)
                ten_SoLuong_Monan += elem_OrderDetail.monan.ten +"- "+ elem_OrderDetail.soluong + " phần";                   
                if(elem_OrderDetail !== order_Detail[order_Detail.length - 1]) ten_SoLuong_Monan += ", "; 
            })
            data.ten_monan = ten_SoLuong_Monan;
            data.tongtien = result.tongtien;
            data.trangthai = result.trangthai;
            data._id = result._id;
            data.giodat = result.giodat;
            fn_result(data);
            }catch(error){
                fn_result(false);
            }
        }
    })
}
function getListOrderOfStoreById(id, fn_result) {
        mongoose.model_dichvu.findOne({_id : id}).select("dichvu.doanhthu.order").exec(function(err, result) {
            if(err) fn_result(false);
            else {
                mongoose.model_order.find({_id: {"$in": result.dichvu.doanhthu.order}}
                , function(err, orders){
                    if(err) fn_result(false);
                    else {
                        var rs_Order = [];
                        orders.forEach(function(elem_Order) {
                            var data = {};
                            data.address = elem_Order.address;
                            var order_Detail = elem_Order.order_detail;
                            var ten_SoLuong_Monan = "";
                            // var soluong_Monan = null;
                            order_Detail.forEach(function(elem_OrderDetail) {
                                console.log(elem_OrderDetail.monan.ten)
                                ten_SoLuong_Monan += elem_OrderDetail.monan.ten +"- "+ elem_OrderDetail.soluong + " phần";
                                if(elem_OrderDetail !== order_Detail[order_Detail.length - 1]) ten_SoLuong_Monan += ", "; 
                            })
                            data.ten_monan = ten_SoLuong_Monan;
                            data.tongtien = elem_Order.tongtien;
                            data.trangthai = elem_Order.trangthai;
                            data._id = elem_Order._id;
                            data.giodat = elem_Order.giodat;
                            rs_Order.push(data);
                        })
                        fn_result(rs_Order);
                    }
                })
                
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
                
            }else fn_result(false);
        }
    })
    
    
}

//-----------------------MODULE EXPORTS--------------------
module.exports = {
    getListOrderOfStoreById : getListOrderOfStoreById,
    deleteOrderOfStoreById : deleteOrderOfStoreById,
    getOrderById : getOrderById
}