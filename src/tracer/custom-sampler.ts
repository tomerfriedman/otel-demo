import { Context, Link, SpanKind, Attributes } from "@opentelemetry/api";
import {
  SamplingDecision,
  Sampler,
  SamplingResult,
} from "@opentelemetry/sdk-trace-base";

export default class CustomSampler implements Sampler {
  shouldSample(
    context: Context,
    traceId: string,
    spanName: string,
    spanKind: SpanKind,
    attributes: Attributes,
    links: Link[]
  ): SamplingResult {
    if (attributes["user.paying"] === true) {
      return {
        decision: SamplingDecision.RECORD_AND_SAMPLED,
      };
    } else {
      return {
        decision: SamplingDecision.NOT_RECORD,
      };
    }
  }
  toString(): string {
    return "";
  }
}
