import { api } from "@opentelemetry/sdk-node";
import init from "./tracer/tracer";

const tracer = init("some-service");

import * as express from "express";

const app = express();

app.get("/some-endpoint", async (request: any, response: any) => {
  const { userId } = request.body;
  let span: api.Span;
  try {
    span = tracer.startSpan("starting meaningful operation");
    span.setAttributes({ userId });
    span.end();
  } catch (e) {
    span.recordException(e);
  }

  response.json({ success: true });
});

app.listen(8090);
