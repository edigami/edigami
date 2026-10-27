import { describe, expect, it } from "vitest";
import { splitSegments } from "./segments.ts";

describe("splitSegments", () => {
  it("splits on the terminator and drops empty segments", () => {
    expect(splitSegments("ST*834*0001~\nBGN*00*12345~\n")).toEqual([
      "ST*834*0001",
      "BGN*00*12345",
    ]);
  });

  it("accepts a custom terminator", () => {
    expect(splitSegments("ST*834'SE*2'", "'")).toEqual(["ST*834", "SE*2"]);
  });
});
