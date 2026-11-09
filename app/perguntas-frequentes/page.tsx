import type { Metadata } from "next";
import Link from "@/components/site-link";
import { ArrowRight, MessageCircle } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { arcoContact, catalogFaq } from "@/lib/catalog-data";
import { attendanceUrl } from "@/lib/attendance";

export const metadata: Metadata = {
  title: "Perguntas frequentes | ARCO Representações",
  description: "Respostas sobre catálogos, cadastro, pedidos e atendimento comercial da ARCO em Pernambuco.",
};

const answerLinks: Record<string, { href: string; label: string }[]> = {
  "Como faço meu primeiro pedido?": [
    { href: attendanceUrl("mix"), label: "Orientação para o primeiro pedido" },
    { href: arcoContact.registrationUrl, label: "Solicitar acesso para comprar" },
  ],
  "Onde vejo preços e faço pedidos?": [{ href: arcoContact.orderPlatformUrl, label: "Já tenho acesso: fazer pedido" }],
  "Como recebo o catálogo de uma marca?": [{ href: "/catalogos", label: "Ver catálogos" }],
  "Os catálogos têm preço?": [{ href: attendanceUrl("condicoes"), label: "Consultar preços e condições" }],
  "Qual é o pedido mínimo?": [{ href: attendanceUrl("condicoes"), label: "Consultar condições" }],
  "Como funcionam frete, pagamento e prazo de entrega?": [{ href: attendanceUrl("condicoes"), label: "Consultar condições" }],
  "Sou da indústria. Como proponho uma representação?": [{ href: attendanceUrl("industria"), label: "Conversar sobre representação" }],
};

const questions = [
  {
    title: "Pedidos e cadastro",
    items: [
      {
        question: "Preciso de CNPJ para comprar?",
        answer: "Sim. Atendemos empresas com CNPJ, para revenda ou uso na operação. Trabalhamos com supermercados, açougues, empórios e lojas especializadas.",
      },
      {
        question: "Como faço meu primeiro pedido?",
        answer: "Conheça as linhas nos catálogos ou fale com a ARCO para escolher os produtos e conferir condições. Para comprar no Mercos, solicite o acesso da empresa. Após a liberação, consulte preços e envie o pedido.",
      },
      {
        question: "Onde vejo preços e faço pedidos?",
        answer: "No Mercos, para clientes com acesso liberado. Fale com a ARCO para confirmar as marcas disponíveis para sua empresa, conferir condições e receber apoio na montagem do pedido.",
      },
      {
        question: "Qual é o pedido mínimo?",
        answer: "Cada representada tem suas condições. Informe a marca que deseja comprar para confirmarmos o mínimo antes de você montar o pedido.",
      },
      {
        question: "Como funcionam frete, pagamento e prazo de entrega?",
        answer: "As condições variam conforme a representada, o valor do pedido e o destino. Informe a marca e a cidade da loja para consultar frete, formas de pagamento e prazo antes de fechar a compra.",
      },
    ],
  },
  {
    title: "Portfólio e atendimento",
    items: [
      ...catalogFaq.filter(({ question }) => question === "Como recebo o catálogo de uma marca?" || question === "Os catálogos têm preço?"),
      {
        question: "A ARCO ajuda a montar o mix da loja?",
        answer: "Sim. Conte o tipo de loja, o público, o espaço disponível e as linhas que já vende. A partir disso, orientamos a escolha para o primeiro pedido, a reposição ou a ampliação do mix.",
      },
      {
        question: "O atendimento continua depois do pedido?",
        answer: "Sim. Acompanhamos seu histórico de pedidos para orientar reposições e ajustes de mix. Também orientamos a exposição dos produtos e acompanhamos demandas comerciais após a venda.",
      },
      {
        question: "Em que região a ARCO atua?",
        answer: "Nossa base e foco comercial estão em Pernambuco. Informe a cidade da loja e as marcas de interesse para confirmarmos o atendimento.",
      },
      {
        question: "Sou da indústria. Como proponho uma representação?",
        answer: "Fale com a ARCO e apresente seu portfólio, as condições comerciais e a região que pretende atender. Vamos avaliar a aderência das linhas ao varejo de Pernambuco e as possibilidades de representação.",
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
            <p>Como comprar, solicitar acesso e consultar as condições de cada representada.</p>
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
                      {answerLinks[item.question]?.map(link => <Link key={link.href} prefetch={link.href.startsWith("/")} className="faq-answer-link" href={link.href} target={link.href.startsWith("/") ? undefined : "_blank"} rel="noreferrer">{link.label} <ArrowRight aria-hidden="true" /></Link>)}
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
              <span className="faq-contact-description">Informe a marca e a cidade da loja para receber orientação.</span>
            </div>
            <div className="faq-contact-actions">
              <Link prefetch={true} className={buttonVariants({ className: "faq-whatsapp-button" })} href={attendanceUrl()}><MessageCircle aria-hidden="true" /> Solicitar atendimento</Link>
              <a className="faq-registration-link" href={arcoContact.registrationUrl} target="_blank" rel="noreferrer">Solicitar acesso para comprar <ArrowRight aria-hidden="true" /></a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
