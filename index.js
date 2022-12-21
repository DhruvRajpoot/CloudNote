const express=require('express')
const app=express()
require('dotenv').config()  //env
const cors=require('cors') //for CORS
const connectToMongo=require('./db')
const path=require('path')
connectToMongo()    //connect to database
const port= process.env.PORT || 8080

app.use(cors())     //for CORS
app.use(express.json()) //middleware for use of req.body

//static files
app.use(express.static(path.join(__dirname,'./client/build')))
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'./client/build/index.html'))
})

//Available routes
app.use('/api/notes',require('./routes/notes'))
app.use('/api/auth',require('./routes/auth'))

//listening to port
app.listen(port,()=>{
    console.log('listening to port',port)
})