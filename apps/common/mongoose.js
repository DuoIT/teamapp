const mongoose = require("mongoose");
const config = require("config")
var connect = mongoose.connect('mongodb+srv://songtuyen97:proxike123@@cluster0-rmdzb.mongodb.net/test?retryWrites=true', { useNewUrlParser: true });

var schema = mongoose.Schema({
    email: String,
    username : String,
    password : String,
    licensed : Boolean,
    name_per : String,
    per_detail : [{
        action_name : String,
        action_code : Number,
        check_action :Boolean
    }],
    khachhang : {
        name : String,
        phonenumber : String,
        address : String,
        birthday: Date,
        sex : String,
        order : [{
            tongtien : Number,
            diachinhan : String,
            thoigiannhan : Date,
            trangthai : Boolean,
            monan : [{
                soluong : Number,
                tenmon : String,
                mota : String,
                gia : Number,
                image_url : String
            }]
        }],
        danhgia: [{
            star : Number,
            content : String,
            time : Date,
        }]
    },
    nguoinau : {
        name : String,
        phonenumber : String,
        tinh_trang : String,
        address : String,
        avatar_url : String,
        thoigian_giaohang : Date,
        tb_star : Number,
        monan : [{
            tenmon : String,
            mota : String,
            gia : Number,
            image : String,
            danhgia : [{
                star : Number,
                content : String,
                time : Date,
            }]
        }],
        danhgia: [{
            star : Number,
            content : String,
            time : Date,
        }]
    }


});
const model = mongoose.model("user", schema);

// user.find({
//     email : "songtuyen97@gmail.com",
//     password : "proxike"
// }).exec(function(err, results) {
//     console.log(results);
    
// });
// user.create({
//     email : "songtuyen97@gmail.com",
//     username : "songtuyen",
//     password : "abcxyz",
//     licensed : true,
//     per_detail:[{
//         action_name : "post",
//         action_code : 1
//     },{
//         action_name : "comment",
//         action_code : 2
//     }],
//     khachhang:{
//         name:"tuyen",
//         danhgia:[{
//             star: 9
//         }]
//     },
//     nguoinau:{
//         name:"quan an ngon",
//         tinh_trang:"dangmo",
//         danhgia:[{
//             star:2
//         }]
//     }
// })
// user.find({"per_detail.action_name":"post"}).exec(function(err, result){
//     if(!err) {
//         console.log(result);
//     }else console.log(result);
// })
// user.update({title : "superman appear"}, {
//     content : "em dang yeu qua di!",
//     nangam : [{
//         params: "lalala",
//         params_1 : "hihihi"
//     }, {
//         sangsom:"sssss",
//         chieuta : "chieu cc"
//     }]
// }).exec(function(err, result){
//     console.log(result);
// })
function getModel() {
    return model;
}

module.exports = getModel;