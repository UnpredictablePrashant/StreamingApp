const express = require('express')
const cors = require('cors')

const cookieParser = require('cookie-parser');

const app = express()
require('dotenv').config()
PORT = process.env.PORT

app.use(express.json())
app.use(cors())
app.use(cookieParser())

const conn = require('./util/conn')


const healthCheckRoute = require('./routes/healthCheck.route')
app.use('/health', healthCheckRoute)

const userRoute = require('./routes/user.route')
app.use('/apiv1', userRoute)


app.listen(PORT, ()=>{
    console.log(`Authentication Service Started at port ${PORT}`)
})