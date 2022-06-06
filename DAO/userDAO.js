let dbConfig = require("../Utilities/dbConfig");


/**** Create User *****/
let signup = (dataToSet, callback) => {
    dbConfig.getDB().query("insert into user set ? ", dataToSet, callback);
}

/**** Get User Login Data *****/
let userLogin = (criteria, callback) => {
    dbConfig.getDB().query(`select u.* from user as u where u.email_id = '${criteria.email_id}' and u.password = '${criteria.password}'`, callback);
}

/**** Get User Profile *****/
let getProfile = (criteria, callback) => {
    let conditions = "";

    if (criteria.user_id) {
        criteria.user_id ? conditions += `u.user_id = '${criteria.user_id}'` : true;
    }
    dbConfig.getDB().query(`select u.* from user as u where ${conditions}`, callback);
}

/**** Save User Token *****/
let saveToken = (user_id, token) => {
    dbConfig.getDB().query(`update user set jwt_token = '${token}' where user_id = '${user_id}'`);
}

/**** Update Profile *****/
let updateProfile = (criteria, dataToSet, callback) => {
    let setData = "";
    dataToSet.email_id ? setData += `u.email_id = '${dataToSet.email_id}', ` : true;
    dataToSet.name ? setData += `u.name = '${dataToSet.name}', ` : true;
    dataToSet.mobile_no ? setData += `u.mobile_no = '${dataToSet.mobile_no}'` : true;

    dbConfig.getDB().query(`UPDATE user as u SET ${setData} where u.user_id = '${criteria.user_id}'`, callback);
}

module.exports = {
    signup: signup,
    userLogin: userLogin,
    saveToken: saveToken,
    getProfile: getProfile,
    updateProfile: updateProfile,

}