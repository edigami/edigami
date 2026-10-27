import { splitSegments } from "@edigami/x12-core";

/**
 * Returns true when the first segment of the text is an `ST` header for a
 * transaction set 834 (Benefit Enrollment and Maintenance).
 */
export function isBenefitEnrollment(text: string): boolean {
  const [first] = splitSegments(text);
  return first?.startsWith("ST*834*") ?? false;
}
