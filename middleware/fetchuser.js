const jwt = require('jsonwebtoken')
const JWT_secret = process.env.JWT_secret
const fetchuser = async (req, res, next) => {
    const token = req.header('auth-token')
    if (!token) return res.status(403).send('try to login with a valid token')
    try {
        const decoded = jwt.verify(token, JWT_secret)
        req.userId = decoded
        next()
    }
    catch (err) {
        res.status(401).send('try to login with valid token')
    }
}

module.exports = fetchuser