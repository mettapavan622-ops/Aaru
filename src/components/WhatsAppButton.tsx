import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  customMessage?: string;
  className?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ 
  customMessage = "Hello AARU Atelier, I would like to inquire about your curated luxury weaves and bespoke services.",
  className = ""
}) => {
  const encodedMessage = encodeURIComponent(customMessage);
  const whatsappUrl = `https://wa.me/919876543210?text=${encodedMessage}`;

  return (
    <a
      id="aaru-whatsapp-floating-btn"
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Connect with AARU Atelier on WhatsApp"
      className={`fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-[#0F4C5C] hover:bg-[#0b3844] text-[#FAF7F2] rounded-full shadow-xl transition-all duration-300 hover:scale-105 border border-[#9C7C38]/30 group ${className}`}
    >
      <div className="relative">
        <MessageCircle className="w-5 h-5 text-[#FAF7F2]" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
      </div>
      <div className="text-left hidden sm:block">
        <p className="text-[11px] font-medium tracking-wider uppercase text-[#D4C7B5]">Atelier Concierge</p>
        <p className="text-xs font-semibold tracking-wide">Chat with Stylist</p>
      </div>
    </a>
  );
};
