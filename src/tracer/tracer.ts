import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import CustomSampler from "./custom-sampler";

const collectorUrl = "http://localhost:4318/v1/trace";

const init = function (serviceName: string) {
  // this is an exporter to the collector. In our case it is the Datadog Agent.
  const collectorExporter = new OTLPTraceExporter({
    url: collectorUrl,
  });

  // define how do we want to process the data in the application level.
  const spanProcessor = new BatchSpanProcessor(collectorExporter);

  const sampler = new CustomSampler();

  // register specific instrumentation
  registerInstrumentations({
    instrumentations: getNodeAutoInstrumentations(),
  });

  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
    sampler,
  });

  provider.addSpanProcessor(spanProcessor);
  provider.register();

  const tracer = provider.getTracer(serviceName);
  return tracer;
};

export default init;
