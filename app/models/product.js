const mongoose = require("mongoose")
const Schema = mongoose.Schema
const mongoosePaginate = require('mongoose-paginate')

const productSchema = new Schema({
    name : {type : String, required : true},
    image : {type : String, required : true},
    price : {type :Number, required : true},
    size : {type : String, required : true},
    category : {type : String, required : true},
    hits : {type : Number, required : true},
    description : {type : String, required : true},
    bought : {type : Number, required : true},
})
productSchema.plugin(mongoosePaginate)
const Product = mongoose.model("Product", productSchema)

module.exports = Product