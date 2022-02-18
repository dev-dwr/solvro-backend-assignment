import { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import log from "./logger";
import YAML from "yamljs";
import path from "path";

const swaggerSpecification = YAML.load(path.resolve(__dirname) + "/api-spec.yaml")

const swaggerDocs = (app: Express, port: number) => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecification));
  app.get("/docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpecification);
  });

  log.info(`Documentation available at http://localhost:${port}/docs`);
};

export default swaggerDocs;
