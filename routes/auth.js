const express = require('express')
const router = express.Router()
const User = require('../models/userSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fetchuser = require('../middleware/fetchuser')
const JWT_secret = process.env.JWT_secret

//register new user
router.post('/createuser', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10) //add the salt
        const hashPassword = await bcrypt.hash(req.body.password, salt)    //hash the password

        if (req.body.password.length < 5) return res.status(400).send('password must be atleast 5 character long')
        req.body.password = hashPassword  //make request password = Hashed password
        const user = await User(req.body) //create user 
        user.save(async (err, result) => {        //save data to db
            if (err) res.status(400).json({success:false,error:err})
            else {
                const authToken = jwt.sign(user.id, JWT_secret)
                res.json({success:true, authToken:authToken })
            }
        })
    }
    catch (err) {
        res.status(500).send('internal server error')
    }
})

//user login 
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body   //destructuring
        let user = await User.findOne({ email })
        if (!user) return res.status(404).json({success:false,error:'please try to login with correct credentials'})

        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) return res.status(401).json({success:false,error:'please try to login with correct credentials'})


        const authToken = jwt.sign(user.id, JWT_secret)
        res.json({success:true,authToken:authToken})
    }

    catch (err) {
        res.status(500).send('internal server error')
    }

})

//get loggedIn user details
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password')
        res.send(user)
    }
    catch (err) {
        res.status(500).send('internal server error')
    }
})
module.exports = router