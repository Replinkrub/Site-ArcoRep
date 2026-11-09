"use client";

import { useRef, useState, type FormEvent } from "react";
import { Download, ExternalLink, X } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { arcoContact, type CatalogBrand } from "@/lib/catalog-data";
import { catalogInquiryMessage, catalogInquiryWhatsappUrl, type CatalogContact } from "@/lib/catalog-inquiry";
import { segments, states } from "@/lib/form-options";
import { forgetCatalogAccess, rememberCatalogAccess, type CatalogAccess } from "@/lib/catalog-access";
import { submitContact, contactSubmissionMessage } from "@/lib/contact-submission";

export default function CatalogAccessDialog({ brand, access: initialAccess, contact, initialSegment = "", onContactSaved, onClose, trigger }: {
  brand: CatalogBrand; access: CatalogAccess | null; contact: CatalogContact | null;
  initialSegment?: string;
  onContactSaved: (contact: CatalogContact | null) => void; onClose: () => void; trigger: HTMLButtonElement | null;
}) {
  const [step, setStep] = useState<"question" | "form" | "ready">(initialAccess ? "ready" : "question");
  const [access, setAccess] = useState(initialAccess);
  const [copyStatus, setCopyStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const requestId = useRef<string | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);

  function changeStep(next: typeof step) {
    setError("");
    setStep(next);
    // Focus after React commits the new dialog contents, without another render.
    requestAnimationFrame(() => next === "form" ? nameInput.current?.focus() : heading.current?.focus());
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    const phone = String(values.phone ?? "").replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "");
    if (!/^\d{10,11}$/.test(phone)) {
      setError("Confira o WhatsApp: informe o DDD e o número do telefone.");
      (form.elements.namedItem("phone") as HTMLElement | null)?.focus();
      return;
    }
    requestId.current ??= crypto.randomUUID();
    setBusy(true);
    setError("");
    try {
      const savedContact: CatalogContact = {
        name: String(values.name ?? "").trim(), phone,
        company: String(values.company ?? "").trim(), city: String(values.city ?? "").trim(),
        state: String(values.state ?? ""), segment: String(values.segment ?? ""), demand: String(values.demand ?? "").trim(),
      };
      await submitContact({ ...values, ...savedContact, id: requestId.current, source: "catalog", brand: brand.slug });
      onContactSaved(savedContact);
      setAccess("contact");
      rememberCatalogAccess("contact");
      changeStep("ready");
    } catch (failure) {
      setError(contactSubmissionMessage(failure));
    } finally { setBusy(false); }
  }

  return <Dialog open onOpenChange={open => { if (!open && !busy) onClose(); }}>
    <DialogContent className="catalog-access-dialog" showCloseButton={false}
      onOpenAutoFocus={event => { event.preventDefault(); heading.current?.focus(); }}
      onCloseAutoFocus={event => { event.preventDefault(); trigger?.focus(); }}
      onEscapeKeyDown={event => { if (busy) event.preventDefault(); }}
      onPointerDownOutside={event => { if (busy) event.preventDefault(); }}>
      <DialogClose className="catalog-dialog-close" disabled={busy} aria-label="Fechar catálogo"><X aria-hidden="true" /></DialogClose>
      <p className="section-eyebrow">{brand.name}</p>
      <DialogTitle ref={heading} tabIndex={-1} className="catalog-dialog-title">
        {step === "question" ? "Sua empresa já compra com a ARCO?" : step === "form" ? "Conheça as linhas para sua empresa." : brand.catalogs.length > 1 ? "Escolha seu catálogo." : "Seu catálogo está disponível."}
      </DialogTitle>
      <DialogDescription className="catalog-dialog-description">
        {step === "question" ? "Se já compra com a ARCO, acesse direto. Se está conhecendo os produtos, informe seus dados de contato e os da empresa para acessar o catálogo. Depois, você pode conversar com a ARCO pelo WhatsApp." : step === "form" ? "Informe seu nome, WhatsApp e os dados da empresa para acessar o catálogo. O CNPJ não é necessário nesta etapa." : "Visualize ou baixe o PDF. Antes de fechar a compra, confirme preços, disponibilidade e condições com a ARCO."}
      </DialogDescription>

      {step === "question" && <div className="catalog-access-choices">
        <Button type="button" onClick={() => { setAccess("client"); onContactSaved(null); rememberCatalogAccess("client"); changeStep("ready"); }}>Sim, já sou cliente</Button>
        <Button type="button" variant="outline" onClick={() => changeStep("form")}>Ainda não, quero conhecer os produtos</Button>
        <p className="catalog-dialog-note">Sua resposta será lembrada neste navegador para os próximos catálogos.</p>
      </div>}

      {step === "form" && <form className="catalog-lead-form" aria-busy={busy} onSubmit={submit} onChange={() => { requestId.current = null; setError(""); }}>
        <fieldset disabled={busy} className="catalog-lead-fields">
          <div><label htmlFor="catalog-name">Seu nome</label><Input ref={nameInput} id="catalog-name" name="name" required minLength={2} maxLength={80} autoComplete="name" /></div>
          <div><label htmlFor="catalog-phone">WhatsApp com DDD</label><Input id="catalog-phone" name="phone" required type="tel" inputMode="tel" minLength={10} maxLength={22} autoComplete="tel" placeholder="(81) 99999-9999" /></div>
          <div className="catalog-lead-field--full"><label htmlFor="catalog-company">Nome da empresa</label><Input id="catalog-company" name="company" required minLength={2} maxLength={120} autoComplete="organization" /></div>
          <div><label htmlFor="catalog-city">Cidade</label><Input id="catalog-city" name="city" required minLength={2} maxLength={80} autoComplete="address-level2" /></div>
          <div><label htmlFor="catalog-state">Estado</label><NativeSelect id="catalog-state" name="state" defaultValue="PE" autoComplete="address-level1" required>{states.map(state => <option key={state} value={state}>{state}</option>)}</NativeSelect></div>
          <div className="catalog-lead-field--full"><label htmlFor="catalog-segment">Tipo de empresa</label><NativeSelect id="catalog-segment" name="segment" required defaultValue={initialSegment}><option value="" disabled>Selecione</option>{segments.map(segment => <option key={segment} value={segment}>{segment}</option>)}</NativeSelect></div>
          <div className="catalog-lead-field--full"><label htmlFor="catalog-brand">Marca de interesse</label><Input id="catalog-brand" value={brand.name} readOnly /></div>
          <div className="catalog-lead-field--full"><label htmlFor="catalog-demand">O que você procura? <span>(opcional)</span></label><Textarea id="catalog-demand" name="demand" rows={2} maxLength={1200} placeholder="Primeiro mix, reposição ou produtos de interesse…" /></div>
          <div className="catalog-form-trap" aria-hidden="true"><label htmlFor="catalog-website">Website</label><input id="catalog-website" name="website" tabIndex={-1} autoComplete="off" /></div>
        </fieldset>
        <p className="catalog-dialog-note">A ARCO usará estes dados para atender seu interesse nos produtos. Este contato não substitui o cadastro de compra no Mercos.</p>
        {error && <p className="catalog-form-error" role="alert">{error}</p>}
        <Button type="submit" disabled={busy} className="catalog-access-submit">{busy ? "Salvando contato…" : "Acessar catálogo"}</Button>
        <button className="catalog-dialog-text-button" type="button" disabled={busy} onClick={() => changeStep("question")}>Voltar</button>
      </form>}

      {step === "ready" && <div className="catalog-ready">
        {contact && access === "contact" && <div className="catalog-contact-confirmation" role="status"><strong>Seu contato foi salvo.</strong><p>Para conversar sobre produtos e condições, abra o WhatsApp e envie a mensagem preparada com seus dados e a marca de interesse.</p></div>}
        <div className="catalog-ready-files">{brand.catalogs.map(catalog => <div className="catalog-ready-file" key={catalog.title}>
          <h3>{catalog.title}</h3><p>PDF{catalog.fileSize ? ` · ${catalog.fileSize}` : ""}</p>
          <div><a className={buttonVariants()} href={catalog.href} target="_blank" rel="noopener noreferrer">Visualizar PDF <ExternalLink aria-hidden="true" /></a>
          <a className={buttonVariants({ variant: "outline" })} href={catalog.href} download>Baixar PDF <Download aria-hidden="true" /></a></div>
        </div>)}</div>
        <div className="catalog-ready-commerce">
          {access === "client" ? <>
            <a className="catalog-ready-primary" href={arcoContact.orderPlatformUrl} target="_blank" rel="noopener noreferrer">Já tenho acesso: fazer pedido</a>
            <a href={catalogInquiryWhatsappUrl(brand)}>Conversar sobre esta marca</a>
          </> : <>
            <a className="catalog-ready-primary" href={catalogInquiryWhatsappUrl(brand, contact)}>Conversar sobre esta marca no WhatsApp</a>
            <a href={arcoContact.registrationUrl} target="_blank" rel="noopener noreferrer">Solicitar acesso para comprar</a>
            <a href={arcoContact.orderPlatformUrl} target="_blank" rel="noopener noreferrer">Já tenho acesso: fazer pedido</a>
          </>}
          <p className="catalog-dialog-note">No WhatsApp, revise a mensagem e toque em enviar para iniciar a conversa.</p>
        </div>
        <details className="catalog-inquiry-preview"><summary>Ver ou copiar a mensagem</summary><Textarea readOnly value={catalogInquiryMessage(brand, access === "contact" ? contact : null)} rows={8} aria-label="Mensagem preparada para o WhatsApp" onFocus={event => event.currentTarget.select()} /><Button type="button" variant="outline" onClick={async () => {
          try { await navigator.clipboard.writeText(catalogInquiryMessage(brand, access === "contact" ? contact : null)); setCopyStatus("Mensagem copiada."); }
          catch { setCopyStatus("Toque na mensagem para selecionar e copiar o texto."); }
        }}>Copiar mensagem</Button><p role="status">{copyStatus}</p></details>
        <button type="button" className="catalog-dialog-text-button" onClick={() => { forgetCatalogAccess(); setAccess(null); onContactSaved(null); setCopyStatus(""); changeStep("question"); }}>Alterar minha resposta</button>
      </div>}
    </DialogContent>
  </Dialog>;
}
