const validatorPackage = require('validator')
const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        // minlength:[5,'Password should atleast 5 character long']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validatorPackage.isEmail,
            message: 'Invalid email'
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
},
    {
        versionKey: false
    }
)

const user = mongoose.model('user', userSchema)
// user.createIndexes()
module.exports = user