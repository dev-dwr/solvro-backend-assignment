
import express from "express";
import routes from "../routes";
import config from "config";
import swaggerDocs from "./swagger";

const createServer = () => {
    const app = express();
    const port = config.get<number>("port");
    app.use(express.json());
    routes(app);
    swaggerDocs(app, port);
    
    return app;
  };
  
  export default createServer;