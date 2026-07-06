import { type Server } from "node:http";
import type { MvpApplication } from "./application.js";
export declare function createHttpServer(app: MvpApplication): Server;
