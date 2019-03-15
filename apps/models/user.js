const model = require("../common/mongoose");
//bcrypt
const bcrypt = require("../helpers/encode_password");

var ATTRIBUTE_NEED_SHOW = "email username name_per per_detail licensed khachhang nguoinau password"; //attributes need show for admin !!!
var FIELD_NEED_CHECK =  "password";
var location_Of_Password_Attr = ATTRIBUTE_NEED_SHOW.indexOf(FIELD_NEED_CHECK); //check password attribute have in ATTRIBUTE_NEED_SHOW ??

function getAllUsers(fn_result) {
    if(location_Of_Password_Attr != -1) ATTRIBUTE_NEED_SHOW = ATTRIBUTE_NEED_SHOW.substring(0, location_Of_Password_Attr) 
                            + ATTRIBUTE_NEED_SHOW.substring(location_Of_Password_Attr + FIELD_NEED_CHECK.length, ATTRIBUTE_NEED_SHOW.length);
    model().find().select(ATTRIBUTE_NEED_SHOW).exec((err, results) => {
        if(err) console.log("error-getallresult-user.js");
        return fn_result(results);
    })
}
function getAllUsersNguoiNau(fn_result) {
    if(location_Of_Password_Attr != -1) ATTRIBUTE_NEED_SHOW = ATTRIBUTE_NEED_SHOW.substring(0, location_Of_Password_Attr) 
                            + ATTRIBUTE_NEED_SHOW.substring(location_Of_Password_Attr + FIELD_NEED_CHECK.length, ATTRIBUTE_NEED_SHOW.length);
    model().find({name_per:"nguoinau"}).select(ATTRIBUTE_NEED_SHOW).exec((err, results) => {
        if(err) console.log("error-getallresult-user.js");
        return fn_result(results);
    })
}
function getAllUsersKhachHang(fn_result) {
    if(location_Of_Password_Attr != -1) ATTRIBUTE_NEED_SHOW = ATTRIBUTE_NEED_SHOW.substring(0, location_Of_Password_Attr) 
                            + ATTRIBUTE_NEED_SHOW.substring(location_Of_Password_Attr + FIELD_NEED_CHECK.length, ATTRIBUTE_NEED_SHOW.length);
    model().find({name_per:"khachhang"}).select(ATTRIBUTE_NEED_SHOW).exec((err, results) => {
        if(err) console.log("error-getallresult-user.js");
        return fn_result(results);
    })
}
function getUserByUsername(username, fn_result) {
    model().find({username : username}).exec((err, result) => {
        if(err) return fn_result(null);
        return fn_result(result);
    });
}
function getUserById(id, fn_result) {
    model().find({_id : id}).exec((err, result) => {
        if(err) return fn_result(null);
        return fn_result(result);
    });
}
function createUser(user, fn_result) {
    model().create(user, (err, result) => {
        if(err) console.log("error-createuser-user.js");
        return fn_result(true);
    })
}
function updateUser(user, fn_result) {
    user.password = bcrypt.encode_Password(user.password);
    model().updateOne({_id:user._id}, user, function(err) {
        if(err) return fn_result(false);
        return fn_result(true);
    })
}
function deleteUser(id, fn_result) {
    model().deleteOne({_id : id}, function(err) {
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
        //result[0].password = undefined;
        console.log(result)
        if(result.length != 0) {
           if(bcrypt.decode_Password(password, result[0].password)) {
                result[0].password = undefined;
                return fn_result(result[0]);
           }
           return fn_result(false); 
        }else fn_result(false);
    })
}
module.exports = {
    getAllUsers : getAllUsers,
    getAllUsersKhachHang : getAllUsersKhachHang,
    getAllUsersNguoiNau : getAllUsersNguoiNau,
    getUserByUsername : getUserByUsername,
    getUserById : getUserById,
    createUser : createUser,
    getUserForSignin : getUserForSignin,
    updateUser : updateUser,
    deleteUser : deleteUser
}