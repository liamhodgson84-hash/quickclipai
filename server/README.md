# QuickClipAI Backend Server

AI-powered YouTube shorts creator backend with video processing, payment handling, and user management.

## Features

- 🎥 Automatic YouTube video downloading and processing
- 🤖 AI-powered video editing with titles and captions
- 💳 Stripe payment integration
- 🔐 Firebase authentication and database
- 📊 Admin dashboard
- 🎬 Multiple video format support
- ⚡ Redis-based job queue for video processing
- 📝 Comprehensive logging

## Prerequisites

- Node.js 16+
- Redis
- FFmpeg
- yt-dlp
- Firebase project
- Stripe account
- OpenAI API key

## Installation

1. Clone the repository:
```bash
cd server
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Configure environment variables:
```env
FIREBASE_PROJECT_ID=your_project_id
STRIPE_SECRET_KEY=your_stripe_key
OPENAI_API_KEY=your_openai_key
REDIS_URL=redis://localhost:6379
```

## Running Locally

### Start Redis
```bash
redis-server
```

### Start the server
```bash
npm run dev
```

Server will run at `http://localhost:5000`

## Docker Deployment

Build and run with Docker:

```bash
docker-compose up -d
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Sign in
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Video Processing
- `POST /api/video/process` - Process YouTube video
- `GET /api/video/status/:jobId` - Get processing status
- `GET /api/video/my-videos` - Get user's videos
- `GET /api/video/download/:jobId` - Get download URL
- `DELETE /api/video/:jobId` - Delete video

### Payments
- `GET /api/payment/tiers` - Get pricing tiers
- `POST /api/payment/create-payment-intent` - Create Stripe payment
- `POST /api/payment/confirm-payment` - Confirm payment
- `POST /api/payment/webhook` - Stripe webhook
- `GET /api/payment/transactions` - Get transaction history

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/stats` - Get user statistics
- `PUT /api/user/preferences` - Update preferences
- `DELETE /api/user/account` - Delete account

### Admin
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - List all users
- `GET /api/admin/videos` - List all videos
- `POST /api/admin/users/:userId/credits` - Add user credits
- `POST /api/admin/users/:userId/suspend` - Suspend user

## Video Processing Pipeline

1. **Download** - Download video from YouTube using yt-dlp
2. **Extract Frames** - Extract key frames for analysis
3. **Generate Titles** - Use GPT-4 Vision to generate engaging titles
4. **Transcription** - Use Whisper to generate captions
5. **Add Effects** - Add overlays, captions, and effects with FFmpeg
6. **Add Music** - Optionally add background music
7. **Upload** - Upload processed video to Firebase Storage

## Error Handling

- Automatic retry with exponential backoff
- Comprehensive error logging
- Graceful degradation (skip music if unavailable)
- Cleanup of temporary files on failure

## Monitoring

View logs:
```bash
tail -f logs/combined.log
tail -f logs/error.log
```

## Performance Optimization

- Job queue for parallel processing
- FFmpeg presets for balanced quality/speed
- Temporary file cleanup
- Redis caching

## Security

- Firebase authentication
- JWT token validation
- Rate limiting (implement in production)
- Input validation
- HTTPS enforcement (in production)
- CORS configuration

## Contributing

Please ensure:
- Code follows consistent style
- All tests pass
- Error handling is comprehensive
- Logging is adequate

## License

BSD 2-Clause "Simplified" License
