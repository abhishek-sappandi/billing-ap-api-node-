const Customer = require('../models/customer')
var nodemailer = require('nodemailer');
const customersController = {}

customersController.list = (req, res) => {
    Customer.find()
        .then((customers) => {
            res.json(customers)
        })
        .catch((err) => {
            res.json(err)
        })
}

customersController.show = (req, res) => {
    const id = req.params.id
    Customer.findById(id)
        .then((customer) => {
            if (customer) {
                res.json(customer)
            } else {
                res.json({})
            }
        })
        .catch((err) => {
            res.json(err)
        })
}

customersController.create = (req, res) => {
    //////////////////////////////////// NODEMAILER /////////////////////////////////////////////////////////////////
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'abhishekbusiness199@gmail.com',
          pass: 'placement'
        }
      });
      
      var mailOptions = {
        from: 'abhishekbusiness199@gmail.com',
        to: 'abhisheksappandi199@gmail.com',
        subject: 'Welcome',
        text: `Welcome ${req.body.name} to our Billing app`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      })
      //////////////////////////////////// NODEMAILER /////////////////////////////////////////////////////////////////
    const body = req.body
    if(req.file){
        body.profile_url = req.file.path
    }
    const customer = new Customer(body)
    customer.save()
        .then((customer) => {
            res.json(customer)
        })
        .catch((err) => {
            res.json(err)
        })
}

customersController.update = (req, res) => {
    const id = req.params.id
    const body = req.body
    Customer.findByIdAndUpdate(id, body, { new: true, runValidators: true })
        .then((customer) => {
            if (customer) {
                res.json(customer)
            } else {
                res.json({})
            }
        })
        .catch((err) => {
            res.json(err)
        })
}

customersController.destroy = (req, res) => {
    const id = req.params.id
    Customer.findByIdAndDelete(id)
        .then((customer) => {
            if (customer) {
                res.json(customer)
            } else {
                res.json({})
            }
        })
        .catch((err) => {
            res.json(err)
        })
}

module.exports = customersController