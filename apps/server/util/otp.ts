interface OTPMapType {
  [email: string]: OTPEntry;
}
interface OTPEntry {
  otp: string;
  intent: string;
  expiresAt: number;
}

const OTP_MAP: OTPMapType = {};
const STATE_MAP: Record<string, Record<string, boolean>> = {};
export function generateOTP(email: string, intent: string): string {
  Object.keys(OTP_MAP).forEach((key) => {
    if (OTP_MAP[key] && OTP_MAP[key].expiresAt < Date.now()) {
      delete OTP_MAP[key];
    }
  });

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  console.log("OTP IS :", otp);
  OTP_MAP[email] = {
    otp,
    intent,
    expiresAt: Date.now() + 10 * 60 * 1000,
  };
  return OTP_MAP[email].otp;
}

export function handleVerifyOTP(
  email: string,
  otp: string,
  intent: string,
): boolean {
  if (!OTP_MAP[email]) throw new Error("OTP isn't present");

  if (OTP_MAP[email].expiresAt < Date.now())
    throw new Error("OTP expired, Request a new OTP!");

  if (OTP_MAP[email].otp != otp) {
    throw new Error("Incorrect OTP");
  }
  if (OTP_MAP[email].intent != intent) {
    throw new Error("Incorrect Intent");
  }

  delete OTP_MAP[email];
  return true;
}

export function generateState(email: string, intent: string) {
  STATE_MAP[email] = { [intent]: true };
}

export function validateState(email: string, intent: string) {
  if (!STATE_MAP[email]) throw new Error("NO_STATE_RECORD_FOUND");
  const state = STATE_MAP[email];
  if (!state[intent]) {
    delete STATE_MAP[email];
    throw new Error("INVALID_STATE_INTENT");
  }

  delete state[intent];
}
