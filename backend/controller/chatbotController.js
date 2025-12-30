import { GoogleGenerativeAI } from '@google/generative-ai';

const restaurantContext = `
You are a helpful assistant for a restaurant reservation website. Here's information about our restaurant:

ABOUT US:
- We are a premium restaurant offering fine dining experiences
- We specialize in multiple cuisines with a focus on quality ingredients
- We offer both dine-in and online ordering services

SERVICES:
1. Table Reservations: Customers can book tables online through our website
2. Online Ordering: Order food for delivery or pickup
3. Special Events: We host private events and celebrations

MENU:
- We offer a diverse menu with appetizers, main courses, desserts, and beverages
- Special dietary options available (vegetarian, vegan, gluten-free)
- Daily specials and seasonal dishes

RESERVATIONS:
- Reservations can be made through our website
- We accept reservations for parties of 1-20 people
- Special arrangements can be made for larger groups
- Advance booking recommended, especially for weekends

ORDERING:
- Online ordering available through our website
- Multiple payment options including Razorpay
- Delivery and pickup options available
- Order tracking available

CONTACT & LOCATION:
- Check our website for location details
- We are open 7 days a week
- Contact us through the website for special requests

Please provide helpful, friendly, and concise answers about our restaurant services, menu, reservations, and ordering process. If asked about specific prices or detailed menu items, suggest visiting our Menu section on the website. Always maintain a warm and professional tone.
`;

export const chatWithBot = async (req, res) => {
  const { message: userMessage } = req.body;
  
  try {
    if (!userMessage || userMessage.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('Gemini API key not configured in backend');
      return res.status(500).json({
        success: false,
        message: 'Chat service is not configured properly'
      });
    }

    const prompt = `${restaurantContext}\n\nCustomer: ${userMessage}\n\nAssistant (provide a helpful, friendly response):`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelsToTry = [
      'gemini-2.0-flash-exp',
      'gemini-pro',
      'models/gemini-2.0-flash-exp',
      'models/gemini-pro'
    ];

    let lastError;
    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return res.status(200).json({
          success: true,
          message: text
        });
      } catch (err) {
        lastError = err;
        const errMessage = String(err?.message || '');
        if (errMessage.includes('429') || errMessage.toLowerCase().includes('quota')) {
          const fallbackResponse = getFallbackResponse(userMessage);
          return res.status(200).json({
            success: true,
            message: fallbackResponse
          });
        }
        if (errMessage.includes('404') || errMessage.toLowerCase().includes('not found')) {
          continue;
        }
        throw err;
      }
    }

    throw lastError || new Error('No available model found');

  } catch (error) {
    let errorMessage = 'I apologize, but I\'m having trouble connecting right now.';
    
    if (error.message?.includes('API key')) {
      errorMessage = 'Chat service configuration error. Please contact support.';
    } else if (error.message?.includes('404')) {
      errorMessage = 'Chat service is temporarily unavailable. Please try again later.';
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getFallbackResponse = (message) => {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.match(/\b(hi|hello|hey|good morning|good evening)\b/)) {
    return "Hello! Welcome to our restaurant. I'm here to help you with information about our menu, reservations, and services. What would you like to know?";
  }
  
  if (lowerMsg.match(/\b(menu|food|dish|meal|eat)\b/)) {
    return "We offer a diverse menu with appetizers, main courses, desserts, and beverages. We have vegetarian, vegan, and gluten-free options available. Please visit our Menu section on the website to see our full offerings and daily specials!";
  }
  
  if (lowerMsg.match(/\b(reservation|book|table|reserve)\b/)) {
    return "You can make reservations directly through our website! We accept reservations for parties of 1-20 people. For larger groups, please contact us through the website for special arrangements. Advance booking is recommended, especially for weekends.";
  }
  
  if (lowerMsg.match(/\b(order|delivery|pickup|take(?: |-)out)\b/)) {
    return "We offer online ordering for both delivery and pickup! You can place your order through our website with multiple payment options including Razorpay. Order tracking is also available so you can monitor your order status.";
  }
  
  if (lowerMsg.match(/\b(hours?|open|close|location|address|where)\b/)) {
    return "We are open 7 days a week! Please check our website for specific hours and location details. Feel free to contact us through the website for directions or any special requests.";
  }
  
  if (lowerMsg.match(/\b(event|party|celebration|private)\b/)) {
    return "We host special events and private celebrations! We can accommodate groups and create a memorable experience for your special occasion. Please contact us through the website to discuss your event requirements.";
  }
  
  if (lowerMsg.match(/\b(thank|thanks)\b/)) {
    return "You're welcome! If you have any other questions about our restaurant, feel free to ask. We're here to help!";
  }
  
  return "Thank you for your question! I'm currently experiencing high demand. For the most accurate and detailed information, please explore our website sections for Menu, Reservations, and Online Ordering, or contact us directly. We're open 7 days a week and offer both dine-in and takeout options!";
};
