const express = require("express");
const path = require("path");
const data_User_From_DB = require(path.join(__dirname, "../../", "/models/user")); //"../models/user"
const data_MonAn_From_Db = require(path.join(__dirname, "../../", "/models/monan")); //"../models/monan"

var router = express.Router();

router.use("/api", require("./admin_api"));

// router.post("/users", function(req, res) {
//     //check admin...
//     var user = req.body;
//     var username = user.username;
//     var encode_Password = bcrypt.encode_Password(user.password);
//     var data_Of_User;
//     if (user.check_NguoiNau) {
//         data_Of_User = {
//             username: user.username,
//             password: encode_Password,
//             per_detail: [{
//                 action_name: "comment",
//                 action_code: 2,
//                 check_action: true
//             }, {
//                 action_name: "view",
//                 action_code: 1,
//                 check_action: true
//             }],
//             khachhang: {
//                 name: user.name,
//                 phonenumber: user.phonenumber,
//                 address: user.address,
//             }
//         }
//     } else {
//         data_Of_User = {
//             username: user.username,
//             password: encode_Password,
//             per_detail: [{
//                 action_name: "post",
//                 action_code: 3,
//                 check_action: true
//             }, {
//                 action_name: "comment",
//                 action_code: 2,
//                 check_action: true
//             }, {
//                 action_name: "view",
//                 action_code: 1,
//                 check_action: true
//             }],
//             nguoinau: {
//                 name: user.name,
//                 phonenumber: user.phonenumber,
//                 address: user.address,
//             }
//         }
//     }

//     data_User_From_DB.getUserByUsername(username, function(result) {
//         if (result.length != 0) res.status(200).json({ notification: "false" });
//         else data_User_From_DB.createUser(data_Of_User, function(result) {
//             if (result) res.status(201).json({ notification: "true" });
//             else res.status(200).json({ notification: "false" });
//         });

//     });
// });

module.exports = router;