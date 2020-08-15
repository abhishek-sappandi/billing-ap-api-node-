const express = require('express')
const configureDB = require('./config/database')
const router = require('./config/routes')
var fs = require('fs')
var morgan = require('morgan')
const app = express()
const port = 3055 
// setup db
configureDB()

// enable express to read incoming json data 
// Build-in middleware
app.use(express.json())

// Application level middleware
app.use(function(req, res , next){
    console.log(`${req.method} - ${req.url} - ${req.ip} - ${new Date()}`)
    next()
})

////////////////////////  MORGON - to print logs ////////////////////////////////////////
// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(__dirname + '/access.log',{flags: 'a'});
// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))
/////////////////////////////////////////////////////////////////////////////////////////

// Route level middleware
// router.get('/api/customers', authenticateUser , authoriseUser , customersController.list) in rotes file

// Error handling middleware
app.get('/api/error', (req,res) => {
    throw new Error('some error')
})
app.get('/api/error2', (req,res) => {
    throw new Error('some error 2')
})


app.get('/', (req, res) => {
	res.send('hello, world!')
})


app.use(router)

// Error handling middleware functions
 app.use(function(err, req, res, next){
     // send report budsnag - any bug monitoring tool
     console.log('sent report to bug mon tool',req.url)
     res.status('500').json({ error : err.message})
 })


  
app.listen(port, () => {
    console.log('server running on port', port)
})


