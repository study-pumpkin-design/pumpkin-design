export function validateInput(data: any): boolean {
  if (data == null || typeof data !== "object" || Array.isArray(data)) {
    return false;
  }

  for (const value of Object.values(data)) {
    if (typeof value === "string" && value.trim().length === 0) {
      return false;
    }
  }

  return true;
}
