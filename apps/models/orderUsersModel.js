const mongoose = require("../common/mongoose");

function addCheckoutToOrders(user, CheckoutAll, fn_result){
    if(!CheckoutAll || typeof CheckoutAll != 'object') return fn_result(false);
    Checkout = CheckoutAll.monan;
    if(typeof Checkout == 'object') {
        var orders = [];
        mongoose.model_dichvu.find({"role.name_role": "store"}).exec(function(err, stores) {
            if(err) fn_result(false);
            else { 
                Checkout.forEach(function(elem_Checkout){
                    var trangThaiSameStore = false;  
                    stores.forEach(function(elem_Store) {
                        elem_Store.dichvu.danhmuc.forEach(function(elem_Danhmuc) {
                            elem_Danhmuc.monan.forEach(function(elem_Monan) {
                                if(elem_Monan._id == elem_Checkout.id_monan) {
                                    var order = {};
                                    if(orders.length == 0) {
                                        order.tongtien = elem_Checkout.soluong * elem_Monan.gia;
                                        order.giodat = new Date();
                                        order.trangthai = "chuagiao";
                                        order.address = CheckoutAll.diachi;
                                        order.order_detail = [{
                                            tongtien: elem_Checkout.soluong * elem_Monan.gia,
                                            monan:{
                                                ten: elem_Monan._id,
                                                id: elem_Monan.ten
                                            },
                                            soluong: elem_Checkout.soluong,
                                            gia: elem_Monan.gia
                                        }]
                                        order.information = {
                                            ten: user.ten,
                                            id: user._id
                                        }
                                        order.dichvu = [{
                                            ten: elem_Store.dichvu.ten,
                                            id: elem_Store._id
                                        }]
                                        orders.push(order);
                                        if(elem_Checkout === Checkout[Checkout.length - 1]) {
                                            createOrdersOfCheckout(orders, user, function(result) {
                                                if(!result) fn_result(false);
                                                else fn_result(true);
                                            })
                                        };
                                        return;
                                    }
                                    var index = 0;                                   
                                    orders.forEach(function(elem_Order) {
                                        if(elem_Order.dichvu[0].id == String(elem_Store._id)) {
                                            trangThaiSameStore = true;
                                            return;
                                        }
                                        index++;
                                    })
                                    if(trangThaiSameStore == false) {
                                        order.tongtien = elem_Checkout.soluong * elem_Monan.gia;
                                        order.giodat = new Date();
                                        order.trangthai = "chuagiao";
                                        order.address = CheckoutAll.diachi;
                                        order.order_detail = [{
                                            tongtien: elem_Checkout.soluong * elem_Monan.gia,
                                            monan:{
                                                id: elem_Monan._id,
                                                ten: elem_Monan.ten
                                            },
                                            soluong: elem_Checkout.soluong,
                                            gia: elem_Monan.gia
                                        }]
                                        order.information = {
                                            ten: user.ten,
                                            id: user._id
                                        }
                                        order.dichvu = [{
                                            ten: elem_Store.dichvu.ten,
                                            id: elem_Store._id
                                        }]
                                        orders.push(order);
                                        
                                    }else {
                                        var detail_Order = {
                                            tongtien: elem_Checkout.soluong * elem_Monan.gia,
                                            monan:{
                                                id: elem_Monan._id,
                                                ten: elem_Monan.ten
                                            },
                                            soluong: elem_Checkout.soluong,
                                            gia: elem_Monan.gia
                                        };
                                        orders[index].order_detail.push(detail_Order);
                                        orders[index].tongtien = orders[index].tongtien + detail_Order.tongtien;
                                        trangThaiSameStore = false;
                                    }                                                          
                                    if(elem_Checkout === Checkout[Checkout.length - 1]) {       
                                        createOrdersOfCheckout(orders, user, function(result) {
                                            if(!result) fn_result(false);
                                            else fn_result(true);
                                        })
                                    };
                                }
                            })
                        })
                    })
                }); 
            }
        })           
    }else fn_result(false);
}
function createOrdersOfCheckout(orders, user, fn_result) {
    addOrderForStore(orders, function(result) {
        if(!result) fn_result(false);
        else {
            if(result.length != 0) {
                var order = {};
                order.giodat = new Date();
                order.trangthai = "chuagiao";
                order.address = orders[0].address;
                order.order_detail = [];
                order.information = {
                    ten: user.ten,
                    id: user._id
                };
                order.dichvu = [];
                var tongtien = 0;
                orders.forEach(function(elem_Order) {
                    elem_Order.order_detail.forEach(function(elem_OD) {
                        order.order_detail.push(elem_OD);
                    })
                    elem_Order.dichvu.forEach(function(elem_DV) {
                        order.dichvu.push(elem_DV);
                    })
                    tongtien += elem_Order.tongtien;
                })
                order.tongtien = tongtien;
                order.lienket = result;
                mongoose.model_order.create(order, function(err, result_Order){
                    mongoose.model_dichvu.findOneAndUpdate({_id: user._id}, {$push: {"information.order": result_Order._id}},
                    {safe: true, upsert: true, new : true}, function(err, result_2) {
                        if(err) fn_result(false);
                        else {
                            fn_result(true);
                        }
                    });
                })
            }
        }
    })
}
function addOrderForStore(orders, fn_result) {
    var id_Orders = [];
    mongoose.model_order.collection.insert(orders, function(err, result) {
        if(err) fn_result(false);
        else {
            result.ops.forEach(function(elem_Order) {
                id_Orders.push(String(elem_Order._id));
            });
            fn_result(id_Orders);
        }
    })   
}
module.exports = {
    addCheckoutToOrders: addCheckoutToOrders
}