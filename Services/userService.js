let async = require('async'),
    jwt = require('jsonwebtoken');

let util = require('../Utilities/util'),
    userDAO = require('../DAO/userDAO');
    require('dotenv').config();


/******* signup API *******/
let signup = (data, cb) => {
    async.auto({
            checkUserExistsinDB: (cb) => {
                if (!data.name || !data.mobile_no || !data.email_id || !data.password) {
                    cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.PARAMS_MISSING, "result": null })
                    return;
                }

                var userData = {
                    "name": data.name ? data.name : '',
                    "email_id": data.email_id ? data.email_id : '',
                    "mobile_no": data.mobile_no ? data.mobile_no : '',
                    "password": util.encryptData(data.password),
                }
                userDAO.signup(userData, (err, dbData) => {
                    console.log("Signup-->", err)
                    if (err) {
                        cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR, "result": null });
                        return;
                    } else {
                        cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.USER_ADDED});
                    }
                });
            }                             
        },
        (err, response) => {
            cb(response.checkUserExistsinDB);
        })
}

/*****  Login API *****/
let login = (data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.email_id || !data.password) {
                cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.PARAMS_MISSING, "result": null })
                return;
            }

            let criteria = {
                email_id: data.email_id,
                password: util.encryptData(data.password)
            }
            userDAO.userLogin(criteria, (err, dbData) => {
                console.log("User Login--->", err)
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR, "result": null })
                }
                else if (dbData && dbData.length) {
                    const token = jwt.sign({ id: dbData[0].user_id }, process.env.TokenKey, {})
                    dbData[0].token = token

                    userDAO.saveToken(dbData[0].user_id, token)

                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.LOGIN_SUCCESS, "result": dbData[0] });
                }
                else {
                    cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.INCORRECT_CREDENTIALS, "result": null });
                }
            });
        }
    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })
}

/************ Get User Profile ***********/
let getProfile = (headers, cb) => {
    async.auto({
            checkUserExistsinDB: (cb) => {

                var userId
                util.jwtDecode(headers.accesstoken, (err, token) => {
                    userId = token
                })

                var criteria = {
                    "user_id": userId
                }

                userDAO.getProfile(criteria, (err, dbData) => {
                    console.log("User Details--->", err)
                    if (err) {
                        cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    } 
                    else if(dbData && dbData.length>0){
                        cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "User Profile", "result": dbData});
                        return;
                    }
                    else{
                        cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "User not exist"});
                        return;
                    }
                })
                            
            }
        },
        (err, response) => {
            cb(response.checkUserExistsinDB);
        })
}

/************ update Profile ***********/
let updateProfile = (data, headers, cb) => {
    async.auto({
            checkUserExistsinDB: (cb) => {

                var userId
                util.jwtDecode(headers.accesstoken, (err, token) => {
                    userId = token
                })

                var criteria = {
                    "user_id": userId
                }

                let dataToSet = {
                    "name": data.name,
                    "email_id": data.email_id,
                    "mobile_no": data.mobile_no
                }

                userDAO.updateProfile(criteria, dataToSet, (err, updateData) => {
                    console.log("user details", err)
                    if (err) {
                        cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    } 
                    else {
                        cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "User Profile updated successfully"});
                    }
                })
                            
            }
        },
        (err, response) => {
            cb(response.checkUserExistsinDB);
        })
}


module.exports = {
    signup: signup,
    login: login,
    getProfile: getProfile,
    updateProfile: updateProfile,
}