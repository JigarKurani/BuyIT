const LocalStrategy = require("passport-local").Strategy
const User = require("../../models/user")
const bcrypt = require("bcryptjs")
function init(passport) {
    passport.use(new LocalStrategy({ usernameField : "email" }, async (email, password, done) => {
        const user = await User.findOne({ email : email})
        if (!user) {
            return done(null, false, {message : "User not found"})
        }
        bcrypt.compare(password, user.password).then(match => {
            if (match) {
                return done(null, user, {message : "User logged in"})
            }
            return done(null, false, {message : "Email or Password is wrong"})
        }).catch(err => {
            return done(null, false, {message : "User not found"})
        })
    }))
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}
module.exports = init