import { saveLead } from "@/db/leads";
import { leadSchema } from "@/lib/leads";

export const dynamic = "force-dynamic";
const json = (body: object, status: number) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return json({ error: "Não conseguimos concluir o envio. Seus dados continuam no formulário. Tente novamente." }, 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return json({ error: "Não conseguimos concluir o envio. Seus dados continuam no formulário. Tente novamente." }, 415);
  if (Number(request.headers.get("content-length")) > 8192) return json({ error: "Reduza os textos do formulário antes de tentar novamente." }, 413);
  let body: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return json({ error: "Não conseguimos concluir o envio. Seus dados continuam no formulário. Tente novamente." }, 400);
    const chunks: Uint8Array[] = [];
    let length = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > 8192) { await reader.cancel(); return json({ error: "Reduza os textos do formulário antes de tentar novamente." }, 413); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    body = JSON.parse(new TextDecoder().decode(bytes));
  } catch { return json({ error: "Não conseguimos concluir o envio. Seus dados continuam no formulário. Tente novamente." }, 400); }
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) return json({ error: "Revise os dados preenchidos antes de tentar novamente.", fields: parsed.error.flatten().fieldErrors }, 400);
  try {
    const result = await saveLead(parsed.data, request.headers.get("cf-connecting-ip"));
    if (result === "conflict") return json({ error: "Os dados mudaram. Revise o formulário e tente novamente." }, 409);
    if (result === "limited") return json({ error: "Recebemos várias solicitações. Aguarde alguns minutos para tentar novamente." }, 429);
    return json({ saved: true }, 201);
  } catch {
    console.error("lead_save_unavailable");
    return json({ error: "Não conseguimos salvar agora. Seus dados continuam no formulário; tente novamente." }, 503);
  }
}
