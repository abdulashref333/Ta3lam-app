const bcrypt = require('bcrypt');

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10); // 10 => number of round to generate this salt
    const hashed = await bcrypt.hash(password, salt); // create hashed password
    return hashed;
}

async function isValidPassword(password, hashedpassword) {
    const isValid = await bcrypt.compare(password, hashedpassword);// true if valid false is not
    return isValid;
}

module.exports.hashPassword = hashPassword;
module.exports.isValidPassword = isValidPassword;
