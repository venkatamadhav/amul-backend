import { transporter } from '@/config/email';
import { Subscription } from '@/models/Subscription';
import { IProduct, AmulProductData } from '@/types';
import { Product } from '@/models/Product';

export const notifySubscribers = async (product: IProduct, updatedProductData: AmulProductData): Promise<void> => {
  try {
    const subscriptions = await Subscription.find({ 
      productId: product.productId, 
      isActive: true 
    });
    console.log("Notifying subscribers for product: ", product.name, "to email: ", subscriptions.map(sub => sub.email));
    
    if (subscriptions.length === 0) {
      console.log(`No active subscriptions found for product: ${product.name}`);
      return;
    }
    
    const productUrl = `https://shop.amul.com/en/product/${product.alias}`;
    
    const emailPromises = subscriptions.map(async (subscription) => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: subscription.email,
        subject: `🎉 ${product.name} is Back in Stock!`,
        html: generateEmailHTML(product, productUrl, updatedProductData.inventory_quantity)
      };
      
      try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Notification sent to ${subscription.email} for product ${product.name}`);
      } catch (emailError) {
        console.error(`❌ Failed to send email to ${subscription.email}:`, emailError);
      }
    });
    
    await Promise.allSettled(emailPromises);
  } catch (error) {
    console.error('❌ Error sending notifications:', error instanceof Error ? error.message : 'Unknown error');
  }
};

const generateEmailHTML = (product: IProduct, productUrl: string, quantity: number): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Product Back in Stock</title>
        <style>
            body { 
                font-family: 'Arial', sans-serif; 
                line-height: 1.6; 
                color: #333; 
                background-color: #f4f4f4; 
                margin: 0; 
                padding: 20px; 
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: white; 
                border-radius: 10px; 
                overflow: hidden; 
                box-shadow: 0 0 20px rgba(0,0,0,0.1); 
            }
            .header { 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                padding: 30px; 
                text-align: center; 
            }
            .header h1 { 
                margin: 0; 
                font-size: 24px; 
                font-weight: bold; 
            }
            .content { 
                padding: 30px; 
            }
            .product-info { 
                background: #f8f9fa; 
                border-radius: 8px; 
                padding: 20px; 
                margin: 20px 0; 
                border-left: 4px solid #667eea; 
            }
            .product-name { 
                font-size: 18px; 
                font-weight: bold; 
                color: #333; 
                margin-bottom: 10px; 
            }
            .product-price { 
                font-size: 16px; 
                color: #28a745; 
                font-weight: bold; 
                margin-bottom: 10px; 
            }
            .stock-info { 
                color: #dc3545; 
                font-weight: bold; 
                font-size: 14px; 
            }
            .cta-button { 
                display: inline-block; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                padding: 15px 30px; 
                text-decoration: none; 
                border-radius: 25px; 
                font-weight: bold; 
                text-align: center; 
                margin: 20px 0; 
                transition: transform 0.2s; 
            }
            .cta-button:hover { 
                transform: translateY(-2px); 
            }
            .footer { 
                background: #f8f9fa; 
                padding: 20px; 
                text-align: center; 
                font-size: 12px; 
                color: #666; 
            }
            .creators { 
                margin-top: 15px; 
                padding-top: 15px; 
                border-top: 1px solid #eee; 
                font-style: italic; 
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Great News!</h1>
                <p>Your awaited product is back in stock</p>
            </div>
            
            <div class="content">
                <p>Hello there! 👋</p>
                
                <p>We're excited to let you know that the product you've been waiting for is now available again!</p>
                
                <div class="product-info">
                    ${product.image ? `<img src="${product.image}" alt="${product.name}" style="max-width: 100%; height: auto; border-radius: 5px; margin-bottom: 15px;">` : ''}
                    <div class="product-name">${product.name}</div>
                    <div class="product-price">₹${product.price}</div>
                    <div class="stock-info">🔥 Only ${quantity} units available - Order quickly!</div>
                </div>
                
                <p>Don't wait too long - popular items like this tend to sell out fast!</p>
                
                <div style="text-align: center;">
                    <a href="${productUrl}" class="cta-button">
                        🛒 Order Now Before It's Gone!
                    </a>
                </div>
                
                <p style="font-size: 14px; color: #666; margin-top: 30px;">
                    You're receiving this email because you subscribed to get notified when this product comes back in stock. 
                    If you no longer wish to receive these notifications, you can unsubscribe at any time.
                </p>
            </div>
            
            <div class="footer">
                <p>Happy Shopping! 🛍️</p>
                <div class="creators">
                    <strong>Made with ❤️ by Nisarg & Harsh</strong>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};

export const fakeNotify = async (email: string, productId: string): Promise<void> => {
  try {
    const product = await Product.findOne({ productId });
    if (!product) {
      console.error(`Product with ID ${productId} not found.`);
      return;
    }
    const productUrl = `https://shop.amul.com/en/product/${product.alias}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `🎉 ${product.name} is Back in Stock!`,
      html: generateEmailHTML(product, productUrl, product.inventoryQuantity)
    };
    await transporter.sendMail(mailOptions);
    console.log(`📧 Test notification sent to ${email} for product ${product.name}`);
  } catch (error) {
    console.error('❌ Error sending test notification:', error instanceof Error ? error.message : 'Unknown error');
  }
};