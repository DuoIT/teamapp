const bcrypt = require("bcrypt");
const config = require("config");

function encode_Password(password) {
    var saltRounds = config.get("bcrypt.saltrounds");

    var salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(password, salt);

    return hash;
}
function decode_Password(password, hash) {
    var check_Password_For_Login = bcrypt.compareSync(password, hash);
    return check_Password_For_Login;
}

module.exports = {
    encode_Password : encode_Password,
    decode_Password : decode_Password
}