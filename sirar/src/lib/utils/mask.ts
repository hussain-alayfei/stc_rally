export function maskValue(value: string, type: "id" | "phone" | "email" | "account" | "text"): string {
  if (!value) return "";
  switch (type) {
    case "id":
      return value.slice(0, 4) + "****" + value.slice(-2);
    case "phone":
      return value.slice(0, 7) + " **** " + value.slice(-4);
    case "email": {
      const [user, domain] = value.split("@");
      return user.slice(0, 2) + "***@" + domain;
    }
    case "account":
      return "***** ***** " + value.slice(-4);
    case "text":
    default:
      return "معلومات محاكاة";
  }
}
