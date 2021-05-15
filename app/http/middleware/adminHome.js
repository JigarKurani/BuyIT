function adminHome(req,res,next)
{
    if (req.isAuthenticated() && req.user.role === "admin") {
        return res.redirect("/admin")
    }
    return next()
}
module.exports = adminHome