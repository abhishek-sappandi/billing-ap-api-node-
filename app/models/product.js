const mongoose = require('mongoose')

// customer schema
const Schema = mongoose.Schema // const { Schema } = mongoose 
const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min : 1
    },
    Product_Url : {
        type : Array
    }
})

//mongoose pre save middleware function - this function , will be called, just before saving the record to the db
productSchema.pre('save',function(next){
    console.log(this);
    next()
})

// customer model
const Product = mongoose.model('Product', productSchema)

//export model
module.exports = Product
