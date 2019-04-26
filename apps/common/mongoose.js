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
        order: [String]
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
            order: [String]
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
        }],
    }
});
var schema_order = mongoose.Schema({
        tongtien: Number,
        giodat: Date,
        trangthai: String,
        address: String,
        information: {
            ten: String,
            id: String,
            phonenumber: Number
        },
        dichvu: [{
            ten: String,
            id: String,
            phonenumber: Number
        }],
        order_detail: [{
            monan: {
                ten: String,
                id: String
            },
            tongtien: Number,
            soluong: Number,
            gia: Number
        }],
        lienket: [String]
})
var schema_checkout = mongoose.Schema({
        id_monan: String,
        id_dichvu: String,
        soluong: Number
})
var schema_diachi = mongoose.Schema({
    "tenthanhpho":String,
	"zipcode":Number,
	"quan":[{
        "tenquan":String,
        "zipcode":Number
    }]
});
const model_dichvu = mongoose.model("user", schema_dichvu);
const model_order = mongoose.model("orders", schema_order);
const model_checkout = mongoose.model("checkout", schema_checkout);
const model_diachi = mongoose.model("diachi", schema_diachi);
// model_diachi.create({
//     "tenthanhpho": "HO CHI MINH",
//     "zipcode" : 70000,
//     "quan": [{
//         "tenquan": "QUAN 1",
//         "zipcode": 71000
//     },
//     {
//         "tenquan": "QUAN 2",
//         "zipcode": 71100
//     },
//     {
//         "tenquan": "QUAN 3",
//         "zipcode": 72400
//     },
//     {
//         "tenquan": "QUAN 4",
//         "zipcode": 72800
//     },
//     {
//         "tenquan": "QUAN 5",
//         "zipcode": 72700
//     },
//     {
//         "tenquan": "QUAN 6",
//         "zipcode": 73100
//     },
//     {
//         "tenquan": "QUAN 7",
//         "zipcode": 72900
//     },
//     {
//         "tenquan": "QUAN 8",
//         "zipcode": 73000
//     },
//     {
//         "tenquan": "QUAN 9",
//         "zipcode": 73000
//     },
//     {
//         "tenquan": "QUAN 10",
//         "zipcode": 72500
//     },
//     {
//         "tenquan": "QUAN 11",
//         "zipcode": 72600
//     },
//     {
//         "tenquan": "QUAN 12",
//         "zipcode": 71500
//     }]
// })
// model_order.create({
//     tongtien: 30000,
//     giodat: new Date(),
//     trangthai: "chưa thanh toán",
//     diachi: {
//         tenthanhpho: "Da nang",
//         tenquan: "lien chieu"
//     },
//     information: {
//         ten: "chinh",
//         id: "5cb6187df335fd00047121c4"
//     },
//     dichvu: {
//         ten: "songtuyen",
//         id: "5c9350f032aacf04b862e50e"
//     },
//     order_detail: [{
//         monan: {
//             ten: "conchien",
//             id: "5cb73d5ef7d6630004dbf4b7"
//         },
//         soluong: 3,
//         gia: 10000
//     }]
// }, function(err, result) {
//     if(err) console.log("loioday");
// })
// model_checkout.create({
//     id_monan: "5cb73d5ef7d6630004dbf4b7",
//     id_dichvu: "5c9350f032aacf04b862e50e"
// }, function(err, result) {
//     if(err) console.log("loioday");
// })
module.exports = {
    model_dichvu: model_dichvu,
    model_order: model_order,
    model_checkout: model_checkout,
    model_diachi: model_diachi
};