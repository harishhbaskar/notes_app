import {config} from 'dotenv'

if(typeof window == 'undefined') {
config({path:`.env.${process.env.NODE_ENV || 'development'}.local`});
}

export const {PORT ,
     NODE_ENV , 
     MONGO_URI ,
     JWT_SECRET ,
     JWT_EXPIRES_IN,
    } = process.env;
