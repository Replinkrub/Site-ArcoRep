"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { catalogBrands } from "@/lib/catalog-data";
import { segments, states } from "@/lib/form-options";
import { submitContact, contactSubmissionMessage } from "@/lib/contact-submission";
import {
  attendanceSubjects, attendanceWhatsappUrl, buildAttendanceMessage,
  resolveAttendanceSubject, resolveAttendanceSegment, validateAttendance,
  type AttendanceData, type AttendanceSubject,
} from "@/lib/attendance";

function Field({ name, label, error, children, full = false }: {
  name: string; label: string; error?: string; children: ReactNode; full?: boolean;
}) {
  return <div className={`attendance-field${full ? " attendance-field--full" : ""}`}>
    <label htmlFor={name}>{label}</label>
    {children}
    {error && <span className="attendance-field-error" id={`${name}-error`}>{error}</span>}
  </div>;
}

function FormFields({ initialSubject, initialBrand, initialSegment }: { initialSubject: AttendanceSubject; initialBrand: string; initialSegment: string }) {
  const [errors, setErrors] = useState<ReturnType<typeof validateAttendance>>({});
  const [prepared, setPrepared] = useState<AttendanceData | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState("");
  const requestId = useRef<string | null>(null);

  function fieldProps(name: keyof AttendanceData) {
    return { id: name, name, required: true, "aria-invalid": Boolean(errors[name]), "aria-describedby": errors[name] ? `${name}-error` : undefined };
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries()) as AttendanceData;
    const nextErrors = validateAttendance(values);
    setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      (form.elements.namedItem(firstError) as HTMLElement | null)?.focus();
      return;
    }
    setBusy(true);
    setSaveError("");
    requestId.current ??= crypto.randomUUID();
    try {
      const brand = catalogBrands.find(brand => brand.name === values.brand)?.slug ?? "";
      await submitContact({ ...values, brand, source: "attendance", id: requestId.current });
      setPrepared(values);
      // Same-tab navigation works in embedded mobile browsers without a popup.
      window.location.assign(attendanceWhatsappUrl(values));
    } catch (error) { setSaveError(contactSubmissionMessage(error)); }
    finally { setBusy(false); }
  }

  return <>
    <form className="attendance-form" aria-busy={busy} onSubmit={submit} noValidate onChange={() => { setPrepared(null); setCopyStatus(""); setSaveError(""); requestId.current = null; }}>
      <fieldset className="attendance-fields" disabled={busy}>
        <Field name="name" label="Seu nome" error={errors.name}><Input {...fieldProps("name")} autoComplete="name" maxLength={80} placeholder="Como podemos chamar você?" /></Field>
        <Field name="phone" label="WhatsApp com DDD" error={errors.phone}><Input {...fieldProps("phone")} type="tel" inputMode="tel" autoComplete="tel" maxLength={22} placeholder="(81) 99999-9999" /></Field>
        <Field name="company" label="Nome da empresa" error={errors.company}><Input {...fieldProps("company")} autoComplete="organization" maxLength={120} /></Field>
        <Field name="cnpj" label="CNPJ" error={errors.cnpj}><Input {...fieldProps("cnpj")} autoCapitalize="characters" spellCheck={false} maxLength={18} placeholder="00.000.000/0000-00" /></Field>
        <Field name="city" label="Cidade" error={errors.city}><Input {...fieldProps("city")} autoComplete="address-level2" maxLength={80} /></Field>
        <Field name="state" label="Estado" error={errors.state}><NativeSelect {...fieldProps("state")} autoComplete="address-level1" defaultValue="PE">{states.map(state => <option key={state} value={state}>{state}</option>)}</NativeSelect></Field>
        <Field name="segment" label="Tipo de empresa" error={errors.segment}><NativeSelect {...fieldProps("segment")} defaultValue={initialSegment || (initialSubject === "industria" ? "Indústria" : "")}><option value="" disabled>Selecione</option>{segments.map(segment => <option key={segment} value={segment}>{segment}</option>)}</NativeSelect></Field>
        <Field name="subject" label="O que você precisa?" error={errors.subject}><NativeSelect {...fieldProps("subject")} defaultValue={initialSubject}>{Object.entries(attendanceSubjects).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</NativeSelect></Field>
        <Field name="brand" label="Marca de interesse (opcional)" full><NativeSelect id="brand" name="brand" defaultValue={initialBrand}><option value="">Ainda não defini / mais de uma marca</option>{catalogBrands.map(brand => <option key={brand.slug} value={brand.name}>{brand.name}</option>)}</NativeSelect></Field>
        <Field name="demand" label="Descreva o que você precisa" error={errors.demand} full><Textarea {...fieldProps("demand")} rows={4} minLength={10} maxLength={1200} placeholder="Informe os produtos, as condições, o pedido ou a marca sobre a qual deseja conversar." /></Field>
      </fieldset>
      {Object.keys(errors).length > 0 && <p className="attendance-error-summary" role="alert">Confira os campos indicados antes de continuar.</p>}
      {saveError && <p className="attendance-error-summary" role="alert">{saveError}</p>}
      <p className="attendance-form-note">A ARCO salvará seu contato e sua demanda para atendimento. O CNPJ identifica sua empresa na mensagem. No WhatsApp, revise os dados e toque em enviar. A solicitação de acesso para comprar é feita no Mercos.</p>
      <Button type="submit" disabled={busy} className="attendance-submit">{busy ? "Salvando sua demanda…" : "Continuar no WhatsApp"}</Button>
      <noscript>Ative o JavaScript para preencher e enviar sua demanda.</noscript>
    </form>
    {prepared && <section className="attendance-prepared" aria-live="polite">
      <h2>Sua mensagem está pronta.</h2>
      <p>Seu contato e sua demanda foram salvos. Se o WhatsApp não abriu, use o botão abaixo e toque em enviar para iniciar a conversa.</p>
      <a className="attendance-reopen" href={attendanceWhatsappUrl(prepared)}>Abrir WhatsApp com a mensagem</a>
      <details><summary>Ver ou copiar a mensagem</summary><Textarea readOnly value={buildAttendanceMessage(prepared)} rows={12} aria-label="Mensagem preparada para o WhatsApp" onFocus={event => event.currentTarget.select()} /><Button type="button" variant="outline" onClick={async () => {
        try { await navigator.clipboard.writeText(buildAttendanceMessage(prepared)); setCopyStatus("Mensagem copiada."); }
        catch { setCopyStatus("Toque na mensagem para selecionar e copiar o texto."); }
      }}>Copiar mensagem</Button><p role="status">{copyStatus}</p></details>
    </section>}
  </>;
}

export function AttendanceForm() {
  const params = useSearchParams();
  const subject = resolveAttendanceSubject(params.get("assunto"));
  const requestedBrand = params.get("marca");
  const brand = catalogBrands.find(brand => brand.slug === requestedBrand || brand.name === requestedBrand)?.name ?? "";
  const segment = resolveAttendanceSegment(params.get("segmento"));
  return <FormFields key={`${subject}:${brand}:${segment}`} initialSubject={subject} initialBrand={brand} initialSegment={segment} />;
}
