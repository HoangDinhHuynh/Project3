const express = require('express')
require('dotenv').config()
const dbConnect = require('./config/dbconnect')
const initRoutes = require('./routes')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app= express()
const port = process.env.PORT || 8888

// khai báo
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())
app.use(cors({
    origin : process.env.CLIENT_URL,
    method :  ['POST','PUT','GET','DELETE'],
    credentials : true
}))

// Kết nối database
dbConnect()

// Khai báo ROUTES
initRoutes(app)

// Cổng 
app.use('/', (req,res) => {res.send('SERVER POPPY')})
app.listen(port, () => {
    console.log('Server running on port : ' + port);
})