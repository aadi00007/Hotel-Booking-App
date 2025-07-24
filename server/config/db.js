import mongoose from "mongoose";
const connetDB =async()=>{
    try{
        mongoose.connection.on('connected',()=> console.log("Database connected"));
        await mongoose.connect(`${process.env.MONGODB_URI}/CLIENT`)
    }
    catch(error){
        console.log(error.message)

    }

}
export default connetDB