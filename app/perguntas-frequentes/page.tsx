import type { Metadata } from "next";
import { ArrowRight, MessageCircle } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { arcoContact, catalogFaq, whatsappUrl } from "@/lib/catalog-data";

export const metadata: Metadata = {
  title: "Perguntas frequentes | ARCO Representações",
  description: "Respostas sobre catálogos, cadastro, pedidos e atendimento comercial da ARCO em Pernambuco.",
};

const answerLinks: Record<string, { href: string; label: string }> = {
  "Como faço meu primeiro pedido?": { href: arcoContact.registrationUrl, label: "Solicitar cadastro" },
  "Onde vejo preços e faço pedidos?": { href: arcoContact.orderPlatformUrl, label: "Comprar para sua loja" },
  "Como recebo o catálogo de uma marca?": { href: "/catalogos", label: "Ver catálogos" },
  "Os catálogos têm preço?": { href: arcoContact.orderPlatformUrl, label: "Consultar no Mercos" },
  "Qual é o pedido mínimo?": { href: whatsappUrl("Olá, Antonio. Quero consultar o pedido mínimo e as condições de uma representada."), label: "Consultar condições" },
  "Representam marcas interessadas no varejo de Pernambuco?": { href: whatsappUrl("Olá, Antonio. Sou de uma indústria e quero conversar sobre representação em Pernambuco."), label: "Conversar sobre representação" },
};

const questions = [
  {
    title: "Pedidos e cadastro",
    items: [
      {
        question: "Preciso de CNPJ para comprar?",
        answer: "Sim. Nosso atendimento comercial é voltado a empresas com CNPJ, como supermercados, açougues, empórios e lojas especializadas.",
      },
      {
        question: "Como faço meu primeiro pedido?",
        answer: "Solicite o cadastro da empresa. Com o acesso liberado, você pode comprar pelo Mercos ou contar com a equipe comercial para montar o primeiro pedido.",
      },
      {
        question: "Onde vejo preços e faço pedidos?",
        answer: "Clientes cadastrados podem acessar o Mercos, nossa plataforma de pedidos para as marcas representadas. Nossa equipe também pode orientar a escolha dos produtos e a montagem do pedido.",
      },
      {
        question: "Qual é o pedido mínimo?",
        answer: "O pedido mínimo depende da representada e das condições comerciais da marca. Consulte a ARCO antes de fechar seu pedido.",
      },
      {
        question: "Como funcionam frete, pagamento e prazo de entrega?",
        answer: "Essas condições variam conforme a marca, o pedido e o destino. Confirmamos as informações para o seu caso durante o atendimento comercial.",
      },
    ],
  },
  {
    title: "Portfólio e atendimento",
    items: [
      ...catalogFaq.filter(({ question }) => question === "Como recebo o catálogo de uma marca?" || question === "Os catálogos têm preço?"),
      {
        question: "A ARCO ajuda a montar o mix da loja?",
        answer: "Sim. Consideramos o perfil da loja, o espaço disponível, o público e o potencial de giro para indicar uma combinação de produtos adequada à operação.",
      },
      {
        question: "O atendimento continua depois do pedido?",
        answer: "Sim. Acompanhamos a presença dos produtos na loja e ajudamos a planejar reposições e ajustes de mix.",
      },
      {
        question: "Em que região a ARCO atua?",
        answer: "Nossa base e foco comercial estão em Pernambuco. Fale com a equipe para confirmar o atendimento da sua loja.",
      },
      {
        question: "Representam marcas interessadas no varejo de Pernambuco?",
        answer: "Sim. Se você é da indústria, entre em contato para conversarmos sobre portfólio, mercado e possibilidades de representação.",
      },
    ],
  },
];

export default function PerguntasFrequentesPage() {
  return (
    <>
      <SiteHeader />
      <main className="faq-page">
        <section className="faq-hero">
          <div className="page-shell">
            <p className="section-eyebrow">Atendimento ARCO</p>
            <h1>Perguntas frequentes</h1>
            <p>Informações para comprar com clareza, conhecer as representadas e falar com a equipe.</p>
          </div>
        </section>
        <div className="page-shell faq-content">
          {questions.map((group) => (
            <section className="faq-group" key={group.title} aria-labelledby={`faq-${group.title.toLowerCase().replaceAll(" ", "-")}`}>
              <div className="faq-group-heading">
                <h2 id={`faq-${group.title.toLowerCase().replaceAll(" ", "-")}`}>{group.title}</h2>
              </div>
              <Accordion type="single" collapsible className="catalog-faq-list">
                {group.items.map((item) => (
                  <AccordionItem key={item.question} value={item.question}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>
                      {item.answer}
                      {answerLinks[item.question] && <a className="faq-answer-link" href={answerLinks[item.question].href} target={answerLinks[item.question].href.startsWith("/") ? undefined : "_blank"} rel="noreferrer">{answerLinks[item.question].label} <ArrowRight aria-hidden="true" /></a>}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>
        <section className="faq-contact">
          <div className="page-shell faq-contact-inner">
            <div>
              <p>Atendimento comercial</p>
              <h2>Ainda tem alguma dúvida?</h2>
              <span className="faq-contact-description">Nossa equipe ajuda com catálogos, cadastro e pedidos.</span>
            </div>
            <div className="faq-contact-actions">
              <Button asChild className="faq-whatsapp-button">
                <a href={whatsappUrl("Olá, Antonio. Tenho uma dúvida sobre o atendimento da ARCO.")} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> Falar pelo WhatsApp</a>
              </Button>
              <a className="faq-registration-link" href={arcoContact.registrationUrl} target="_blank" rel="noreferrer">Ainda não é cliente? Solicitar cadastro <ArrowRight aria-hidden="true" /></a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
