const mongoose = require('mongoose')
//npm install validator
const validator = require('validator')
const axios = require('axios')

// customer schema
const Schema = mongoose.Schema // const { Schema } = mongoose 
const customerSchema = new Schema({
    name: {
        type: String,
        required: [true , 'name is required']
    },
    mobile: {
        type: String,
        required: [true, 'mobile number is required'],
        minlength: 10,
        maxlength: 10,
        //custom validations
        validate: {
            validator: function(value){
                return validator.isNumeric(value) // true ? validation pass : validation fail
            },
            message : function(){
                return 'mobile should contain only numbers'
            }
        }
    },
    email: {
        type: String,
        required: [true , 'email is required']
    },
    businessInfo : {
        name: {
            type : String
        },
        address : {
            type : String
        },
        gstn : {
            type :String
        }
    },
    gender : {
        type : String
    },
    profile_url : {
        type : String
    }
})

//////////////////////////////////////// ADD GENDER FROM THE SERVER //////////////////////////////////////
customerSchema.pre('save',function(next){
    let customer = this
    axios.get(`https://api.genderize.io/?name=${customer.name}`)
        .then((response)=>{
            customer.gender = response.data.gender
            next()
        })    
        .catch((err)=>{
            console.log(err);
            next()
        })
})

// customer model
const Customer = mongoose.model('Customer', customerSchema)

module.exports = Customer
