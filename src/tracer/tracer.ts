import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";

const collectorUrl = "http://localhost:4318/v1/trace";
const init = function (serviceName: string) {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
  });

  // this is an exporter to the collector. In our case it is the Datadog Agent.
  const collectorExporter = new OTLPTraceExporter({
    url: collectorUrl,
  });
  provider.addSpanProcessor(new BatchSpanProcessor(collectorExporter));
  provider.register();

  registerInstrumentations({
    instrumentations: getNodeAutoInstrumentations(),
  });
  const tracer = provider.getTracer(serviceName);
  return tracer;
};

export default init;
