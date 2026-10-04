import { ExternalLink, MessageCircle } from "lucide-react";
import { arcoContact, whatsappUrl } from "@/lib/catalog-data";

export function SiteFooter() {
  return (
    <footer className="global-footer">
      <div className="page-shell global-footer-grid">
        <div>
          <a href="/" className="global-logo global-logo--footer" aria-label="ARCO">
            <img src="/logo-arco-reverse.svg" alt="" width={640} height={640} />
          </a>
          <p>
            Desde 2018, conectando indústrias ao varejo alimentar de Pernambuco.
          </p>
        </div>
        <div>
          <strong>Navegue</strong>
          <a href="/quem-somos">Quem somos</a>
          <a href="/catalogos">Catálogos</a>
          <a href="/perguntas-frequentes">Dúvidas</a>
        </div>
        <div>
          <strong>Canais</strong>
          <a className="footer-contact-link" href={whatsappUrl()} target="_blank" rel="noreferrer" aria-label="WhatsApp da ARCO: (81) 99831-0980">
            <MessageCircle aria-hidden="true" /> <span>WhatsApp <b>(81) 99831-0980</b></span>
          </a>
          <a className="footer-contact-link" href={arcoContact.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram da ARCO: arroba arco ponto rep">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.6" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            <span>Instagram <b>@arco.rep</b></span>
          </a>
          <a href={arcoContact.orderPlatformUrl} target="_blank" rel="noreferrer">
            Comprar para sua loja <ExternalLink />
          </a>
          <a href={arcoContact.registrationUrl} target="_blank" rel="noreferrer">
            Solicitar cadastro <ExternalLink />
          </a>
        </div>
      </div>
      <div className="page-shell global-footer-bottom">
        <span>© 2026 ARCO.</span>
        <span className="footer-credit">Desenvolvido por <span className="footer-credit-brand"><img src="/replink-owl.png" alt="" width={27} height={27} /> replink</span></span>
        <span>Pernambuco</span>
      </div>
    </footer>
  );
}
