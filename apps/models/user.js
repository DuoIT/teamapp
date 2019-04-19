const mogoose = require("../common/mongoose");
//bcrypt
const bcrypt = require("../helpers/encode_password");

function getUserByUsername(username, fn_result) {
    mogoose.model_dichvu.findOne({ username: username }).exec((err, result) => {
        if (err) return fn_result(false);
        return fn_result(result);
    });
}

function getUserByIdToCheckRole(id, fn_result) {
    mogoose.model_dichvu.findOne({ _id: id }).select("role").exec((err, result) => {
        if (err) return fn_result(false);
        return fn_result(result);
    });
}

function createUser(user, fn_result) {
    mogoose.model_dichvu.create(user, (err, result) => {
        if (err) console.log(err);
        return fn_result(result);
    })
}

function getUserForSignin(username, password, fn_result) {
    getUserByUsername(username, function(result) {
        if (result) {
            if (bcrypt.decode_Password(password, result.password)) {
                result.password = undefined;
                return fn_result(result);
            }
            return fn_result(false);
        } else fn_result(false);
    })
}

function updateAvatarOfStore(id, avatar_url, fn_result) {
    mogoose.model_dichvu.findOne({ _id: id }).exec((err, result) => {
        if (!err) {
            if (result) {
                result.dichvu.avatar_url = avatar_url;
                var user = new mogoose.model_dichvu(result);
                user.save();
                return fn_result(result);
            }
        }
        return fn_result(false);
    });
}

function updateAvatarOfUser(id, avatar_url, fn_result) {
    mogoose.model_dichvu.findOne({ _id: id }).exec((err, result) => {
        if (!err) {
            if (result) {
                result.information.avatar_url = avatar_url;
                var user = new mogoose.model_dichvu(result);
                user.save();
                return fn_result(result);
            }
        }
        return fn_result(false);
    });
}

// function getAllUsersNguoiNau(fn_result) {
//     if(location_Of_Password_Attr != -1) ATTRIBUTE_NEED_SHOW = ATTRIBUTE_NEED_SHOW.substring(0, location_Of_Password_Attr) 
//                             + ATTRIBUTE_NEED_SHOW.substring(location_Of_Password_Attr + FIELD_NEED_CHECK.length, ATTRIBUTE_NEED_SHOW.length);
//     mogoose.model_dichvu.find({name_per:"nguoinau"}).select(ATTRIBUTE_NEED_SHOW).exec((err, results) => {
//         if(err) console.log("error-getallresult-user.js");
//         return fn_result(results);
//     })
// }
// function getAllUsersKhachHang(fn_result) {
//     if(location_Of_Password_Attr != -1) ATTRIBUTE_NEED_SHOW = ATTRIBUTE_NEED_SHOW.substring(0, location_Of_Password_Attr) 
//                             + ATTRIBUTE_NEED_SHOW.substring(location_Of_Password_Attr + FIELD_NEED_CHECK.length, ATTRIBUTE_NEED_SHOW.length);
//     mogoose.model_dichvu.find({name_per:"khachhang"}).select(ATTRIBUTE_NEED_SHOW).exec((err, results) => {
//         if(err) console.log("error-getallresult-user.js");
//         return fn_result(results);
//     })
// }
// function getUserById(id, fn_result) {
//     mogoose.model_dichvu.find({_id : id}).exec((err, result) => {
//         if(err) return fn_result(false);
//         return fn_result(result);
//     });
// }

// function createKhachHang(user, fn_result) {
//     mogoose.model_dichvu.create(user, (err, result) => {
//         if(err) console.log("error-createuser-user.js");
//         return fn_result(true);
//     })
// }

// function updateKhachHang(user, fn_result) {
//     user.password = bcrypt.encode_Password(user.password);
//     mogoose.model_dichvu.updateOne({_id:user._id}, user, function(err) {
//         if(err) return fn_result(false);
//         return fn_result(true);
//     })
// }
// function updateUser(user, fn_result) {
//     user.password = bcrypt.encode_Password(user.password);
//     mogoose.model_dichvu.updateOne({_id:user._id}, user, function(err) {
//         if(err) return fn_result(false);
//         return fn_result(true);
//     })
// }


module.exports = {
    // getAllUsersKhachHang : getAllUsersKhachHang,
    // getAllUsersNguoiNau : getAllUsersNguoiNau,
    getUserByUsername: getUserByUsername,
    // getUserById : getUserById,
    getUserByIdToCheckRole: getUserByIdToCheckRole,
    createUser: createUser,
    //    createDichVu : createDichVu,
    getUserForSignin: getUserForSignin,
    // updateUser : updateUser,
    //    updateDichVu : updateDichVu,
    updateAvatarOfStore: updateAvatarOfStore,
    updateAvatarOfUser: updateAvatarOfUser
}