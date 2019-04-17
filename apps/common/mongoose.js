const mongoose = require("mongoose");
const config = require("config")
var connect = mongoose.connect('mongodb+srv://songtuyen97:proxike123@@cluster0-rmdzb.mongodb.net/test?retryWrites=true', { useNewUrlParser: true });

var schema_dichvu = mongoose.Schema({
    username: String,
    password: String,
    role: {
        name_role: String,
        description: String,
        licensed: Boolean,
        permission: [{
            name_per: String,
            description: String,
            per_detail: {
                view: Boolean,
                create: Boolean,
                update: Boolean,
                delete: Boolean
            }
        }]
    },
    information: {
        name: String,
        address: String,
        phonenumber: String,
        avatar_url: String,
        danhgia: [{
            comment: String,
            star: Number,
            monan: {
                id: String,
                ten: String,
            }
        }],
        order: [{
            tongtien: Number,
            giodat: Date,
            dichvu: {
                ten: String,
                avatar_url: String,
                id: String
            },
            trangthai: String,
            dichvu: {
                ten: String,
                avatar_url: String,
                id: String
            },
            diachi: {
                tenthanhpho: String,
                tenquan: String
            },
            order_detail: [{
                monan: {
                    ten: String,
                    id: String
                },
                soluong: Number,
                gia: Number
            }]
        }],
    },
    dichvu: {
        ten: String,
        diachi: {
            tenthanhpho: String,
            tenquan: String,
            tenduong: String,
            zipcode: Number
        },
        rating: Number,
        mota: String,
        avatar_url: String,
        phonenumber: String,
        doanhthu: {
            tongdoanhthu: Number,
            order: [{
                tongtien: Number,
                giodat: Date,
                trangthai: String,
                diachi: {
                    tenthanhpho: String,
                    tenquan: String
                },
                information: {
                    ten: String,
                    id: String
                },
                order_detail: [{
                    monan: {
                        ten: String,
                        id: String
                    },
                    soluong: Number,
                    gia: Number
                }]
            }]
        },
        danhmuc: [{
            ten: String,
            mota: String,
            monan: [{
                ten: String,
                mota: String,
                hinhanh_url: String,
                gia: Number,
                soluong: Number,
                trungbinhsao: Number,
                danhgia: [{
                    comment: String,
                    star: Number,
                    nguoimua: {
                        id: String,
                        name: String,
                        avatar_url: String
                    }
                }]
            }]
        }]

    }
});
const model_dichvu = mongoose.model("user", schema_dichvu);
module.exports = {
    model_dichvu: model_dichvu,
};