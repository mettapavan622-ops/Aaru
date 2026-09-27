import React from 'react';

interface WhatsAppButtonProps {
  customMessage?: string;
  className?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ 
  customMessage = "Hello AARU, I would like to inquire about your curated luxury weaves and custom services.",
  className = ""
}) => {
  const encodedMessage = encodeURIComponent(customMessage);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=919346066170&text=${encodedMessage}`;

  return (
    <a
      id="aaru-whatsapp-floating-btn"
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with AARU on WhatsApp: +91 93460 66170"
      title="Chat with AARU on WhatsApp (+91 93460 66170)"
      className={`fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center border-2 border-white/80 group cursor-pointer ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {/* Authentic WhatsApp Icon */}
        <svg 
          className="w-7 h-7 fill-current transition-transform group-hover:scale-105" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.301-.15-1.782-.879-2.058-.979-.276-.1-.477-.15-.678.15-.201.3-.777.979-.953 1.18-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.786-1.677-2.087-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.201-.301.301-.502.101-.201.05-.376-.025-.526-.075-.15-.678-1.634-.929-2.238-.244-.589-.493-.509-.678-.518-.176-.009-.377-.01-.578-.01-.201 0-.527.075-.803.376-.276.301-1.054 1.03-1.054 2.512 0 1.482 1.079 2.912 1.23 3.113.15.2 2.123 3.242 5.143 4.546.719.311 1.28.497 1.718.636.723.23 1.381.198 1.901.12.58-.087 1.782-.728 2.033-1.431.251-.703.251-1.306.176-1.431-.076-.125-.276-.201-.577-.351zM12.04 21.785c-1.75 0-3.465-.47-4.97-1.362l-.356-.211-3.699.97.987-3.606-.232-.369a9.782 9.782 0 0 1-1.5-5.176c0-5.418 4.408-9.826 9.83-9.826 2.627 0 5.097 1.024 6.956 2.883a9.774 9.774 0 0 1 2.879 6.945c0 5.419-4.408 9.827-9.83 9.827zM12.04 0C5.401 0 0 5.402 0 12.04c0 2.122.553 4.195 1.604 6.015L0 24l6.136-1.609a12.016 12.016 0 0 0 5.904 1.545h.005c6.639 0 12.04-5.402 12.04-12.04 0-3.217-1.253-6.241-3.528-8.516C18.282 1.253 15.257 0 12.04 0z" />
        </svg>
        {/* Subtle Online Availability Pulse Indicator */}
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
          <span className="w-2 h-2 bg-emerald-600 rounded-full" />
        </span>
      </div>
    </a>
  );
};
