const mogoose = require("../common/mongoose");

function getListDoanhThu(id, fn_result) {
    mogoose.model_dichvu.findOne({_id : id}).select("dichvu.doanhthu").exec(function(err, result) {
        if(err) fn_result(false);
        else {
            var doanhthu = result.dichvu.doanhthu;
            for(i = doanhthu.order.length - 1; i >= 0; i--) {
                if(doanhthu.order[i].trangthai == false) doanhthu.order.splice(i, 1);
            }
            var data = {
                soluongorder: doanhthu.order.length,
                tongtien: doanhthu.tongdoanhthu
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
            var data = {
                soluongorder: doanhthu.order.length,
                tongtien: doanhthu.tongdoanhthu
            }
            fn_result(data);
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