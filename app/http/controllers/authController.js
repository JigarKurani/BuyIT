const User = require("../../models/user")
const bcrypt = require("bcryptjs")
const passport = require("passport")
function authController() {
    const _getRedirectUrl = (req) => {
        return req.user.role === "admin" ? "/admin" : "/"
    }

    return {
        login(req, res){
            res.render("auth/login")
        },
        postLogin(req, res, next){
            // Fields check
            const { email, password } = req.body
            if (!email || !password) {
                req.flash("error    ", "All fields are required")
              return res.redirect("/login")  
            }
            // Passport Authentication
            passport.authenticate("local", (err, user, info) => {
                if (err) {
                    req.flash("error", info.message)
                    return next(err)
                }
                if (!user) {
                    req.flash("error", info.message)
                    return res.redirect("/login")
                }
                req.logIn(user, (err) => {
                    if (err) {
                        req.flash("error", info.message)
                        return next(err)
                    }
                    return res.redirect(_getRedirectUrl(req))
                })
            }) (req, res, next)
        },
        register(req, res){
            res.render("auth/register")
        },
        // User Registration
       async postRegister(req, res){
            // Fields check
            const { name, email, password } = req.body
            if (!name || !email || !password) {
                req.flash("error", "All fields are required")
                req.flash("name", name)
                req.flash("email", email)
              return res.redirect("/register")  
            }
            // Existing email
            User.exists({ email : email }, (err, result) => {
                if (result) {
                    req.flash("error", "Email already exists")
                    req.flash("name", name)
                    req.flash("email", email)
                  return res.redirect("/register")
                }
            })
            // Hashed password
            const hashedPassword = await bcrypt.hash(password, 10)
            // Storing new user
            const user = new User({
                name,
                email,
                password : hashedPassword
            })

            user.save().then((user) => {
                //Login
               return res.redirect("/")
            }).catch(err => {
                req.flash("error", "Something went wrong")
              return res.redirect("/register")
            })
        },
        logout(req, res){
            if (req.user) {
                req.logout()
                req.session.destroy()
                res.clearCookie('connect.sid') // clean up!
                return res.redirect("/")
            }
        }
    }
}

module.exports = authController