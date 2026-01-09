import mongoose from 'mongoose'

import { ENV } from './env.js'

export const connectDb=async()=>{
    try {
       const conn= await mongoose.connect(ENV.DB)
       console.log("connected to MongoDb:");
       
    } catch (error) {
        console.log("error connection to mongoDb",error)
        process.exit(1);
    }
}
