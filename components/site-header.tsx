"use client";

import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, UserPlus, X } from "lucide-react";
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
import { arcoContact, whatsappUrl } from "@/lib/catalog-data";

const links = [
  { label: "Início", href: "/" },
  { label: "Quem somos", href: "/quem-somos" },
  { label: "Catálogos", href: "/catalogos" },
  { label: "Dúvidas", href: "/perguntas-frequentes" },
];

export function SiteHeader({ variant = "default" }: { variant?: "default" | "home" }) {
  const pathname = usePathname();
  const isHome = variant === "home";
  const { headerRef, compact } = useHeroHeader(isHome);
  return (
    <header
      ref={headerRef}
      className={`global-header${isHome ? " global-header--home" : ""}`}
      data-header-state={isHome ? (compact ? "compact" : "intro") : undefined}
    >
      <div className="page-shell global-header-inner">
        <a href="/" className="global-logo global-logo--signature" aria-label="ARCO — página inicial">
          <img src="/logo-arco-reverse.svg" alt="" width={640} height={640} />
        </a>

        <nav className="global-nav" aria-label="Navegação principal">
          {links.map((link) => (
            <a key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="global-actions">
          <Button asChild variant="outline" className="global-ecommerce">
            <a href={arcoContact.orderPlatformUrl} target="_blank" rel="noreferrer">
              <ShoppingBag />
              Comprar para sua loja
            </a>
          </Button>
          <Button asChild className="global-whatsapp">
            <a href={whatsappUrl()} target="_blank" rel="noreferrer">
              Falar com a ARCO
            </a>
          </Button>
        </div>

        <Sheet>
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
                  <img src="/logo-arco-reverse.svg" alt="ARCO" width={640} height={640} />
                </span>
              </SheetTitle>
              <SheetDescription>Marcas, catálogos e canais da ARCO.</SheetDescription>
            </SheetHeader>
            <nav className="global-mobile-nav" aria-label="Navegação móvel">
              {links.map((link) => (
                <SheetClose asChild key={link.href}>
                  <a href={link.href} aria-current={pathname === link.href ? "page" : undefined}>{link.label}</a>
                </SheetClose>
              ))}
            </nav>
            <SheetFooter>
              <p className="commerce-access-note">Acesso para clientes cadastrados</p>
              <Button asChild variant="outline" className="global-ecommerce w-full">
                <a href={arcoContact.orderPlatformUrl} target="_blank" rel="noreferrer">
                  <ShoppingBag />
                  Comprar para sua loja
                </a>
              </Button>
              <Button asChild variant="outline" className="global-registration w-full">
                <a href={arcoContact.registrationUrl} target="_blank" rel="noreferrer">
                  <UserPlus />
                  Solicitar cadastro
                </a>
              </Button>
              <Button asChild className="global-whatsapp w-full">
                <a href={whatsappUrl()} target="_blank" rel="noreferrer">
                  Falar com a ARCO
                </a>
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
