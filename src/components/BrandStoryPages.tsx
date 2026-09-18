import React, { useState } from 'react';
import { FAQS } from '../data/mockData';
import { AaruLogo } from './AaruLogo';
import { 
  ChevronDown, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  MessageCircle, 
  CheckCircle,
  Shield, 
  Award, 
  Sparkles 
} from 'lucide-react';

export const AboutAaruSection: React.FC<{ onExploreClick?: () => void }> = ({ onExploreClick }) => {
  return (
    <section id="about-aaru" className="py-20 lg:py-28 bg-[#F5EFE6] border-t border-[#E8DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-sans font-medium uppercase tracking-[0.25em] text-[#8C6D37]">
              Our Heritage & Maison
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#0F4C5C] leading-tight">
              About AARU
            </h2>
            <p className="font-serif text-xl italic text-[#24211E]">
              "A symphony of sacred weaves, maternal protection, and intuitive modern fashion."
            </p>
            <div className="space-y-4 text-xs sm:text-sm text-[#5C5549] font-light leading-relaxed">
              <p>
                Founded on the belief that a woman’s wardrobe is her sanctum, AARU bridges centuries of handloom virtuosity with clean contemporary luxury. Every drape originates from master weavers in Varanasi, Kanchipuram, and Chanderi who have inherited their loom patterns over generations.
              </p>
              <p>
                Under the creative vision of founder Moni, AARU reimagines the saree and ceremonial attire not as museum artifacts, but as living, breathing companions of power and grace.
              </p>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-4 border-t border-[#D4C7B5]">
              <div className="flex items-start gap-2.5">
                <Award className="w-5 h-5 text-[#9C7C38] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#24211E]">100% Certified</h4>
                  <p className="text-[11px] text-[#736B5E]">Authentic Silk Mark & Handloom marks</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Shield className="w-5 h-5 text-[#0F4C5C] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#24211E]">Fair Artisan Wages</h4>
                  <p className="text-[11px] text-[#736B5E]">Direct-from-loom sustainable trade</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85"
                alt="Banarasi Weaving Loom"
                className="w-full aspect-[4/5] object-cover shadow-md"
              />
              <div className="p-4 bg-white border border-[#E8DFD5]">
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#9C7C38]">Varanasi Workshop</p>
                <p className="font-serif text-sm font-semibold text-[#24211E]">Kadwa Brocade Handlooms</p>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="p-4 bg-[#0F4C5C] text-white">
                <Sparkles className="w-4 h-4 text-[#D4C7B5] mb-2" />
                <p className="font-serif text-lg font-bold">The Sixth Element</p>
                <p className="text-[11px] text-[#FAF7F2]/80 font-light mt-1">
                  Transforming fabric into an invisible force of softness and sovereign confidence.
                </p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=85"
                alt="Kanjeevaram Silk Craft"
                className="w-full aspect-[4/5] object-cover shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faqs" className="py-20 bg-[#FAF7F2] border-t border-[#E8DFD5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-sans font-medium uppercase tracking-[0.25em] text-[#8C6D37]">
            Concierge & Inquiries
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F4C5C]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#736B5E] font-light">
            Answers regarding our handloom fabrics, custom tailoring, shipping dispatch, and payment security.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={faq.question}
                className="bg-white border border-[#E8DFD5] transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-serif text-base font-semibold text-[#24211E]">
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-[#0F4C5C] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#5C5549] leading-relaxed font-light border-t border-[#E8DFD5]/50">
                    <p>{faq.answer}</p>
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-[#0F4C5C] font-medium">
                      <span>Category: {faq.category}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const ContactSection: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', phone: '', inquiry: '' });
  const [sent, setSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const whatsappInquiryUrl = `https://wa.me/919346066170?text=${encodeURIComponent(
    `Hello AARU Studio, My name is ${formState.name || 'Client'}. Inquiry: ${formState.inquiry || 'I would like to consult with a stylist.'}`
  )}`;

  return (
    <section id="contact-us" className="py-20 lg:py-24 bg-[#F5EFE6] border-t border-[#E8DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Studio Details */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-sans font-medium uppercase tracking-[0.25em] text-[#8C6D37]">
              Studio & Salon
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F4C5C]">
              Connect with AARU
            </h2>
            <p className="text-xs sm:text-sm text-[#5C5549] font-light leading-relaxed">
              Whether you wish to schedule a private drape consultation at our salon or seek styling guidance for an upcoming wedding, our customer care specialists are at your service.
            </p>

            <div className="space-y-4 pt-4 text-xs text-[#24211E]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#0F4C5C] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">AARU Flagship Studio & Salon</p>
                  <p className="text-[#736B5E]">74 Lavelle Road, Richmond Town, Bengaluru, Karnataka 560001</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#0F4C5C] shrink-0" />
                <div>
                  <p className="font-semibold">+91 (80) 4122 8900 / +91 93460 66170</p>
                  <p className="text-[#736B5E]">Direct customer care line</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#0F4C5C] shrink-0" />
                <div>
                  <p className="font-semibold">concierge@aaru.luxury</p>
                  <p className="text-[#736B5E]">Replies within 4 business hours</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#0F4C5C] shrink-0" />
                <div>
                  <p className="font-semibold">Monday – Saturday: 10:30 AM – 7:30 PM IST</p>
                  <p className="text-[#736B5E]">Sunday: By prior private appointment</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Start Instant WhatsApp Chat
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 border border-[#E8DFD5] shadow-lg">
            {sent ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle className="w-12 h-12 text-[#2D5A46] mx-auto" />
                <h3 className="font-serif text-2xl font-bold text-[#0F4C5C]">Inquiry Received</h3>
                <p className="text-xs text-[#736B5E]">
                  Thank you for reaching out to AARU. Our customer care specialist will respond to {formState.email} shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="px-4 py-2 border border-[#0F4C5C] text-xs font-semibold uppercase tracking-wider text-[#0F4C5C]"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-[#24211E]">Send an Inquiry</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-[#736B5E] mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="e.g. Radhika Menon"
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#736B5E] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="e.g. radhika@example.com"
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#736B5E] mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    placeholder="+91 93460 66170"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#736B5E] mb-1">Inquiry Details *</label>
                  <textarea
                    rows={4}
                    required
                    value={formState.inquiry}
                    onChange={(e) => setFormState({ ...formState, inquiry: e.target.value })}
                    placeholder="Tell us about the drape or occasion you have in mind..."
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Footer: React.FC<{
  setActiveTab?: (tab: string) => void;
  onOpenOrders?: () => void;
  onToggleMode?: (mode: 'user' | 'admin') => void;
  onNavigate?: (view: string) => void;
}> = ({ setActiveTab, onOpenOrders, onToggleMode, onNavigate }) => {
  const handleNav = (tab: string) => {
    if (onNavigate) {
      onNavigate(tab);
    } else if (setActiveTab) {
      setActiveTab(tab);
    }
  };

  const handleOpenOrders = () => {
    if (onOpenOrders) onOpenOrders();
    else handleNav('orders');
  };

  const handleSwitchAdmin = () => {
    if (onToggleMode) onToggleMode('admin');
  };

  return (
    <footer className="bg-[#121212] text-[#FAF7F2] border-t border-[#262626] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-[#262626]">
          {/* Col 1: Brand & Manifesto - Generous 4 cols on desktop */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4 pr-0 lg:pr-4">
            <AaruLogo size="md" variant="dark" />
            <p className="text-xs text-[#C4B7A5] font-light leading-relaxed max-w-sm">
              A luxury women’s fashion and textile house. Designed around the sixth element — intuition, softness, power, confidence, strength, and protection.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <span className="inline-block px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-[#FAF7F2]/10 text-[#FAF7F2] border border-[#FAF7F2]/20">
                100% Silk Mark Certified
              </span>
              <span className="inline-block px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-[#FAF7F2]/10 text-[#FAF7F2] border border-[#FAF7F2]/20">
                Direct Loom Origin
              </span>
            </div>
          </div>

          {/* Col 2: The Collections - 2 cols */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-sm font-bold tracking-wider text-[#FAF7F2] uppercase">
              The Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-[#C4B7A5] font-light">
              <li><button type="button" onClick={() => handleNav('collections')} className="hover:text-[#E8B4B8] transition-colors cursor-pointer text-left">The Sixth Element Edition</button></li>
              <li><button type="button" onClick={() => handleNav('collections')} className="hover:text-[#E8B4B8] transition-colors cursor-pointer text-left">AARU by Moni</button></li>
              <li><button type="button" onClick={() => handleNav('sarees-rts')} className="hover:text-[#E8B4B8] transition-colors cursor-pointer text-left">Sarees – Ready to Ship</button></li>
              <li><button type="button" onClick={() => handleNav('designer-wear')} className="hover:text-[#E8B4B8] transition-colors cursor-pointer text-left">Hand-Embroidered Organza</button></li>
              <li><button type="button" onClick={() => handleNav('sale')} className="text-[#E0B0B1] hover:text-[#E8B4B8] transition-colors font-medium cursor-pointer text-left">Mid-Season Sale (Up to 25% Off)</button></li>
            </ul>
          </div>

          {/* Col 3: Client Studio & Services - 2 cols */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-sm font-bold tracking-wider text-[#FAF7F2] uppercase">
              Studio Services
            </h4>
            <ul className="space-y-2.5 text-xs text-[#C4B7A5] font-light">
              <li><button type="button" onClick={() => handleNav('custom-clothing')} className="hover:text-[#E8B4B8] transition-colors cursor-pointer text-left">Customised Clothing Studio</button></li>
              <li><button type="button" onClick={handleOpenOrders} className="hover:text-[#E8B4B8] transition-colors cursor-pointer text-left">Track Order Status</button></li>
              <li><button type="button" onClick={() => handleNav('shop-the-look')} className="hover:text-[#E8B4B8] transition-colors cursor-pointer text-left">Shop the Lookbook</button></li>
            </ul>
          </div>

          {/* Col 4: CUSTOMER CARE - 2 cols */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-sm font-bold tracking-wider text-[#FAF7F2] uppercase">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-3 text-sm text-[#C4B7A5] font-light">
              <li>
                <button
                  type="button"
                  id="footer-shipping-policy-btn"
                  onClick={() => handleNav('shipping-policy')}
                  className="hover:text-[#E8B4B8] transition-colors cursor-pointer text-left block"
                >
                  Shipping Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  id="footer-returns-policy-btn"
                  onClick={() => handleNav('returns-policy')}
                  className="hover:text-[#E8B4B8] transition-colors cursor-pointer text-left block"
                >
                  Returns Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  id="footer-privacy-policy-btn"
                  onClick={() => handleNav('privacy-policy')}
                  className="hover:text-[#E8B4B8] transition-colors cursor-pointer text-left block"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  id="footer-terms-of-use-btn"
                  onClick={() => handleNav('terms-of-use')}
                  className="hover:text-[#E8B4B8] transition-colors cursor-pointer text-left block"
                >
                  Terms of Use
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Brand & Heritage - 2 cols */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-sm font-bold tracking-wider text-[#FAF7F2] uppercase">
              Brand & Heritage
            </h4>
            <ul className="space-y-2.5 text-xs text-[#C4B7A5] font-light">
              <li><button type="button" onClick={() => handleNav('about')} className="hover:text-[#E8B4B8] transition-colors cursor-pointer text-left">About AARU</button></li>
              <li><button type="button" onClick={() => handleNav('story')} className="hover:text-[#E8B4B8] transition-colors cursor-pointer text-left">Founder’s Story: Moni</button></li>
              <li><a href="#faqs" className="hover:text-[#E8B4B8] transition-colors cursor-pointer text-left block">Frequently Asked Questions</a></li>
              <li><button type="button" onClick={() => handleNav('contact')} className="hover:text-[#E8B4B8] transition-colors cursor-pointer text-left">Salon & Studio Contact</button></li>
              <li>
                <button type="button" onClick={() => handleNav('privacy-policy')} className="text-[#8A7F73] hover:text-[#E8B4B8] transition-colors cursor-pointer text-left">
                  Legal Compliance & GST
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#A89882] font-light gap-4">
          <p>© 2026 AARU Luxury Fashion & Textiles Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Handloom Heritage & Couture Excellence</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const BrandStorySection = AboutAaruSection;

