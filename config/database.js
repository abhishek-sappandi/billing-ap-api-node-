const mongoose = require('mongoose')

const configureDB = () => {
    // database configuration 
    mongoose.connect('mongodb://localhost:27017/billing-app-march', { useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex : true})
        .then(() => {
            console.log('connected to db')
        })
        .catch((err) => {
            console.log(err)
        })  
}

module.exports = configureDB