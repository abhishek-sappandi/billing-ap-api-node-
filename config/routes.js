const express = require('express')
const router = express.Router()
//const { logfiles } = require('../app/middleware/morgan')
var multer  = require('multer')

const customersController = require('../app/controllers/customersController')
const productsController = require('../app/controllers/productsController')
const billsController = require('../app/controllers/billsController')
const usersController = require('../app/controllers/usersController')

// Code of muter file upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'C:/Users/abhis/node/billing-app-api/Profile_pic')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()  + '-' + file.originalname )
    }
  })   
var upload = multer({ storage: storage })

router.get('/api/customers' , customersController.list)
router.post('/api/customers',upload.single('file',12), customersController.create)
router.get('/api/customers/:id', customersController.show)
router.put('/api/customers/:id', customersController.update)
router.delete('/api/customers/:id', customersController.destroy)
//router.post('/api/customers/profile' ,customersController.profile)

router.get('/api/products', productsController.list)
router.post('/api/products',upload.array('file'), productsController.create)
//router.get('/api/products/:name', productsController.show)
router.post('/api/products/list',upload.single('file'), productsController.createAll)
router.get('/api/products/find/:name',productsController.findbyname)
router.get('/api/products/:id', productsController.show)
router.put('/api/products/:id', productsController.update)
router.delete('/api/products/:id', productsController.destroy)

router.get('/api/bills', billsController.list)
router.post('/api/bills', billsController.create)
router.get('/api/bills/:id', billsController.show)
router.delete('/api/bills/:id', billsController.destroy)
router.get('/api/bills/:id/pdf',billsController.pdf)

router.post('/api/users/register', usersController.register)
router.post('/api/users/login', usersController.login)

module.exports = router