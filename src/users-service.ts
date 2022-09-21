import init from "./tracer/tracer";
const tracer = init("users-service");

import * as express from "express";
const app = express();

app.get("/user", async (request, response) => {
  Tracer.setAttribute({ userId: 1 });
  response.json({ success: true });
});

app.listen(8090);
