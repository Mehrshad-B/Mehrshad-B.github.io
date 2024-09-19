const bcrypt = require("bcryptjs");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userSchema = new Schema({
    userName: {
        type: String,
        unique: true,
    },
    password: String,
    email: String,
    loginHistory: [{
        dateTime: Date,
        userAgent: String,
    }, ],
});

let User;

module.exports.initialize = function() {
    return new Promise(function(resolve, reject) {
        let db = mongoose.createConnection(
            "mongodb+srv://bmehrshad:LMAPEJ67Cks3RcZy@web322-app.tgwaqto.mongodb.net/web322_week8"
        );

        db.on("error", (err) => {
            reject(err); // reject the promise with the provided error
        });
        db.once("open", () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
};

module.exports.registerUser = (userData) => {
    return new Promise(function(resolve, reject) {
        if (userData.password !== userData.password2) {
            reject("Passwords do not match");
        } else {
            bcrypt
                .hash(userData.password, 10)
                .then((hash) => {
                    userData.password = hash;
                    let newUser = new User(userData);
                    newUser
                        .save()
                        .then(() => {
                            resolve();
                        })
                        .catch((err) => {
                            if (err.code === 11000) {
                                reject("User Name already taken");
                            } else {
                                reject("There was an error creating the user: " + err);
                            }
                        });
                })
                .catch((err) => {
                    reject("There was an error encrypting the password");
                });
        }
    });
};

module.exports.checkUser = (userData) => {
    return new Promise(function(resolve, reject) {
        User.findOne({ userName: userData.userName })
            .exec()
            .then((user) => {
                if (!user) {
                    reject("Unable to find user: " + user);
                } else {
                    bcrypt
                        .compare(userData.password, user.password)
                        .then((result) => {
                            if (result) {
                                user.loginHistory.push({
                                    dateTime: new Date().toString(),
                                    userAgent: userData.userAgent,
                                });
                                User.updateOne({ userName: user.userName }, { $set: { loginHistory: user.loginHistory } })
                                    .then(() => {
                                        resolve(user);
                                    })
                                    .catch((err) => {
                                        reject("There was an error verifying the user: " + err);
                                    });
                            } else {
                                reject("Incorrect Password for user: " + userName);
                            }
                        })
                        .catch((err) => {
                            reject("There was an error decrypting the password");
                        });
                }
            })
            .catch((err) => {
                reject("Unable to find user: " + err);
            });
    });
};