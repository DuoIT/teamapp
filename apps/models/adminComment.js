const mongoose = require("../common/mongoose");
function getListComments(fn_result){
    mongoose.model_dichvu.find({"role.name_role":"store"}).exec(function(err, stores) {
        if(err) fn_result(false);
        else {
            var comments = [];
            stores.forEach(function(elem_store) {
                if(!elem_store.dichvu || !elem_store.dichvu.danhmuc) return;
                elem_store.dichvu.danhmuc.forEach(function(elem_danhmuc) {
                    if(!elem_danhmuc.monan) return;
                    elem_danhmuc.monan.forEach(function(elem_monan) {
                        if(!elem_monan.danhgia) return;
                        elem_monan.danhgia.forEach(function(elem_danhgia) {
                            var comment = {};
                            comment._id = elem_danhgia._id;
                            comment.ten_nguoimua = elem_danhgia.nguoimua.name;
                            comment.ten_monan = elem_monan.ten;
                            comment.ten_dichvu = elem_store.dichvu.ten;
                            comment.comment  = elem_danhgia.comment;
                            comment.star = elem_danhgia.star;
                            comments.push(comment);
                        })
                    })
                })
            })
            fn_result(comments);
        }
    }) 
}
function deleteComment(id_Comment, fn_result) {
    mongoose.model_dichvu.find({"role.name_role":"store"}).exec(function(err, stores) {
        if(err) fn_result(false);
        else {
            var found_user = null;
            stores.forEach(function(elem_store) {
                if(!elem_store.dichvu || !elem_store.dichvu.danhmuc) return;
                elem_store.dichvu.danhmuc.forEach(function(elem_danhmuc) {
                    if(!elem_danhmuc.monan) return;
                    elem_danhmuc.monan.forEach(function(elem_monan) {
                        if(!elem_monan.danhgia) return;
                        var index = 0;
                        elem_monan.danhgia.forEach(function(elem_danhgia) {
                            if(elem_danhgia._id == id_Comment) {
                                elem_monan.danhgia.splice(index, 1);
                                found_user = elem_store;
                                return;
                            }
                            index++;
                        })
                    })
                })
            })
            
            if(!found_user) fn_result(false);
            else {
                var user = new mongoose.model_dichvu(found_user);
                user.save(function(err) {
                    if(err) return fn_result(false);
                    else fn_result(true);
                })
            }
        }
    })
}
module.exports = {
    getListComments: getListComments,
    deleteComment: deleteComment
}