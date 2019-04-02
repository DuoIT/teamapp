const mogoose = require("../common/mongoose");

function getListDoanhThu(id, fn_result) {
    mogoose.model_dichvu.findOne({_id : id}).select("dichvu.doanhthu").exec(function(err, result) {
        if(err) fn_result(false);
        else {
            var data = {
                doanhthu : result.dichvu.doanhthu
            }
            for(i = data.doanhthu.order.length - 1; i >= 0; i--) {
                if(data.doanhthu.order[i].trangthai == false) data.doanhthu.order.splice(i, 1);
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
            var data_old = {
                doanhthu : result.dichvu.doanhthu
            }
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
            for(i = data_old.doanhthu.order.length - 1; i >= 0; i--) {
                if(data_old.doanhthu.order[i].giodat < date || data_old.doanhthu.order[i].giodat > new Date()
                || data_old.doanhthu.order[i].trangthai == false) data_old.doanhthu.order.splice(i, 1);
                else {
                    tongtien += data_old.doanhthu.order[i].tongtien;
                    
                }
            }
            data_old.doanhthu.tongdoanhthu = tongtien;
            return fn_result(data_old);
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