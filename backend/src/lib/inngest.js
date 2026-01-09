import { Inngest } from "inngest";
import { connectDb } from "./db.js";
import User from "../models/User.js";

export const inngest = new Inngest({ id: "CodeChat" });

const syncUser = inngest.createFunction(
  {id: "sync-user"},
  { event: "clerk/user.created" },
  async({event})=>{
    await connectDb()

    const {id,email_address,first_name,last_name,image_url}=event.data
    
    const newUser={
        clerkId:id,
        email:email_address[0]?.email_address,
        name:`${first_name || ""} ${last_name||""}`,
        profileImage:image_url
    } 
   await User.create(newUser)
  }

);

const deleteUserFromDB = inngest.createFunction(
  {id: "deleteUserFromDB"},
  { event: "clerk/user.delete" },
  async({event})=>{
    await connectDb()

    const {id}=event.data
    await User.deleteOne({clerkId:id});
  }

);

export const functions=[syncUser,deleteUserFromDB]
