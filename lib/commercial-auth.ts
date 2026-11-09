import { env } from "cloudflare:workers";
import { getChatGPTUser, type ChatGPTUser } from "@/app/chatgpt-auth";

export function isCommercialOwner(user: ChatGPTUser | null) {
  const allowed = env.ARCO_ADMIN_EMAIL?.trim().toLowerCase();
  return Boolean(allowed && user?.userId && user.email.toLowerCase() === allowed);
}
export async function commercialOwner() {
  const user = await getChatGPTUser();
  return isCommercialOwner(user) ? user : null;
}
