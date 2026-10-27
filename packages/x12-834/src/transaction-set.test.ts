import { describe, expect, it } from "vitest";
import { isBenefitEnrollment } from "./transaction-set.ts";

describe("isBenefitEnrollment", () => {
  it("recognizes an 834 transaction set header", () => {
    expect(isBenefitEnrollment("ST*834*0001*005010X220A1~BGN*00*12345~")).toBe(
      true,
    );
  });

  it("rejects other transaction sets", () => {
    expect(isBenefitEnrollment("ST*837*0001~")).toBe(false);
  });
});
