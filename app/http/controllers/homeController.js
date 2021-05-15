const Product = require("../../models/product")
const Category = require("../../models/cat")
function homeController() {
    return {
        index(req, res){
            Product.find({},{name:1,image:1,price:1,category:1}).sort({'hits':-1}).then(function (product) {
                Category.find().then(function(category){
                    return res.render("home", {products : product,categories : category,searchBar:true})  
                })
                
            })
        },
        showProductPage(req,res)
        {
            Product.find({_id:req.query.id},{}).then(function (prod) {
                prod[0].hits = prod[0].hits +1
                prod[0].save()
                return res.render("product", { prod : prod[0],searchBar:true})  
            })
        },
        search(req,res)
        {
            let query ={}
            if(req.query.sort=='asc')
                query = {price:1}
            else if(req.query.sort=='desc')
                query = {price:-1}  
            else    
                query = {hits:- 1} 

            

            Product.find(
                { "name": { "$regex": req.query.key, "$options": "i" } },{name:1,image:1,price:1},
                function(err,docs) { 
                }
            ).sort(query).then(function(prod){
                return res.render("search",{products:prod,search:req.query.key,sort:req.query.sort,searchBar:true})
            });
            
        }
        
    }
}

module.exports = homeController