import { Application } from 'express';
import { ChatbotController } from '../controllers/chatbotController';

export class ChatbotRoutes {
    private chatbot_controller: ChatbotController = new ChatbotController();

    public route(app: Application) {
        // Define routes for chatbot requests
        app.post('/chatbot', (req, res) => {
            this.chatbot_controller.processMessage(req, res);
        });
    }
}
