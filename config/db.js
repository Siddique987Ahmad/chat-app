const mongoose=require('mongoose')
const dotenv=require('dotenv')
dotenv.config()
const db=async()=>{
   try {
     const connect=await mongoose.connect(process.env.MONGO_URI)
     console.log("MongoDB Connected",connect.connection.host,connect.connection.name)
   } catch (error) {
    console.log("error",error)
    process.exit(1)
   }
}

module.exports=db