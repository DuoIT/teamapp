const mongoose = require("mongoose");
const config = require("config")
var connect = mongoose.connect('mongodb+srv://songtuyen97:proxike123@@cluster0-rmdzb.mongodb.net/test?retryWrites=true', { useNewUrlParser: true });

// var schema = mongoose.Schema({
//     email: String,
//     username : String,
//     password : String,
//     licensed : Boolean,
//     name_per : String,
//     per_detail : [{
//         action_name : String,
//         action_code : Number,
//         check_action :Boolean
//     }],
//     khachhang : {
//         name : String,
//         phonenumber : String,
//         address : String,
//         birthday: Date,
//         sex : String,
//         order : [{
//             tongtien : Number,
//             diachinhan : String,
//             thoigiannhan : Date,
//             trangthai : Boolean,
//             monan : [{
//                 soluong : Number,
//                 tenmon : String,
//                 mota : String,
//                 gia : Number,
//                 image_url : String
//             }]
//         }],
//         danhgia: [{
//             star : Number,
//             content : String,
//             time : Date,
//         }]
//     },
//     nguoinau : {
//         name : String,
//         phonenumber : String,
//         tinh_trang : String,
//         address : String,
//         avatar_url : String,
//         thoigian_giaohang : Date,
//         tb_star : Number,
//         monan : [{
//             tenmon : String,
//             mota : String,
//             gia : Number,
//             image : String,
//             danhgia : [{
//                 star : Number,
//                 content : String,
//                 time : Date,
//             }]
//         }],
//         danhgia: [{
//             star : Number,
//             content : String,
//             time : Date,
//         }]
//     }


// });
var schema_dichvu = mongoose.Schema({
    username : String,
    password : String,
    role : {
        name_role : String,
        description : String,
        licensed : Boolean,
        permission : [{
            name_per : String,
            description : String,
            per_detail : {
                view : Boolean,
                create : Boolean,
                update : Boolean,
                delete : Boolean
            }
        }]
    },
    infomation : {
        name : String,
        address : String, 
        phonenumber : String,
        avatar_url : String,
        danhgia : [{
            comment : String,
            star : Number,
            //? id_monan
            monan : {
                id : String,
                ten : String, 
            }
        }],
        order: [{
            tongtien: Number,
            giodat : Date,
            dichvu : {
                ten : String,
                avatar_url : String,
                id : String
            },
            //id_diachi
            diachi : {
                tenthanhpho: String,
                tenquan : String
            },
            order_detail : [{
                //id_monan : String,
                monan : {
                    ten : String,
                    id : String
                },
                soluong : Number,
                gia: Number
            }]
        }],
    },
    dichvu : {
        ten : String,
        diachi : {
            tenthanhpho : String,
            tenquan : String,
            tenduong : String,
            zipcode : Number
        },
        mota : String, 
        avatar_url : String,
        doanhthu : {
            tongdoanhthu : Number,
            order: [{
                tongtien: Number,
                giodat : Date,
                //id_diachi
                diachi : {
                    tenthanhpho: String,
                    tenquan : String
                },
                order_detail : [{
                    monan : {
                        ten : String,
                        id : String
                    },
                    soluong : Number,
                    gia: Number
                }]
            }]
        },
        monan : [{
            ten : String, 
            mota : String,
            hinhanh_url : String,
            gia : Number,
            soluong : Number,
            trungbinhsao : Number,
            danhgia : [{
                    comment : String,
                    star : Number,
                    //?? id_user
                    nguoimua : {
                        id : String,
                        name : String,
                        avatar_url : String
                    }
            }],
            danhmuc : {
                ten : String,
                mota : String
            }
        }]
    }
});
// var schema_khachhang = mongoose.Schema({
//     username : String,
//     password : String,
//     role : [{
//         name_role : String,
//         description : String,
//         licensed : Boolean,
//         permission : [{
//             name_per : String,
//             description : String,
//             per_detail : {
//                 view : Boolean,
//                 create : Boolean,
//                 update : Boolean,
//                 delete : Boolean
//             }
//         }]
//     }],
//     infomation : {
//         name : String,
//         address : String, 
//         phonenumber : String,
//         avatar_url : String,
//         danhgia : [{
//             comment : String,
//             star : Number,
//             //? id_monan
//             monan : {
//                 id : String,
//                 ten : String, 
//             }
//         }],
//         order: [{
//             tongtien: Number,
//             giodat : Date,
//             dichvu : {
//                 ten : String,
//                 avatar_url : String,
//                 id : String
//             },
//             //id_diachi
//             diachi : {
//                 tenthanhpho: String,
//                 tenquan : String
//             },
//             order_detail : [{
//                 //id_monan : String,
//                 monan : {
//                     ten : String,
//                     id : String
//                 },
//                 soluong : Number,
//                 gia: Number
//             }]
//         }],
//     }
// });
const model_dichvu = mongoose.model("user", schema_dichvu);
//const model_khachhang = mongoose.model("user", schema_khachhang);

module.exports = {
    model_dichvu : model_dichvu,
//    model_khachhang : model_khachhang
};