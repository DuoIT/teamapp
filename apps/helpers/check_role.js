const user = require("../models/user");

function check_Role(username, password, role, fn_role) {
    user.getUserForSignin(username, password, function(result) {
        if(!result) fn_role(false);
        else if(result.role == role) fn_role(true);
        else fn_role(false);
    })
}

module.exports = {
    check_Role : check_Role
}