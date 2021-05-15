const Product = require("../../../models/product")
const Category = require("../../../models/cat")
const Order = require("../../../models/order")
function adminHomeControl(){
    return{
        index(req, res) {
            let tot = 0
            Order.find({},{totalPrice:1,_id:0}).then(function(sum){

                for (a in sum){
                    tot = tot + sum[a].totalPrice
                }
                Order.aggregate().group({ _id: '$date', sum: { $sum: '$totalPrice' }}).sort({'date':1}).then(function(dateGroup){
                    Product.aggregate([{
                        $lookup: {
                                from: "categories",
                                let:{categ:'$category'},
                                pipeline:[
                                    {$match:{$expr:{
                                        $eq:["$code","$$categ"]
                                    }}},
                                    {$project:{
                                        _id:0,
                                        catName : 1
                                    }}
                                ],
                                as: "catName"
                            }
                      
                    }]).match({ bought: { $gt:0} }).group({ _id: '$catName', count: { $sum: '$bought' }})
                    .then(function(catWise){
                        return res.render("admin/home",{total:tot,dateWise:JSON.stringify(dateGroup),noOfOrders:sum.length,catWise:JSON.stringify(catWise)})

                    })
                    
                })
                
            })
            
        },
        addProductPage(req,res)
        {
            Category.find({},{_id:0}).then(function(cat){
                return res.render("admin/add",{category:cat})       
            })
            
        },
        addProduct(req,res){

            const { pname, price ,image, size,cat,desc } = req.body
            if(!pname || !price ||!image|| !size|| !cat  ||!desc) {
                req.flash("error", "All fields are required")
                return res.redirect("/admin/addPage")  
            }
            

            const product = new Product({
                name : pname,
                image :image,
                price: parseFloat(price),
                size:size,
                category:cat,
                hits:0,
                description:desc,
                bought:0
            })
            product.save().then(result => {
                return res.redirect("/admin/addPage")

            }).catch(err => {
                return res.redirect("/admin/addPage")
            })
        },
        addCatPage(req,res)
        {
            return res.render("admin/addCat")   
        },
        addCategory(req,res){
            const { cname, ccode } = req.body
            if(!cname || !ccode ) {
                
                console.log("noob")
                return res.redirect("/admin/addPage")  
            }
            //Creating a new order
            const cat = new Category({
                catName : cname,
                code :ccode,
               
            })
            cat.save().then(result => {
                req.flash("success", "Category added")
                return res.redirect("/admin/addCat")

            }).catch(err => {
                console.log("Something went wrong")
                return res.redirect("/admin/addCat")
            })
        },
        analysis(req,res)
        {

            Product.find({},{name:1,hits:1,bought:1,_id:0}).where('hits').gt(0).then(function (product) {
                res.render('admin/analysis',{product:JSON.stringify(product)})
                

            })
        
        }
        
    }
}
module.exports = adminHomeControl