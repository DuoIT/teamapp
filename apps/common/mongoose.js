const mongoose = require("mongoose");
const config = require("config")
var connect = mongoose.connect('mongodb+srv://songtuyen97:proxike123@@cluster0-rmdzb.mongodb.net/test?retryWrites=true', { useNewUrlParser: true });

var schema_dichvu = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    role: {
        name_role: {type: String, required: true},
        description: {type: String, required: false},
        licensed: {type: Boolean, required: true},
        permission: [{
            name_per: {type: String, required: true},
            description: {type: String, required: false},
            per_detail: {
                view: {type: Boolean, required: true},
                create: {type: Boolean, required: true},
                update: {type: Boolean, required: true},
                delete: {type: Boolean, required: true}
            }
        }]
    },
    information: {
        name: {type: String, required: true},
        address: {type: String, required: true},
        phonenumber: {type: String, required: true},
        avatar_url: {type: String, required: true},
        danhgia: [{
            comment: {type: String, required: false},
            star: {type: Number, required: false},
            monan: {
                id: {type: String, required: false},
                ten: {type: String, required: false},
            }
        }],
        order: [{type: String, required: false, ref: "orders"}]
    },
    dichvu: {
        ten: {type: String, required: false},
        diachi: {
            tenthanhpho: {type: String, required: false},
            tenquan: {type: String, required: false},
            tenduong: {type: String, required: false},
            zipcode: {type: Number, required: false}
        },
        rating: {type: Number, required: false},
        mota: {type: String, required: false},
        avatar_url: {type: String, required: false},
        phonenumber: {type: String, required: false},
        doanhthu: {
            tongdoanhthu: {type: Number, required: false},
            order: [{type: String, required: false, ref: "orders"}]
        },
        danhmuc: [{
            ten: {type: String, required: false},
            mota: {type: String, required: false},
            monan: [{
                ten: {type: String, required: false},
                mota: {type: String, required: false},
                hinhanh_url: {type: String, required: false},
                gia: {type: Number, required: false},
                soluong: {type: Number, required: false},
                trungbinhsao: {type: Number, required: false},
                danhgia: [{
                    comment: {type: String, required: false},
                    star: {type: Number, required: false},
                    nguoimua: {
                        id: {type: String, required: false},
                        name: {type: String, required: false}
                    }
                }]
            }]
        }],
    }
});
var schema_order = mongoose.Schema({
        tongtien: {type: Number, required: true},
        giodat: {type: Date, required: true},
        trangthai: {type: String, required: true},
        address: {type: String, required: true},
        information: {
            ten: {type: String, required: true},
            id: {type: String, required: true},
            phonenumber: {type: Number, required: true}
        },
        dichvu: [{
            ten: {type: String, required: true},
            id: {type: String, required: true},
            phonenumber: {type: Number, required: true}
        }],
        order_detail: [{
            monan: {
                ten: {type: String, required: true},
                id: {type: String, required: true}
            },
            tongtien: {type: Number, required: true},
            soluong: {type: Number, required: true},
            gia: {type: Number, required: true}
        }],
        lienket: [{type: String, required: true}],
        sodichvudagiao: {type: Number, default: 0},
        sodichvudadathang: {type: Number, required: true},
        lienketcha: {type: String, required: false}
})
var schema_diachi = mongoose.Schema({
    "tenthanhpho": {type: String, required: true},
	"zipcode": {type: Number, required: true},
	"quan":[{
        "tenquan": {type: String, required: true},
        "zipcode": {type: Number, required: true}
    }]
});
const model_dichvu = mongoose.model("user", schema_dichvu);
const model_order = mongoose.model("orders", schema_order);
const model_diachi = mongoose.model("diachi", schema_diachi);
module.exports = {
    model_dichvu: model_dichvu,
    model_order: model_order,
    model_diachi: model_diachi
};