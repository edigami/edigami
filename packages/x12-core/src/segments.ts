/**
 * Splits raw X12 text into segments, dropping surrounding whitespace and
 * empty segments.
 */
export function splitSegments(text: string, terminator = "~"): string[] {
  return text
    .split(terminator)
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);
}
