// services/telegramService.ts
import axios from 'axios';
import { IProduct } from '@/types';

interface TelegramUser {
  id: number;
  username: string;
  first_name: string;
  last_name?: string;
}

interface TelegramChat {
  id: number;
  type: string;
  username?: string;
}

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: TelegramUser;
    chat: TelegramChat;
    date: number;
    text: string;
  };
}

class TelegramService {
  private botToken: string;
  private baseUrl: string;
  private userChatIds: Map<string, number> = new Map(); // username -> chat_id mapping

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;
    
    if (!this.botToken) {
      console.warn('⚠️ TELEGRAM_BOT_TOKEN not found in environment variables');
    } else {
      // Initialize by getting updates to populate user chat IDs
      this.initializeUserMapping();
    }
  }

  private async initializeUserMapping(): Promise<void> {
    try {
      // Get recent updates to map usernames to chat IDs
      const updates = await this.getUpdates();
      for (const update of updates) {
        if (update.message?.from?.username && update.message?.chat?.id) {
          this.userChatIds.set(update.message.from.username, update.message.chat.id);
        }
      }
      console.log(`📱 Initialized Telegram user mapping for ${this.userChatIds.size} users`);
    } catch (error) {
      console.error('❌ Failed to initialize Telegram user mapping:', error);
    }
  }

  private async getUpdates(): Promise<TelegramUpdate[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/getUpdates`);
      return response.data.result || [];
    } catch (error) {
      console.error('❌ Failed to get Telegram updates:', error);
      return [];
    }
  }

  private async getChatId(username: string): Promise<number | null> {
    // First check our cached mapping
    if (this.userChatIds.has(username)) {
      return this.userChatIds.get(username)!;
    }

    // If not found, try to get fresh updates
    await this.initializeUserMapping();
    return this.userChatIds.get(username) || null;
  }

  async sendProductNotification(username: string, product: IProduct, quantity: number): Promise<boolean> {
    try {
      const chatId = await this.getChatId(username);
      
      if (!chatId) {
        console.error(`❌ Chat ID not found for username: @${username}`);
        console.log(`💡 User @${username} needs to start a conversation with the bot first`);
        return false;
      }

      const message = this.generateProductMessage(product, quantity);
      
      const response = await axios.post(`${this.baseUrl}/sendMessage`, {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: false
      });

      if (response.data.ok) {
        console.log(`📱 Telegram notification sent to @${username} for product ${product.name}`);
        return true;
      } else {
        console.error(`❌ Failed to send Telegram message to @${username}:`, response.data);
        return false;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`❌ Telegram API error for @${username}:`, error.response?.data || error.message);
      } else {
        console.error(`❌ Unexpected error sending Telegram message to @${username}:`, error);
      }
      return false;
    }
  }

  private generateProductMessage(product: IProduct, quantity: number): string {
    const productUrl = `https://shop.amul.com/en/product/${product.alias}`;
    
    return `🎉 <b>Great News!</b>

Your awaited product is back in stock!

📦 <b>${product.name}</b>
💰 <b>₹${product.price}</b>
🔥 <b>Only ${quantity} units available</b>

Don't wait too long - popular items like this tend to sell out fast!

<a href="${productUrl}">🛒 Order Now Before It's Gone!</a>

Happy Shopping! 🛍️

<i>Made with ❤️ by Nisarg & Harsh</i>`;
  }

  async sendTestMessage(username: string, product: IProduct): Promise<boolean> {
    return this.sendProductNotification(username, product, product.inventoryQuantity);
  }

  // Method to handle new users starting conversation with bot
  async handleBotStart(username: string, chatId: number): Promise<void> {
    this.userChatIds.set(username, chatId);
    console.log(`📱 New user registered: @${username} with chat ID: ${chatId}`);
  }
}

export const telegramService = new TelegramService();