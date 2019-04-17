const mogoose = require("../common/mongoose");

function getListDoanhThu(id, fn_result) {
    mogoose.model_dichvu.findOne({_id : id}).select("dichvu.doanhthu").exec(function(err, result) {
        if(err) fn_result(false);
        else {
            var doanhthu = result.dichvu.doanhthu;
            for(i = doanhthu.order.length - 1; i >= 0; i--) {
                if(doanhthu.order[i].trangthai == false) doanhthu.order.splice(i, 1);
            }
            
            orders = doanhthu.order;
            var order_Detail_String = "";
            var thutu_Order = 1;
            orders.forEach(function(elem_Order) {
                order_Detail_String += "Order " +thutu_Order + "- "; 
                order_Detail_String += "tongtien: " + elem_Order.tongtien + ", ";
                elem_Order.order_detail.forEach(function(elem_OrderDetail) {
                    order_Detail_String += elem_OrderDetail.monan.ten +"_"+ elem_OrderDetail.soluong + " phần";
                    if(elem_OrderDetail !== elem_Order.order_detail[elem_Order.order_detail.length - 1]) order_Detail_String += ", "; 
                })
                thutu_Order++;
            });
            var data = {
                soluongorder: doanhthu.order.length,
                tongtien: doanhthu.tongdoanhthu,
                order_detail: order_Detail_String
            }
            fn_result(data);
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
            for(i = doanhthu.order.length - 1; i >= 0; i--) {
                if(doanhthu.order[i].giodat < date || doanhthu.order[i].giodat > new Date()
                || doanhthu.order[i].trangthai == false) doanhthu.order.splice(i, 1);
                else {
                    tongtien += doanhthu.order[i].tongtien;
                    
                }
            }
            doanhthu.tongdoanhthu = tongtien;

            orders = doanhthu.order;
            var order_Detail_String = "";
            var thutu_Order = 1;
            orders.forEach(function(elem_Order) {
                order_Detail_String += "Order " +thutu_Order + "- "; 
                order_Detail_String += "tongtien: " + elem_Order.tongtien + ", ";
                elem_Order.order_detail.forEach(function(elem_OrderDetail) {
                    order_Detail_String += elem_OrderDetail.monan.ten +"_"+ elem_OrderDetail.soluong + " phần";
                    if(elem_OrderDetail !== elem_Order.order_detail[elem_Order.order_detail.length - 1]) order_Detail_String += ", "; 
                })
                thutu_Order++;
            });

            var data = {
                soluongorder: doanhthu.order.length,
                tongtien: doanhthu.tongdoanhthu,
                order_detail: order_Detail_String
            }
            return fn_result(data);
        }
    });
}
function addOrderDoanhThuById(id, order, fn_result) {
    mogoose.model_dichvu.findOneAndUpdate({_id : id }, {$push: {"dichvu.doanhthu.order": order}},
    {safe: true, upsert: true, new : true}, function(err, result) {
        if(err) fn_result(false);
        else fn_result(result);
    });
}
//-------------------module exports---------------
module.exports = {
    getListDoanhThu : getListDoanhThu,
    getListOrderTheoNgayById : getListOrderTheoNgayById,
    addOrderDoanhThuById : addOrderDoanhThuById
}