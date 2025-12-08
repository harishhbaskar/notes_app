import express from 'express';
import {PORT} from './config/env.js'
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import notesRouter from './routes/notes.routes.js'
import connectToDatabase from './mongodb.js';
import errorMiddleware from './middleware/error.middleware.js'
import cors from 'cors';

const app = express();

const corsOptions = {
    origin: function (origin, callback) {
        // 1. Allow requests with no origin (like Postman or server-to-server)
        if (!origin) return callback(null, true);

        // 2. Define your allowed production origin
        // We trim() to ensure no accidental spaces from the environment variable break it
        const allowedOrigin = process.env.CLIENT_URL ? process.env.CLIENT_URL.trim() : "";

        // 3. LOGGING (This is the key part!)
        console.log(`[CORS] Incoming Origin: '${origin}'`);
        console.log(`[CORS] Allowed Client:  '${allowedOrigin}'`);

        // 4. Logic to approve or block
        if (origin === allowedOrigin || origin.startsWith("http://localhost")) {
            return callback(null, true);
        } else {
            console.log("[CORS] Request BLOCKED.");
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());

connectToDatabase();

app.use(express.urlencoded({extended:false}));
app.use(cookieParser())

app.get('/',(req , res) => {
    res.send("Server is running!")
}) 

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/notes',notesRouter)
app.use(errorMiddleware);

app.listen(PORT,()=> {
    console.log(`Server running on port ${PORT}`)
})

export default app;