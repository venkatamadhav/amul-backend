# Amul Product Notification System

A backend service that monitors Amul products and sends notifications via email and Telegram when products come back in stock.

## Features

- 🛍️ Monitor Amul products for stock availability
- 📧 Email notifications when products are back in stock
- 🤖 Telegram bot notifications (optional)
- 🔄 Automatic stock checking via cron jobs
- 🚀 Docker support with Caddy reverse proxy
- 🔒 HTTPS support out of the box

## Prerequisites

- Node.js 20 or higher
- pnpm package manager
- MongoDB Atlas account (for production) or local MongoDB
- Gmail account (for email notifications)
- Telegram account (optional, for bot notifications)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nishu0/amul-backend.git
   cd amul-backend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**

   Create a `.env` file in the root directory with the following variables:
   ```env
   # Server Configuration
   PORT=8000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URL=your_mongodb_atlas_url

   # Email Configuration (Gmail)
   EMAIL_USER=your_gmail_address
   EMAIL_PASS=your_app_password

   # Telegram Bot Configuration (Optional)
   TELEGRAM_BOT_TOKEN=your_bot_token
   ```

   ### Setting up Email Notifications

   1. Go to your Google Account settings
   2. Navigate to Security > 2-Step Verification
   3. At the bottom, click on "App passwords"
   4. Select "Mail" and your device
   5. Copy the generated 16-character password
   6. Paste it as `EMAIL_PASS` in your `.env` file

   ### Setting up Telegram Bot (Optional)

   1. Open Telegram and search for "@BotFather"
   2. Start a chat and send `/newbot`
   3. Follow the instructions to create your bot
   4. Copy the bot token provided
   5. Paste it as `TELEGRAM_BOT_TOKEN` in your `.env` file
   6. **Important**: Start a chat with your bot and send `/start` command
      - This is required for the bot to get your chat ID
      - Without this step, you won't receive notifications

4. **Build and Run**

   Development mode:
   ```bash
   pnpm dev
   ```

   Production mode:
   ```bash
   pnpm build
   pnpm start
   ```

5. **Docker Setup (Optional)**

   Build and run with Docker:
   ```bash
   docker-compose up --build
   ```

## API Endpoints

- `POST /api/test-notification` - Send test notifications
  ```json
  {
    "email": "your@email.com",
    "productId": "product_id",
    "telegramUsername": "your_telegram_username" // optional
  }
  ```

- `GET /health` - Health check endpoint

## Contributing

Feel free to submit issues and enhancement requests!

## License

ISC

## Authors

- Nisarg
- Harsh 