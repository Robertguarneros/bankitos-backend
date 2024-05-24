import * as express from 'express'; // Change the import statement
import { Request, Response, NextFunction } from 'express'; // Keep other imports as they are
import { sessionClient, sessionPath } from '../environment';

export class ChatbotRoutes{
public route(app: express.Application): void {

    app.post('/chatbot', async (req: Request, res: Response, next: NextFunction) => {
        const { message, sessionId } = req.body;
    
        try {
            const session = sessionPath(sessionId);
    
            const request = {
                session,
                queryInput: {
                    text: {
                        text: message,
                        languageCode: 'en-US',
                    },
                },
            };
    
            const responses = await sessionClient.detectIntent(request);
            const result = responses[0].queryResult;
    
            res.json({ reply: result.fulfillmentText });
        } catch (error) {
            console.error('Error processing message:', error);
            res.status(500).json({ error: 'Failed to process message' });
        }
    });
}

}


