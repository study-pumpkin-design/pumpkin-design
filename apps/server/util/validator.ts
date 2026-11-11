export function validateInput(data: any): boolean {
  if (data == null) {
    return false;
  }

  for (const value of Object.values(data)) {
    if (Array.isArray(data)) {
      for (const i in data) {
        if (typeof i === "string" && i.trim().length === 0) {
          return false;
        }
      }
    }
    if (typeof value === "string" && value.trim().length === 0) {
      return false;
    }
  }

  return true;
}
