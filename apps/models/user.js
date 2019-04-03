const mogoose = require("../common/mongoose");
//bcrypt
const bcrypt = require("../helpers/encode_password");

var ATTRIBUTE_NEED_SHOW = "email username name_per per_detail licensed khachhang nguoinau password"; //attributes need show for admin !!!
var FIELD_NEED_CHECK =  "password";
var location_Of_Password_Attr = ATTRIBUTE_NEED_SHOW.indexOf(FIELD_NEED_CHECK); //check password attribute have in ATTRIBUTE_NEED_SHOW ??

function getAllUsers(fn_result) {
    if(location_Of_Password_Attr != -1) ATTRIBUTE_NEED_SHOW = ATTRIBUTE_NEED_SHOW.substring(0, location_Of_Password_Attr) 
                            + ATTRIBUTE_NEED_SHOW.substring(location_Of_Password_Attr + FIELD_NEED_CHECK.length, ATTRIBUTE_NEED_SHOW.length);
    mogoose.model_dichvu.find().select(ATTRIBUTE_NEED_SHOW).exec((err, results) => {
        if(err) console.log("error-getallresult-user.js");
        return fn_result(results);
    })
}
function getAllUsersNguoiNau(fn_result) {
    if(location_Of_Password_Attr != -1) ATTRIBUTE_NEED_SHOW = ATTRIBUTE_NEED_SHOW.substring(0, location_Of_Password_Attr) 
                            + ATTRIBUTE_NEED_SHOW.substring(location_Of_Password_Attr + FIELD_NEED_CHECK.length, ATTRIBUTE_NEED_SHOW.length);
    mogoose.model_dichvu.find({name_per:"nguoinau"}).select(ATTRIBUTE_NEED_SHOW).exec((err, results) => {
        if(err) console.log("error-getallresult-user.js");
        return fn_result(results);
    })
}
function getAllUsersKhachHang(fn_result) {
    if(location_Of_Password_Attr != -1) ATTRIBUTE_NEED_SHOW = ATTRIBUTE_NEED_SHOW.substring(0, location_Of_Password_Attr) 
                            + ATTRIBUTE_NEED_SHOW.substring(location_Of_Password_Attr + FIELD_NEED_CHECK.length, ATTRIBUTE_NEED_SHOW.length);
    mogoose.model_dichvu.find({name_per:"khachhang"}).select(ATTRIBUTE_NEED_SHOW).exec((err, results) => {
        if(err) console.log("error-getallresult-user.js");
        return fn_result(results);
    })
}
function getUserByUsername(username, fn_result) {
    mogoose.model_dichvu.findOne({username : username}).exec((err, result) => {
        if(err) return fn_result(false);
        return fn_result(result);
    });
}
function getUserById(id, fn_result) {
    mogoose.model_dichvu.find({_id : id}).exec((err, result) => {
        if(err) return fn_result(false);
        return fn_result(result);
    });
}
function getUserByIdToCheckRole(id, fn_result) {
    mogoose.model_dichvu.findOne({_id : id}).select("role").exec((err, result) => {
        if(err) return fn_result(false);
        return fn_result(result);
    });
}
// function createKhachHang(user, fn_result) {
//     mogoose.model_dichvu.create(user, (err, result) => {
//         if(err) console.log("error-createuser-user.js");
//         return fn_result(true);
//     })
// }
function createUser(user, fn_result) {
    mogoose.model_dichvu.create(user, (err, result) => {
        if(err) console.log(err);
        return fn_result(result);
    })
}
// function updateKhachHang(user, fn_result) {
//     user.password = bcrypt.encode_Password(user.password);
//     mogoose.model_dichvu.updateOne({_id:user._id}, user, function(err) {
//         if(err) return fn_result(false);
//         return fn_result(true);
//     })
// }
function updateUser(user, fn_result) {
    user.password = bcrypt.encode_Password(user.password);
    mogoose.model_dichvu.updateOne({_id:user._id}, user, function(err) {
        if(err) return fn_result(false);
        return fn_result(true);
    })
}
function deleteUser(id, fn_result) {
    mogoose.model_dichvu.deleteOne({_id : id}, function(err) {
        if(err) {
            console.log("error-deleteuser-user.js");
            return fn_result(false);
        }
        return fn_result(true);
    });
}
function getUserForSignin(username, password, fn_result) {
    if(location_Of_Password_Attr == -1) ATTRIBUTE_NEED_SHOW += " password";
    getUserByUsername(username, function(result) {
        if(result.length != 0) {
           if(bcrypt.decode_Password(password, result.password)) {
                result.password = undefined;
                return fn_result(result);
           }
           return fn_result(false); 
        }else fn_result(false);
    })
}
function updateAvatarOfStore(id, avatar_url, fn_result) {
    mogoose.model_dichvu.findOne({_id : id}).exec((err, result) => {
        if(!err) {
            if(result) {
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
    mogoose.model_dichvu.findOne({_id : id}).exec((err, result) => {
        if(!err) {
            if(result) {
                result.information.avatar_url = avatar_url;
                var user = new mogoose.model_dichvu(result);
                user.save();
                return fn_result(result); 
            }
        }
        return fn_result(false);
    });
}
module.exports = {
    getAllUsers : getAllUsers,
    getAllUsersKhachHang : getAllUsersKhachHang,
    getAllUsersNguoiNau : getAllUsersNguoiNau,
    getUserByUsername : getUserByUsername,
    getUserById : getUserById,
    getUserByIdToCheckRole : getUserByIdToCheckRole,
    createUser : createUser,
//    createDichVu : createDichVu,
    getUserForSignin : getUserForSignin,
    updateUser : updateUser,
//    updateDichVu : updateDichVu,
    deleteUser : deleteUser,
    updateAvatarOfStore : updateAvatarOfStore,
    updateAvatarOfUser : updateAvatarOfUser
}