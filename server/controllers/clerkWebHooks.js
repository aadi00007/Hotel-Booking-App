import User from "../models/User.js";
import { Svix, Webhook } from "svix";
const clerkWebHooks= async(req,res)=>{
    try{
        const whook= new Webhook(process.env.CLERK_WEBHOOK_SECRET)
        const headers = {
            "svix_id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timetstamp"],
            "svix-signature": req.headers["svix-signature"],
        };
        await whook.verify(JSON.stringify(req.body), headers)

        const {data,type} = req.body

        
        switch(type){
            case "user.created":{
                const userData = {
            _id: data.id,
            email : data.email_addresses[0].email_addresses,
            username: data.first_name + " " + data.last_name,
            image : data.image_url,
        }
                await User.create(userData)
                break;
            }
            case "user.updated":{
                const userData = {
            _id: data.id,
            email : data.email_addresses[0].email_addresses,
            username: data.first_name + " " + data.last_name,
            image : data.image_url,
        }
                await User.findByIdAndUpdate(data.id, userData)
                break;
            }
            case "user.deleted":{
                await User.findByIdAndUpdate(data.id);
                break;
            }
            default :
            break;
        }
        res.json({success: true, message: "WebHook Recieved"})
    }
    catch(error){
        console.log(error.message);
        res.json({succes: false, message: error.message});

    }
}
export default clerkWebHooks