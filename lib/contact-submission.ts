import { captureContactAttribution } from "./contact-attribution";

export class ContactSubmissionError extends Error {}

const unavailableMessage = "Não conseguimos concluir o envio. Seus dados continuam no formulário. Tente novamente.";
const contactFieldLabels: Record<string, string> = {
  name: "seu nome", phone: "WhatsApp com DDD", company: "nome da empresa",
  cnpj: "CNPJ", city: "cidade", state: "estado", segment: "tipo de empresa",
  subject: "assunto", brand: "marca de interesse", demand: "descrição do que você precisa",
};

export async function submitContact(data: Record<string, unknown>) {
  const response = await fetch("/api/contatos", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, attribution: captureContactAttribution() }),
    signal: AbortSignal.timeout(20_000),
  });
  const result = await response.json() as { saved?: boolean; error?: string; fields?: Record<string, string[] | undefined> } | null;
  if (!response.ok || result?.saved !== true) {
    if (result?.fields) {
      const invalidFields = Object.entries(contactFieldLabels)
        .filter(([name]) => result.fields?.[name]?.length)
        .map(([, label]) => label);
      throw new ContactSubmissionError(invalidFields.length
        ? `Revise estes campos: ${invalidFields.join(", ")}. Seus dados continuam no formulário.`
        : unavailableMessage);
    }
    throw new ContactSubmissionError(result?.error ?? unavailableMessage);
  }
}

export function contactSubmissionMessage(error: unknown) {
  return error instanceof ContactSubmissionError ? error.message : "Não conseguimos salvar agora. Confira sua conexão e tente novamente. Seus dados continuam no formulário.";
}
