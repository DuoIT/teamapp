const mongoose = require("../common/mongoose");
function getListCommentsById(id ,fn_result){
    mongoose.model_dichvu.findOne({_id: id}).exec(function(err, store) {
        if(err) fn_result(false);
        else {
            var comments = [];
            store.dichvu.danhmuc.forEach(function(elem_danhmuc) {
                if(!elem_danhmuc.monan) return;
                elem_danhmuc.monan.forEach(function(elem_monan) {
                    if(!elem_monan.danhgia) return;
                     elem_monan.danhgia.forEach(function(elem_danhgia) {
                        var comment = {};
                        comment._id = elem_danhgia._id;
                        comment.ten_nguoimua = elem_danhgia.nguoimua.name;
                        comment.ten_monan = elem_monan.ten;
                        comment.ten_dichvu = store.dichvu.ten;
                        comment.comment  = elem_danhgia.comment;
                        comment.star = elem_danhgia.star;
                        comments.push(comment);
                    })
                })
            })
            fn_result(comments);
        }
    }) 
}
module.exports = {
    getListCommentsById: getListCommentsById,
}