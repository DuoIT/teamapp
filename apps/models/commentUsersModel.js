const mongoose = require("../common/mongoose");
const config = require("config");
var comments = [];

function getListCommentOfMonan(id_Monan, page, fn_Result) {
    mongoose.model_dichvu.find({"role.name_role": "store"}).select("dichvu.danhmuc").exec(function(err, stores) {
        if(err) return fn_Result(false);
        if(stores && stores.length != 0 ){
            var trangThaiBoQua = false;
            stores.forEach(function(elem_Store) {
                elem_Store.dichvu.danhmuc.forEach(function(elem_Danhmuc) {
                    elem_Danhmuc.monan.forEach(function(elem_Monan) {
                        if(elem_Monan._id == id_Monan) {
                            trangThaiBoQua = true;
                            if(comments.length == 0 || page == 1) comments = elem_Monan.danhgia;
                            var fiveComments = [];
                            if(comments) {
                                if(comments.length >= page* config.get("paginate")){
                                    for(i = (page - 1)* config.get("paginate"); i < page* config.get("paginate"); i++) {
                                        fiveComments.push(comments[i]);
                                    }
                                }else {
                                    for(i = (page - 1)* config.get("paginate"); i < comments.length; i++) {
                                        fiveComments.push(comments[i]);
                                    }
                                }
                            }
                            return fn_Result(fiveComments);
                        }
                    })
                    if(trangThaiBoQua == true) return;
                })
                if(trangThaiBoQua == true) return;
            })
            if(trangThaiBoQua == false) fn_Result(false);
        }else fn_Result(false);
    })
}

function addCommentForUser(id_Monan, data, fn_result) {
    mongoose.model_dichvu.find({"role.name_role": "store"}).exec(function(err, stores) {
        if(err) return fn_Result(false);
        if(stores && stores.length != 0 ){
            try {
                var trangThaiBoQua = false;
                stores.forEach(function(elem_Store) {
                    elem_Store.dichvu.danhmuc.forEach(function(elem_Danhmuc) {
                        elem_Danhmuc.monan.forEach(function(elem_Monan) {
                            if(elem_Monan._id == id_Monan) {
                                //add comment vao dau listcomment
                                trangThaiBoQua = true;
                                var oldStar = null;
                                var index_DanhGia = 0;
                                elem_Monan.danhgia.forEach(function(elem_Danhgia) {
                                    if(elem_Danhgia.nguoimua.id == data.nguoimua.id) {
                                        oldStar = elem_Danhgia.star;
                                        elem_Monan.danhgia.splice(index_DanhGia, 1);
                                        elem_Monan.danhgia.unshift(data);
                                    }
                                    index_DanhGia++;
                                })
                                if(!oldStar) {
                                    elem_Monan.danhgia.unshift(data);
                                    //thay doi rating monan
                                    var rating = ((elem_Monan.trungbinhsao * (elem_Monan.danhgia.length - 1)) + data.star)/elem_Monan.danhgia.length;
                                    rating = rating.toFixed(1);
                                    elem_Monan.trungbinhsao = rating;
                                }else {
                                    var rating = ((elem_Monan.trungbinhsao * elem_Monan.danhgia.length) + data.star - oldStar)/elem_Monan.danhgia.length;
                                    rating = rating.toFixed(1);
                                    elem_Monan.trungbinhsao = rating;
                                }
                                //thay doi rating Store
                                var rating_Dichvu = 0;
                                var mount_Rating_dichvu = 0;
                                elem_Store.dichvu.danhmuc.forEach(function(elem_Danhmuc_1) {
                                    elem_Danhmuc_1.monan.forEach(function(elem_Monan_1){
                                        if(elem_Monan_1.danhgia.length != 0) {
                                            rating_Dichvu += elem_Monan_1.trungbinhsao;
                                            mount_Rating_dichvu++;
                                        }
                                    })
                                })
                                rating_Dichvu /= mount_Rating_dichvu;
                                elem_Store.dichvu.rating = rating_Dichvu.toFixed(1);
                                var store = new mongoose.model_dichvu(elem_Store);
                                store.save(function(err, success) {
                                    if(err) fn_result(false);
                                    else fn_result(true);
                                });
                                return;
                            }
                        })
                        if(trangThaiBoQua == true) return;
                    })
                    if(trangThaiBoQua == true) return;
                })
                if(trangThaiBoQua == false) fn_Result(false);
            } catch (error) {
                console.log(error);
            }
            
        }else fn_Result(false);
    })    
}
module.exports = {
    getListCommentOfMonan: getListCommentOfMonan,
    addCommentForUser: addCommentForUser
}