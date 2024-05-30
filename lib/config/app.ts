import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from 'mongoose';
import * as cors from 'cors';
import { createServer, Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import environment from "../environment";
import { TestRoutes } from "../routes/test_routes";
import { UserRoutes } from "../routes/user_routes";
import { CommonRoutes } from "../routes/common_routes";
import { PlaceRoutes } from "../routes/place_routes";
import { ReviewRoutes } from "../routes/review_routes";
import { ConversationRoutes } from "../routes/conversation_routes";
import { HousingRoutes } from "../routes/housing_routes";
import { ChatbotRoutes } from "../routes/chatbot";

class App {
   public app: express.Application;
   public httpServer: HttpServer;
   public io: SocketIOServer;
   public mongoUrl: string = 'mongodb://localhost/' + environment.getDBName();

   private test_routes: TestRoutes = new TestRoutes();
   private common_routes: CommonRoutes = new CommonRoutes();
   private user_routes: UserRoutes = new UserRoutes();
   private place_routes: PlaceRoutes = new PlaceRoutes();
   private review_routes: ReviewRoutes = new ReviewRoutes();
   private conversation_routes: ConversationRoutes = new ConversationRoutes();
   private housing_routes: HousingRoutes = new HousingRoutes();
   private chatbot_routes: ChatbotRoutes = new ChatbotRoutes();

   constructor() {
      this.app = express();
      this.httpServer = createServer(this.app);
      this.io = new SocketIOServer(this.httpServer);

      this.config();
      this.mongoSetup();
      this.setupRoutes();
      this.setupSocketIO();
   }

   private config(): void {
      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({ extended: false }));
      this.app.use(cors());
   }

   private mongoSetup(): void {
      mongoose.connect(this.mongoUrl)
         .then(() => {
            console.log("MongoDB connected successfully.");
         })
         .catch((err) => {
            console.error("MongoDB connection error:", err);
         });
   }

   private setupRoutes(): void {
      this.test_routes.route(this.app);
      this.user_routes.route(this.app);
      this.place_routes.route(this.app);
      this.review_routes.route(this.app);
      this.conversation_routes.route(this.app);
      this.housing_routes.route(this.app);
      this.chatbot_routes.route(this.app);
      this.common_routes.route(this.app);
   }

   private setupSocketIO(): void {
      this.io.on('connection', (socket) => {
         console.log('A user connected');
         socket.emit('notification', { message: 'Welcome to the server!' });

         socket.on('disconnect', () => {
            console.log('A user disconnected');
         });
      });
   }

   public startServer(): void {
      this.httpServer.listen(3001, () => {
         console.log(`Server is running on port ${3001}`);
      });
   }
}

const appInstance = new App();
appInstance.startServer();

export default appInstance.app;
