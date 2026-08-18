import { MessageCircle } from "lucide-react";
import { Facebook } from "lucide-react";
import { whatsappLink, FACEBOOK_URL } from "@/lib/whatsapp";

export const WhatsAppFloat = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Facebook */}
      <a
        href={FACEBOOK_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Acessar Facebook"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-2xl transition-smooth hover:scale-110"
      >
        <Facebook className="h-7 w-7" fill="currentColor" />
        <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 hidden md:block whitespace-nowrap rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground opacity-0 group-hover:opacity-100 transition-smooth">
          Facebook
        </span>
      </a>

      {/* WhatsApp */}
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="group relative"
      >
        <span className="absolute inset-0 rounded-full bg-whatsapp animate-pulse-slow opacity-60" />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-2xl transition-smooth group-hover:scale-110">
          <MessageCircle className="h-7 w-7" fill="currentColor" />
        </span>
        <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 hidden md:block whitespace-nowrap rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground opacity-0 group-hover:opacity-100 transition-smooth">
          Fale conosco
        </span>
      </a>
    </div>
  );
};
