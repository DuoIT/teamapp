const mogoose = require("../common/mongoose");
function getDoanhThuById(id, id_Order, fn_result) {
    var soNgay = 0;
    if(id_Order == 3) soNgay = 7;
    else if(id_Order == 2) soNgay = 30;
    else if(id_Order == 1) {
        getAllOrderDoanhThu(id, function(result) {
            if(!result) fn_result(false);
            else fn_result(result);
        })
        return;
    };
    if(!soNgay) return fn_result(false);
    mogoose.model_dichvu.findOne({_id : id}).select("dichvu.doanhthu").exec(function(err, result) {
        if(err) fn_result(false);
        else {
            
            var  doanhthu = result.dichvu.doanhthu;
            
            var curDate = new Date();
            var getDate =  curDate.getDate();
            var getMonth = curDate.getMonth() + 1;
            var getFullYear = curDate.getFullYear();
            var datesInMonth = new Date(getFullYear, getMonth, 0).getDate();
            var date_Need_Show = soNgay;
            if(getDate - date_Need_Show <= 0) {
                if(getMonth <= 1) {
                    getFullYear -= 1;
                    getMonth = 12;
                }
                else getMonth -= 1;
                getDate = datesInMonth - date_Need_Show + getDate ;
            }else {
                getDate -= date_Need_Show;
            }           
            var date = new Date(getFullYear, getMonth - 1 , getDate + 1);
            var tongtien = 0;            
            mogoose.model_order.find({_id: {"$in": doanhthu.order}, giodat: {"$gt": date}, trangthai:"dagiao"}, function(err, orders) {
                if(err) fn_result(false)
                else {
                    var rs_Order = [];
                    orders.forEach(function(elem_Order) {
                        var data = {};
                        data.address = elem_Order.address;
                        var order_Detail = elem_Order.order_detail;
                        var ten_SoLuong_Monan = "";
                        order_Detail.forEach(function(elem_OrderDetail) {
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
                    return fn_result(rs_Order);
                }
            })
        }
    });
}
//function for getDoanhThuById
function getAllOrderDoanhThu(id, fn_result) {
    mogoose.model_dichvu.findOne({_id : id}).select("dichvu.doanhthu").exec(function(err, result) {
        if(err) fn_result(false);
        else {
            var doanhthu = result.dichvu.doanhthu;
            mogoose.model_order.find({_id: {"$in": doanhthu.order}, trangthai:"dagiao"}, function(err, orders) {
                if(err) fn_result(false)
                else {
                    var rs_Order = [];
                    orders.forEach(function(elem_Order) {
                        var data = {};
                        data.address = elem_Order.address;
                        var order_Detail = elem_Order.order_detail;
                        var ten_SoLuong_Monan = "";
                        order_Detail.forEach(function(elem_OrderDetail) {
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
    })
}
function getListDoanhThu(id, fn_result) {
        mogoose.model_dichvu.findOne({_id : id}).select("dichvu.doanhthu").exec(function(err, result) {
            if(err) fn_result(false);
            else {
                var doanhthu = result.dichvu.doanhthu;
                mogoose.model_order.find({_id: {"$in": doanhthu.order}, trangthai:"dagiao"}, function(err, orders) {
                    if(err) fn_result(false)
                    else {
                        var order_Detail_String = "";
                        var thutu_Order = 1;
                        orders.forEach(function(elem_Order) {
                            if(elem_Order !== orders[0])  order_Detail_String += "/";
                            order_Detail_String += "Order " +thutu_Order + "- "; 
                            order_Detail_String += "tongtien: " + elem_Order.tongtien + ", ";
                            elem_Order.order_detail.forEach(function(elem_OrderDetail) {
                                order_Detail_String += elem_OrderDetail.monan.ten +"_"+ elem_OrderDetail.soluong + " phần";
                                if(elem_OrderDetail !== elem_Order.order_detail[elem_Order.order_detail.length - 1]) order_Detail_String += ", "; 
                            })
                            thutu_Order++;
                        });
                        var data = {
                            soluongorder: orders.length,
                            tongtien: doanhthu.tongdoanhthu,
                            order_detail: order_Detail_String
                        }
                        fn_result(data);
                    }
                })
            }
        })
}
function getListOrderTheoNgayById(id, soNgay, fn_result) {
    if(!soNgay) return fn_result(false);
    mogoose.model_dichvu.findOne({_id : id}).select("dichvu.doanhthu").exec(function(err, result) {
        if(err) fn_result(false);
        else {
            
            var  doanhthu = result.dichvu.doanhthu;
            
            var curDate = new Date();
            var getDate =  curDate.getDate();
            var getMonth = curDate.getMonth() + 1;
            var getFullYear = curDate.getFullYear();
            var datesInMonth = new Date(getFullYear, getMonth, 0).getDate();
            var date_Need_Show = soNgay;
            if(getDate - date_Need_Show <= 0) {
                if(getMonth <= 1) {
                    getFullYear -= 1;
                    getMonth = 12;
                }
                else getMonth -= 1;
                getDate = datesInMonth - date_Need_Show + getDate ;
            }else {
                getDate -= date_Need_Show;
            }           
            var date = new Date(getFullYear, getMonth - 1 , getDate + 1);
            var tongtien = 0;            
            mogoose.model_order.find({_id: {"$in": doanhthu.order}, giodat: {"$gt": date}, trangthai:"dagiao"}, function(err, orders) {
                if(err) fn_result(false)
                else {
                    var order_Detail_String = "";
                    var thutu_Order = 1;
                    orders.forEach(function(elem_Order) {
                        if(elem_Order !== orders[0])  order_Detail_String += "/";
                        order_Detail_String += "Order " +thutu_Order + "- "; 
                        order_Detail_String += "tongtien: " + elem_Order.tongtien + ", ";
                        elem_Order.order_detail.forEach(function(elem_OrderDetail) {
                            order_Detail_String += elem_OrderDetail.monan.ten +"_"+ elem_OrderDetail.soluong + " phần";
                            if(elem_OrderDetail !== elem_Order.order_detail[elem_Order.order_detail.length - 1]) order_Detail_String += ", "; 
                        })
                        thutu_Order++;
                        tongtien += elem_Order.tongtien;
                    });

                    var data = {
                        soluongorder: orders.length,
                        tongtien: tongtien,
                        order_detail: order_Detail_String
                    }
                    return fn_result(data);
                }
            })
            // orders = doanhthu.order;
            
        }
    });
}
function addOrderDoanhThuById(data, fn_result) {
    mogoose.model_order.create(data, function(err, result) {
        if(err) return fn_result(false);
        else {
            mogoose.model_dichvu.findOneAndUpdate({_id: data.dichvu.id}, {$push: {"dichvu.doanhthu.order": result._id}},
            {safe: true, upsert: true, new : true}, function(err, result_1) {
                if(err) fn_result(false);
                else {
                    mogoose.model_dichvu.findOneAndUpdate({_id: data.information.id}, {$push: {"information.order": result._id}},
                    {safe: true, upsert: true, new : true}, function(err, result_2) {
                        if(err) fn_result(false);
                        else {
                            fn_result(true);
                        }
                    });
                }
            });
        }
    })
}
//-------------------module exports---------------
module.exports = {
    getListDoanhThu : getListDoanhThu,
    getListOrderTheoNgayById : getListOrderTheoNgayById,
    addOrderDoanhThuById : addOrderDoanhThuById,
    getDoanhThuById: getDoanhThuById,
    getAllOrderDoanhThu: getAllOrderDoanhThu
}