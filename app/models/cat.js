const mongoose = require("mongoose")
const Schema = mongoose.Schema

const categoriesSchema = new Schema({
    catName : {type : String, required : true},
    code : {type : String, required : true, unique : true},
}, { timestamps : true })
const categories = mongoose.model("Categories", categoriesSchema)

module.exports = categories