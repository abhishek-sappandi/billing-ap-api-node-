const mongoose = require('mongoose')
const { orderItemSchema } = require('./orderItem')
const Product = require('./product')
const Schema = mongoose.Schema

const billSchema = new Schema({
    customer : {
        type : Schema.Types.ObjectId,
        ref : 'Customer'
    },
    date : {
        type : Date
    },
    orderItems : [ orderItemSchema ],
    total : {
        type : Number
    },
    createdAt : {
        type : String
    }
})

//mongoose middleware
billSchema.pre('save',function(next){
    console.log(this);
    const bill = this
    let total = 0
    const productsIds = bill.orderItems.map(item => item.product)
    Product.find().where('_id').in(productsIds)
        .then((products)=>{
            bill.orderItems.forEach((item) => {
              const product = products.find(product => String(product._id) === String(item.product))
              item.price = product.price
              item.subTotal = product.price * item.quantity
              total += item.subTotal  
            })
            bill.total = total
            const date =new Date()
            bill.createdAt = date.getDate() + "-" + `${date.getMonth()+1}` + "-" + date.getFullYear()  
            next()
        })
})

const Bill = mongoose.model('Bill',billSchema)

module.exports = Bill