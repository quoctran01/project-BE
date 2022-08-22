require('dotenv').config();
const express = require('express') 
const mongoose = require('mongoose')
const cors = require('cors')
const authRouter = require('./router/auth')
const postRouter = require('./router/post')

const connectDB = async ()=> {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mern-stack.efhgp.mongodb.net/mern-stack?retryWrites=true&w=majority`,{
           // autoIndex: false 
           useNewUrlParser: true, // <-- no longer necessary
           useUnifiedTopology: true
        })
        console.log('db connected')
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
    

}
connectDB()
const app= express()
app.use(express.json())
 
app.use(cors())
app.use('/api/auth' ,authRouter)
app.use('/api/posts' , postRouter)

const PORT =5000 

app.listen(PORT ,() => console.log(`server started on ${PORT}`))