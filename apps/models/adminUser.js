const mogoose = require("../common/mongoose");

function getAllUsers(fn_result) {
    var ATTRIBUTE_NEED_SHOW = "username role.name_role dichvu.ten dichvu.diachi dichvu.phonenumber";
    mogoose.model_dichvu.find({ "role.name_role": "store" }).select(ATTRIBUTE_NEED_SHOW).exec((err, stores) => {
        if (err) fn_result(false);
        else {
            var rs_Users = [];
            stores.forEach(function(elem_Store) {
                var store = {};
                store._id = elem_Store._id;
                store.username = elem_Store.username;
                store.name_role = elem_Store.role.name_role;
                store.ten = elem_Store.infomation.name;
                store.diachi = elem_Store.information.address;
                store.phonenumber = elem_Store.information.phonenumber;
                rs_Users.push(store);
            })
            var ATTRIBUTE_NEED_SHOW_CUSTOMER = "username role.name_role information.phonenumber information.ten information.address";
            mogoose.model_dichvu.find({ "role.name_role": "user" }).select(ATTRIBUTE_NEED_SHOW_CUSTOMER).exec((err, customers) => {
                if (err) fn_result(false);
                else {
                    customers.forEach(function(elem_Customer) {
                        var customer = {};
                        customer._id = elem_Customer._id;
                        customer.username = elem_Customer.username;
                        customer.name_role = elem_Customer.role.name_role;
                        customer.ten = elem_Customer.information.name;
                        customer.diachi = elem_Customer.information.address;
                        customer.phonenumber = elem_Customer.information.phonenumber;
                        rs_Users.push(customer);
                    })
                    return fn_result(rs_Users);
                }
            })
        }
    })
}

function deleteUser(id, fn_result) {
    mogoose.model_dichvu.deleteOne({_id : id}, function(err) {
        if(err) return fn_result(false);
        return fn_result(true);
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
function getUserByUsername(username, fn_result) {
    mogoose.model_dichvu.findOne({ username: username }).exec((err, result) => {
        if (err) return fn_result(false);
        return fn_result(result);
    });
}
function getProfileUserById(id, fn_result) {
    mogoose.model_dichvu.findOne({ _id: id }).select("information role.name_role").exec(function(err, result) {
        if (err) fn_result(false);
        else {
            if(result) {
                var data = {
                    _id: result._id,
                    name: result.information.name,
                    address: result.information.address,
                    phonenumber: result.information.phonenumber,
                    avatar_url: result.information.avatar_url,
                    name_role: result.role.name_role,
                }
                fn_result(data);
            }else fn_result(false);
        }
    })
}
function updateProfileUserById(id, data, fn_result) {
    mogoose.model_dichvu.findOne({ _id: id }).exec(function(err, result) {
        if (err) return fn_result(false);
        if (!result) return fn_result(false);
        result.information.name = data.name_personal;
        result.information.address = data.address_personal;
        result.information.phonenumber = data.phonenumber_personal;
        if(data.avatar_url_personal) result.information.avatar_url = data.avatar_url_personal;
        result.role.name_role = data.name_role;

        var user = new mogoose.model_dichvu(result);
        user.save(function(err, result) {
            if (!err) return fn_result(result);
            else return fn_result(false);
        });

    })
}
module.exports = {
    getAllUsers: getAllUsers,
    deleteUser: deleteUser,
    getUserByIdToCheckRole: getUserByIdToCheckRole,
    getUserByUsername: getUserByUsername,
    createUser: createUser,
    getProfileUserById: getProfileUserById,
    updateProfileUserById: updateProfileUserById
}