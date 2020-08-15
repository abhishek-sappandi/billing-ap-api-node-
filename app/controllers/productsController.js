const Product = require('../models/product')
const csv = require('csv-parser')
const fs = require('fs')
const results = [];
const productsController = {}

productsController.list = (req, res) => {
    Product.find()
        .then((products) => {
            res.json(products)
        })
        .catch((err) => {
            res.json(err)
        })
}

productsController.show = (req, res) => {
    //
    const id = req.params.id
    Product.findById(id)
        .then((product) => {
            if (product) {
                res.json(product)
            } else {
                res.json({})
            }
        })
        .catch((err) => {
            res.json(err)
        })
}

productsController.findbyname = (req,res) =>{
    //find - array filter , findone - array find
    const name = req.params.name
    Product.findOne({name})
        .then((product)=>{
            if(product){
                res.json(product)
            }
        })
        .catch((err)=>{
            res.json(err)
        })
}

productsController.create = (req, res) => {
    const body = req.body
    body.Product_Url = req.files.map(e => e.path)
    const product = new Product(body)
    product.save()
        .then((product) => {
            res.json(product)
        })
        .catch((err) => {
            res.json(err)
        })
}
/// Create_All
productsController.createAll = (req, res) => {
    fs.createReadStream(req.file.path)
        .pipe(csv(['name','price','Product_Url']))
        .on('data', (data) => results.push(data))
        .on('end', () => {
            console.log(results);
            for(let i=0 ; i< results.length ; i++){
                const product = new Product(results[i])
                product.save()
                    .then((product) => {
                        res.json(product)
                    })
            } 
        })
}

productsController.update = (req, res) => {
    const id = req.params.id
    const body = req.body
    Product.findByIdAndUpdate(id, body, { new: true, runValidators: true })
        .then((product) => {
            if (product) {
                res.json(product)
            } else {
                res.json({})
            }
        })
        .catch((err) => {
            res.json(err)
        })
}

productsController.destroy = (req, res) => {
    const id = req.params.id
    Product.findByIdAndDelete(id)
        .then((product) => {
            if (product) {
                res.json(product)
            } else {
                res.json({})
            }
        })
        .catch((err) => {
            res.json(err)
        })
}

module.exports = productsController