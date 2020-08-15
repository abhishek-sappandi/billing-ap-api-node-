const mongoose = require('mongoose')
const isEmail = require('validator/lib/isEmail') // npm install validator
const bcryptjs = require('bcryptjs') // npm install bcryptjs
const cron = require('node-cron')
var nodemailer = require('nodemailer')
const Bill = require('../models/bill')

const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String, 
        required: [true, 'username is required'], 
        unique: true 
    },
    mobile : { 
        type : String,
        unique : true ,
        required : [true, 'phone no. is required'],
        minlength : 10,
        maxlength : 10
    },
    email: {
        type: String,
        required: [true, 'email is required'], 
        unique: true, 
        validate: { // custom validation using mongoose
            validator: function(value){
                return isEmail(value)
            }, 
            message: function(){
                return 'invalid email format'
            }
        }
    },
    password: {
        type: String,
        required: [true, 'password needs to within 8 - 128 characters'], 
        minlength: 8,
        maxlength: 128
    },
    otp : {
        type : String
    }
})

userSchema.pre('save', function(next){
    const user = this
    bcryptjs.genSalt()
        .then((salt) => {
            bcryptjs.hash(user.password, salt)
                .then((encryptedPassword) => {
                    user.password = encryptedPassword
                    next()
                })
        })
})
 ////////////////////////////////////// NODE CORN - EVERY DAY ////////////////////////////////////////////////////////
cron.schedule('*/5 * * * * *', () => { // 0 0 0 1-31 * *  for every day
    User.find()
        .then((user)=>{
            const date =new Date()
            todays_date = date.getDate() + "-" + `${date.getMonth()+1}` + "-" + date.getFullYear()  
            Bill.find({ createdAt : todays_date })
              .then((bills)=>{
                console.log(bills);
                    //const Today_sales = bills.map(e => e.total)
                    let totals = 0 
                    for(let i=0 ; i < bills.length ; i++){
                        totals += bills[i].total
                    }
                    console.log(totals)


              })

            const email = user.map(e => e.email)
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'abhishekbusiness199@gmail.com',
                  pass: 'placement'
                }
              });
              
              var mailOptions = {
                from: 'abhishekbusiness199@gmail.com',
                to: `${email[0]}`,
                subject: 'Sale Report',
                text: `this is the daily report`,
                attachments: [{
                    filename: 'raghu.pdf',
                    path: 'C:/Users/abhis/node/billing-app-api/raghu.pdf',
                    contentType: 'application/pdf'
                  }]
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              })
        })
})
 ////////////////////////////////////// NODE CORN - EVERY SUNDAY DAY ////////////////////////////////////////////////////////
cron.schedule('5 8 * * 7',() => { // 5 8 * * 7 for every sunday
    User.find()
        .then((user)=>{

            const date =new Date()
            todays_date = date.getDate() + "-" + `${date.getMonth()+1}` + "-" + date.getFullYear()  
            Bill.find({ createdAt : todays_date })
              .then((bills)=>{
                console.log(bills);
                    //const Today_sales = bills.map(e => e.total)
                    let totals = 0 
                    for(let i=0 ; i < bills.length ; i++){
                        totals += bills[i].total
                    }
                    console.log(totals)


              })

            const email = user.map(e => e.email)
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'abhishekbusiness199@gmail.com',
                  pass: 'placement'
                }
              });
              
              var mailOptions = {
                from: 'abhishekbusiness199@gmail.com',
                to: `${email[0]}`,
                subject: 'Sales Report',
                text: `this is the weekly report`
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              })
        })
})

const User = mongoose.model('User', userSchema)

module.exports = User