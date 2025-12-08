import express from 'express';
import {PORT} from './config/env.js'
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import notesRouter from './routes/notes.routes.js'
import connectToDatabase from './mongodb.js';
import errorMiddleware from './middleware/error.middleware.js'
import cors from 'cors';

const app = express();

// --- THE FIX: Allow ALL origins temporarily ---
const corsOptions = {
    origin: [
        "http://localhost:5173",                     // Local Frontend
        "https://notes-app-nine-mocha.vercel.app"    // Live Vercel Frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, 
};

app.use(cors(corsOptions))
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