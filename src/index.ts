import "reflect-metadata";
import { Container } from "inversify";
import * as bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import flash from "connect-flash";

import App from "./app";

import { loggerMiddleware } from "./middlewares/logger.middleware";

import { ConfigUtil } from "./utils/config.util";

import "./controllers/auth.controller";
import "./controllers/home.controller";
import "./controllers/dev.controller";
import "./controllers/api/weapon.controller";
import "./controllers/api/training.controller";

ConfigUtil.parse("./config.ini");

const container = new Container({ defaultScope: "Singleton", autoBindInjectable: true });


const app = new App(container, {
	middleWares: [cookieParser(), bodyParser.json(), bodyParser.urlencoded({ extended: true }), flash(), loggerMiddleware],
	subscribers: []
});

app.listen();

export { app };
