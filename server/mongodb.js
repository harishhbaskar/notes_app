import mongoose  from "mongoose";

import { MONGO_URI } from "./config/env.js"


if(!MONGO_URI){
    throw new Error("Please define MONGO URI in the .env.dev/prod.local file")
}

const connectToDatabase = async () => {
    try{
        await mongoose.connect(MONGO_URI);
        console.log("Connected to database")
    }catch(error){
        console.error("Coundnt connect to data base" , error);

        process.exit(1);
    }

}

export default connectToDatabase