"use client";

import SiteImage from "@/components/site-image";

import Link from "@/components/site-link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { BookOpen, Menu, ShoppingBag, UserPlus, X } from "lucide-react";
import { useHeroHeader } from "@/components/home/use-hero-header";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { arcoContact } from "@/lib/catalog-data";
import { attendanceUrl } from "@/lib/attendance";

const links = [
  { label: "Catálogos", href: "/catalogos" },
  { label: "Representadas", href: "/representadas" },
  { label: "Para sua loja", href: "/#mercados" },
  { label: "A ARCO", href: "/quem-somos" },
  { label: "Calculadora de preço", href: "/calculadora" },
  { label: "Atendimento", href: "/atendimento" },
];

export function SiteHeader({ variant = "default" }: { variant?: "default" | "home" }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = variant === "home";
  const { headerRef, compact } = useHeroHeader(isHome);
  return (
    <header
      ref={headerRef}
      className={`global-header${isHome ? " global-header--home" : ""}`}
      data-header-state={isHome ? (compact ? "compact" : "intro") : undefined}
    >
      <div className="page-shell global-header-inner">
        <Link prefetch={true} href="/" className="global-logo global-logo--signature" aria-label="ARCO — página inicial">
          <SiteImage src="/logo-arco-reverse.svg" alt="" width={640} height={640} />
        </Link>

        <nav className="global-nav" aria-label="Navegação principal">
          {links.map((link) => (
            <Link prefetch={true} key={link.href} href={link.href} aria-label={link.label} title={link.label} aria-current={pathname === link.href ? "page" : undefined}>
              {link.href === "/calculadora" ? "Calculadora" : link.label}
            </Link>
          ))}
        </nav>

        <div className="global-actions">
          <Button asChild className="global-whatsapp">
            <Link href="/catalogos"><BookOpen /> Ver catálogos</Link>
          </Button>
          <Button asChild variant="outline" className="global-ecommerce">
            <a href={arcoContact.orderPlatformUrl} target="_blank" rel="noopener noreferrer" aria-label="Já tenho acesso: fazer pedido no Mercos" title="Para clientes com acesso liberado no Mercos">Fazer pedido</a>
          </Button>
        </div>

        {isHome && <Link className="global-mobile-catalog" href="/catalogos">Catálogos</Link>}

        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="global-menu-button"
              aria-label="Abrir menu"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent
            className={`global-mobile-sheet${isHome ? " global-mobile-sheet--home" : ""}`}
            showCloseButton={false}
          >
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="home-menu-close" aria-label="Fechar menu"><X /></Button>
            </SheetClose>
            <SheetHeader className="global-mobile-sheet-header">
              <SheetTitle>
                <span className="global-logo global-logo--signature" aria-label="ARCO">
                  <SiteImage src="/logo-arco-reverse.svg" alt="ARCO" width={640} height={640} />
                </span>
              </SheetTitle>
              <SheetDescription>Produtos, acesso para pedidos e atendimento para sua loja.</SheetDescription>
            </SheetHeader>
            <nav className="global-mobile-nav" aria-label="Navegação móvel">
              {links.map((link) => (
                <Link key={link.href} prefetch={true} href={link.href} onClick={() => setMenuOpen(false)} aria-current={pathname === link.href ? "page" : undefined}>{link.label}</Link>
              ))}
            </nav>
            <SheetFooter>
              <p className="commerce-access-note">Conheça as marcas. Já tem acesso liberado? Faça seu pedido no Mercos.</p>
              <Button asChild className="global-whatsapp w-full">
                <Link href="/catalogos" onClick={() => setMenuOpen(false)}><BookOpen /> Conhecer produtos e marcas</Link>
              </Button>
              <Button asChild variant="outline" className="global-registration w-full">
                <a href={arcoContact.orderPlatformUrl} target="_blank" rel="noreferrer"><ShoppingBag /> Já tenho acesso: fazer pedido</a>
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <a href={arcoContact.registrationUrl} target="_blank" rel="noreferrer">
                  <UserPlus />
                  Solicitar acesso para comprar
                </a>
              </Button>
              <Link prefetch={true} className="global-mobile-attendance" href={attendanceUrl()} onClick={() => setMenuOpen(false)}>Solicitar atendimento</Link>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
