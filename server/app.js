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
    origin: "http://localhost:5173", // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // if you want to send cookies
};

app.use(cors(corsOptions))
app.use(express.json());

connectToDatabase();

app.use(express.urlencoded({extended:false}));
app.use(cookieParser())

app.get('/',(req , res) => {
    res.send("hello")
}) 

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/notes',notesRouter)
app.use(errorMiddleware);

app.listen(PORT,()=> {
    console.log(`hello  server running http://localhost:${PORT} `)
})

export default app;