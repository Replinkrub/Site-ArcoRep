import { whatsappUrl } from "./catalog-data";
import { segments } from "./form-options";

export const attendanceSubjects = {
  mix: "Montar o primeiro mix",
  reposicao: "Reposição ou novas linhas",
  condicoes: "Preços e condições comerciais",
  catalogo: "Solicitar um catálogo",
  pedido: "Acompanhar um pedido",
  industria: "Representação de uma marca",
  duvida: "Outra demanda",
} as const;

export type AttendanceSubject = keyof typeof attendanceSubjects;
export type AttendanceData = {
  name: string;
  phone: string;
  company: string;
  cnpj: string;
  city: string;
  state: string;
  segment: string;
  subject: AttendanceSubject;
  brand: string;
  demand: string;
};

export function attendanceUrl(subject: AttendanceSubject = "duvida", brand?: string, segment?: string) {
  const params = new URLSearchParams({ assunto: subject });
  if (brand) params.set("marca", brand);
  if (resolveAttendanceSegment(segment)) params.set("segmento", segment!);
  return `/atendimento?${params}`;
}

export function resolveAttendanceSubject(value: string | null): AttendanceSubject {
  return value && Object.hasOwn(attendanceSubjects, value) ? value as AttendanceSubject : "duvida";
}

export function resolveAttendanceSegment(value: string | undefined | null) {
  return segments.find(segment => segment === value) ?? "";
}

export function validateAttendance(data: AttendanceData): Partial<Record<keyof AttendanceData, string>> {
  const errors: Partial<Record<keyof AttendanceData, string>> = {};
  if (data.name.trim().length < 2) errors.name = "Informe seu nome.";
  const phone = data.phone.replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "");
  if (!/^\d{10,11}$/.test(phone)) errors.phone = "Informe um telefone com DDD.";
  if (data.company.trim().length < 2) errors.company = "Informe o nome da empresa.";
  if (!/^[A-Z0-9]{12}\d{2}$/i.test(data.cnpj.replace(/[.\-/\s]/g, ""))) errors.cnpj = "Confira o CNPJ: são 14 caracteres, sem contar a pontuação.";
  if (data.city.trim().length < 2) errors.city = "Informe a cidade.";
  if (!/^[A-Z]{2}$/.test(data.state)) errors.state = "Selecione o estado.";
  if (!data.segment) errors.segment = "Selecione o tipo de empresa.";
  if (!Object.hasOwn(attendanceSubjects, data.subject)) errors.subject = "Selecione a demanda.";
  if (data.demand.trim().length < 10) errors.demand = "Conte um pouco mais sobre o que precisa; use pelo menos 10 caracteres.";
  return errors;
}

export function buildAttendanceMessage(data: AttendanceData) {
  return [
    "Olá, Antonio. Vim pelo site da ARCO e preciso de atendimento.",
    "",
    `Nome: ${data.name.trim()}`,
    `WhatsApp: ${data.phone.trim()}`,
    `Empresa: ${data.company.trim()}`,
    `CNPJ: ${data.cnpj.trim().toUpperCase()}`,
    `Cidade/UF: ${data.city.trim()} / ${data.state}`,
    `Tipo de empresa: ${data.segment}`,
    `Demanda: ${attendanceSubjects[data.subject]}`,
    ...(data.brand.trim() ? [`Marca de interesse: ${data.brand.trim()}`] : []),
    "",
    data.demand.trim(),
  ].join("\n");
}

export function attendanceWhatsappUrl(data: AttendanceData) {
  return whatsappUrl(buildAttendanceMessage(data));
}
