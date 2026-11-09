
import SiteImage from "@/components/site-image";
import Link from "@/components/site-link";
import { ExternalLink, MessageCircle } from "lucide-react";
import { arcoContact } from "@/lib/catalog-data";
import { attendanceUrl } from "@/lib/attendance";

export function SiteFooter() {
  return (
    <footer className="global-footer">
      <div className="page-shell global-footer-grid">
        <div>
          <Link prefetch={true} href="/" className="global-logo global-logo--footer" aria-label="ARCO">
            <SiteImage src="/logo-arco-reverse.svg" alt="" width={640} height={640} />
          </Link>
          <p>
            Desde 2018 no varejo de Pernambuco. Especialistas na seção churrasco.
          </p>
        </div>
        <div>
          <strong>Navegue</strong>
          <Link prefetch={true} href="/quem-somos">Quem somos</Link>
          <Link prefetch={true} href="/catalogos">Catálogos</Link>
          <Link prefetch={true} href="/representadas">Representadas</Link>
          <Link prefetch={true} href="/#mercados">Para sua loja</Link>
          <Link prefetch={true} href="/calculadora">Calculadora de preço</Link>
          <Link prefetch={true} href="/perguntas-frequentes">Dúvidas</Link>
        </div>
        <div>
          <strong>Canais</strong>
          <Link prefetch={true} className="footer-contact-link" href={attendanceUrl()} aria-label="Solicitar atendimento comercial da ARCO">
            <MessageCircle aria-hidden="true" /> <span>Solicitar atendimento <b>(81) 99831-0980</b><small className="block">Preencha os dados e continue no WhatsApp.</small></span>
          </Link>
          <a className="footer-contact-link" href={arcoContact.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram da ARCO: arroba arco ponto rep">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.6" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            <span>Instagram <b>@arco.rep</b></span>
          </a>
          <a href={arcoContact.orderPlatformUrl} target="_blank" rel="noreferrer">
            Já tenho acesso: fazer pedido <ExternalLink />
          </a>
          <a href={arcoContact.registrationUrl} target="_blank" rel="noreferrer">
            Solicitar acesso para comprar <ExternalLink />
          </a>
        </div>
      </div>
      <div className="page-shell global-footer-bottom">
        <span>© 2026 ARCO.</span>
        <span className="footer-credit">Desenvolvido por <span className="footer-credit-brand"><SiteImage src="/replink-owl.webp" alt="" width={27} height={27} /> replink</span></span>
        <span>Pernambuco</span>
      </div>
    </footer>
  );
}
