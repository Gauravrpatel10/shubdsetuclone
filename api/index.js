import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import AuthRoute from './routes/Auth.route.js'
import UserRoute from './routes/User.route.js'
import CategoryRoute from './routes/Category.route.js'
import BlogRoute from './routes/Blog.route.js'
import CommentRoute from './routes/Comment.route.js'
import BlogLikeRoute from './routes/Bloglike.route.js'
import ViewRoute from './routes/view.route.js'
import FollowRoute from './routes/follow.route.js'
import SaveRoute from './routes/save.route.js'
import NotificationRoute from './routes/notification.route.js'

import { log } from 'console';
import Blog from './models/blog.model.js';

dotenv.config()

const app = express()

app.use(cookieParser());
app.use(express.json());

const allowedOrigins = (process.env.FRONTEND_URL || '').split(',').map((origin) => origin.trim().replace(/^'+|'+$/g, '')).filter(Boolean)
app.use(
    cors({
        origin: allowedOrigins.length ? allowedOrigins : true,
        credentials: true,
    })
)

app.use(cors({
  origin: ['http://localhost:3000', 'https://shubdsetuclone.vercel.app'],
  credentials: true
}));

app.use('/api/auth', AuthRoute)
app.use('/api/user', UserRoute)
app.use('/api/category', CategoryRoute)
app.use('/api/blog',BlogRoute)
app.use('/api/comment',CommentRoute)
app.use('/api/bloglike',BlogLikeRoute)
app.use('/api/view', ViewRoute)
app.use('/api/follow', FollowRoute)
app.use('/api/save', SaveRoute)
app.use('/api/notifications', NotificationRoute)


// Global error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal server error.'
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})

// Connect to MongoDB
let mongoConnected = false
mongoose.connect(process.env.MONGODB_CONN, { dbName: 'Shabd-Setu' })
    .then(() => {
        mongoConnected = true
        console.log('Database connected.')
    })
    .catch(err => {
        mongoConnected = false
        console.log('Database connection failed.', err)
    })

// Export for Vercel serverless
export default app