//Controllers
const homeController = require("../app/http/controllers/homeController")
const authController = require("../app/http/controllers/authController")
const cartController = require("../app/http/controllers/customers/cartContoller")
const orderController = require("../app/http/controllers/customers/orderController")
const adminOrderController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')
const adminController = require('../app/http/controllers/admin/adminController')
const multer = require('multer')
//Middlewares
const guest = require("../app/http/middleware/guest")
const auth = require("../app/http/middleware/auth")
const admin = require("../app/http/middleware/admin")
const adminHome = require("../app/http/middleware/adminHome")
        
const storage = multer.diskStorage(
{
    destination:'././public/img',
    filename : function(req,file, cb)
    {
        cb(null,file.originalname)

    }
    });
    var upload = multer({
    storage:storage
    });
            
        
function initRoutes(app) {
    app.get("/",adminHome, homeController().index)
    app.get("/search/",adminHome, homeController().search)
    app.get("/showProduct", homeController().showProductPage)
    //Auth
    app.get("/login", guest, authController().login)
    app.post("/login", authController().postLogin)
    app.post("/logout", authController().logout)
    app.get("/register", guest, authController().register)
    app.post("/register", authController().postRegister)
    //Cart
    app.get("/cart", auth, cartController().index)
    app.post("/update-cart", cartController().update)
    app.post("/remove-item", cartController().remove)
    //Orders
    app.post("/orders", orderController().store)
    app.get("/customers/orders", auth, orderController().index)
    app.get("/customers/orderStatus/:id", auth, orderController().show)
    app.get("/customers/orderStatus/show/:id", auth,orderController().invoice)

    //Admin
    app.get("/admin", admin, adminController().index)
    app.get("/admin/addPage", admin, adminController().addProductPage)
    app.get("/admin/orders", admin, adminOrderController().index)
    app.post("/admin/order/status", admin, statusController().update)
    app.post("/admin/addPage/add", admin, upload.single('imageUpload'),(req,res,next)=>{
        adminController().addProduct(req,res)
    })
    app.get("/admin/products/edit", admin, adminController().editPage)
    app.post("/admin/products/edit", admin, adminController().edit)
    app.get("/admin/products/delete", admin, adminController().delete)
    
    app.get("/admin/products", admin, adminController().products)
    app.post("/admin/products", admin, adminController().products)
    app.get("/admin/addCat", admin, adminController().addCatPage)
    app.get("/admin/addImage",admin, (req,res)=>{
        res.render('admin/addImage')
    })

    app.post("/admin/addCat/add", admin,adminController().addCategory)
    app.get("/admin/analysis", admin, adminController().analysis)
    
}

module.exports = initRoutes