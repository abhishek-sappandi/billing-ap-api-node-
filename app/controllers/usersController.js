const User = require('../models/user')
const usersController = {}
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

usersController.register = (req, res) => {
    const body = req.body 
    const user = new User(body)
    user.save()
        .then((user) => {
            res.json(user)
        })
        .catch((err) => {
            res.json(err)
        })
}

usersController.login = (req, res) => {
    const body = req.body 
    //let random  
    // check if email is present 
    User.findOne({ mobile: body.mobile })
        .then((user) => {
            if(user) {
                const accountSid = 'ACda17f1bff7e6db5d999ab7dc828dd9d0';
                const authToken = 'd779237a8ad411d163b47adcf2b4c0b6';
                const client = require('twilio')(accountSid, authToken);    
                if(!body.otp || body.resend){
                    
                console.log(user.mobile);
                    random = Math.round(Math.random() * 1000000)  
                    console.log(random);
                    client.messages
                    .create({
                        body: `OTP - ${random}`,
                        from: '+19543242718',
                        to: `+91${user.mobile}`
                    })
                    .then(()=>res.json('OTP sent Sucessfully'))
                    .catch((err)=> req.json(err))
                    //})
                } else {
////////////////////////////////// RESEND OTP //////////////////////////////////////////////////////////////////
                    console.log(random);
                    if(String(random) === String(body.otp)) {
                        const tokenData = {
                            id: user._id
                        }
                        const token = jwt.sign(tokenData, 'dct@123', { expiresIn: '2d'})
                        res.json({
                            token: token
                        })
                    } else {
                        res.json({ errors: 'invalid OTP ' })
                    }
                }

////////////////////////////////// LOGIN WITH USERNAME AND PWD //////////////////////////////////////////////////////////////////
                // bcryptjs.compare(body.password, user.password)
                //     .then((result) => {
                //         if(result) {
                //             const tokenData = {
                //                 id: user._id
                //             }
                //             const token = jwt.sign(tokenData, 'dct@123', { expiresIn: '2d'})
                //             res.json({
                //                 token: token
                //             })
                //         } else {
                //             res.json({ errors: 'invalid email / password' })
                //         }
                //     })
            } else {
                res.json({ errors: 'invalid mobile'})
            }
        })
        .catch((err) => {
            res.json(err)
        })
}

module.exports = usersController