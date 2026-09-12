import React from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';

export type PolicyType = 'returns-policy' | 'shipping-policy' | 'privacy-policy' | 'terms-of-use';

interface PolicyPageProps {
  type: PolicyType;
  onNavigateHome: () => void;
  onNavigatePolicy?: (policy: PolicyType) => void;
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ 
  type, 
  onNavigateHome,
  onNavigatePolicy 
}) => {
  return (
    <div className="bg-[#FDFBF7] min-h-[85vh] py-12 sm:py-16 text-[#0F4C5C] selection:bg-[#0F4C5C]/15 selection:text-[#0F4C5C]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation Trail: HOME > PAGE TITLE */}
        <nav 
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs sm:text-sm uppercase tracking-widest font-sans font-semibold text-[#0F4C5C] mb-8 sm:mb-12"
        >
          <button 
            type="button" 
            onClick={onNavigateHome}
            className="text-[#0F4C5C] hover:underline transition-colors cursor-pointer"
          >
            HOME
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#0F4C5C]/60 shrink-0" />
          <span className="text-[#0F4C5C] font-bold">
            {type === 'returns-policy' && 'RETURNS POLICY'}
            {type === 'shipping-policy' && 'SHIPPING POLICY'}
            {type === 'privacy-policy' && 'PRIVACY POLICY'}
            {type === 'terms-of-use' && 'TERMS OF USE'}
          </span>
        </nav>

        {/* Policy Container with Clear Hierarchy */}
        <div className="bg-white/70 border border-[#0F4C5C]/15 rounded-lg p-6 sm:p-10 lg:p-12 shadow-sm">
          {/* 1. Returns Policy (/returns-policy) */}
          {type === 'returns-policy' && (
            <article className="space-y-8 animate-in fade-in duration-300">
              <div className="border-b border-[#0F4C5C]/20 pb-6">
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F4C5C] tracking-tight">
                  Returns Policy
                </h1>
              </div>

              <div className="space-y-8 pt-2 text-base sm:text-lg text-[#0F4C5C] leading-relaxed">
                <section className="space-y-2">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0F4C5C]">
                    Return Eligibility
                  </h2>
                  <p className="text-[#0F4C5C]">
                    Ready To Ship items may be returned within 7 days of delivery, provided they are unworn, unwashed, and in original packaging with all tags attached. Bespoke and customized garments are non-returnable.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0F4C5C]">
                    Return Process
                  </h2>
                  <p className="text-[#0F4C5C]">
                    Contact our customer care team via WhatsApp or email to initiate a return. Once approved, we will arrange a pickup from your registered address. Refunds are processed within 7–10 business days after quality inspection.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0F4C5C]">
                    Exchanges
                  </h2>
                  <p className="text-[#0F4C5C]">
                    Size exchanges are available for eligible ready-to-wear items subject to stock availability. Contact us within 7 days of delivery to request an exchange.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0F4C5C]">
                    Damaged Items
                  </h2>
                  <p className="text-[#0F4C5C]">
                    If your order arrives damaged, please contact us within 48 hours with photographs. We will arrange a replacement or full refund at no additional cost.
                  </p>
                </section>
              </div>
            </article>
          )}

          {/* 2. Shipping Policy (/shipping-policy) */}
          {type === 'shipping-policy' && (
            <article className="space-y-8 animate-in fade-in duration-300">
              <div className="border-b border-[#0F4C5C]/20 pb-6">
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F4C5C] tracking-tight">
                  Shipping Policy
                </h1>
              </div>

              <div className="space-y-8 pt-2 text-base sm:text-lg text-[#0F4C5C] leading-relaxed">
                <section className="space-y-2">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0F4C5C]">
                    Domestic Shipping
                  </h2>
                  <p className="text-[#0F4C5C]">
                    All orders within India are shipped via insured express courier. Standard delivery takes 5–7 business days from dispatch. Ready To Ship items are dispatched within 2–3 business days.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0F4C5C]">
                    International Shipping
                  </h2>
                  <p className="text-[#0F4C5C]">
                    AARU ships to 30+ countries worldwide. International delivery typically takes 10–15 business days. Customs duties and taxes may apply based on your country's regulations.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0F4C5C]">
                    Shipping Charges
                  </h2>
                  <p className="text-[#0F4C5C]">
                    Complimentary express shipping on all domestic orders above ₹25,000. Standard shipping rates apply for orders below this threshold and all international orders.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0F4C5C]">
                    Order Tracking
                  </h2>
                  <p className="text-[#0F4C5C]">
                    Once your order is dispatched, you will receive a tracking number via email and SMS. Track your shipment through your AARU dashboard or the courier partner's website.
                  </p>
                </section>
              </div>
            </article>
          )}

          {/* 3. Privacy Policy (/privacy-policy) */}
          {type === 'privacy-policy' && (
            <article className="space-y-8 animate-in fade-in duration-300">
              <div className="border-b border-[#0F4C5C]/20 pb-6">
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F4C5C] tracking-tight">
                  Privacy Policy
                </h1>
                <p className="text-xs uppercase tracking-widest text-[#0F4C5C] mt-2 font-bold">
                  LAST UPDATED: JUNE 12, 2026
                </p>
              </div>

              <div className="space-y-8 pt-2 text-base sm:text-lg text-[#0F4C5C] leading-relaxed">
                <p className="text-[#0F4C5C]">
                  At AARU Luxury, accessible from aaru.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by AARU and how we use it.
                </p>

                <section className="space-y-3">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#0F4C5C]">
                    1. INFORMATION WE COLLECT
                  </h2>
                  <p className="text-[#0F4C5C]">
                    When you register for an account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number. If you use our bespoke custom clothing service, we also collect measurement parameters (bust, waist, hips, height) to tailor products specifically for you.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#0F4C5C]">
                    2. HOW WE USE YOUR INFORMATION
                  </h2>
                  <p className="text-[#0F4C5C]">
                    We use the information we collect in various ways, including to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-[#0F4C5C]">
                    <li>Provide, operate, and maintain our website and account configurations.</li>
                    <li>Improve, personalize, and expand our clothing offerings.</li>
                    <li>Understand and analyze how you interact with our catalog items.</li>
                    <li>Develop new products, custom designs, services, and features.</li>
                    <li>Process payments and transactions securely via Razorpay gateway channels.</li>
                  </ul>
                </section>
              </div>
            </article>
          )}

          {/* 4. Terms of Use (/terms-of-use) */}
          {type === 'terms-of-use' && (
            <article className="space-y-8 animate-in fade-in duration-300">
              <div className="border-b border-[#0F4C5C]/20 pb-6">
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F4C5C] tracking-tight">
                  Terms of Use
                </h1>
                <p className="text-xs uppercase tracking-widest text-[#0F4C5C] mt-2 font-bold">
                  LAST UPDATED: JUNE 12, 2026
                </p>
              </div>

              <div className="space-y-8 pt-2 text-base sm:text-lg text-[#0F4C5C] leading-relaxed">
                <p className="text-[#0F4C5C]">
                  Welcome to AARU Luxury. These terms and conditions outline the rules and regulations for the use of the AARU Luxury Fashion Website.
                </p>

                <section className="space-y-3">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#0F4C5C]">
                    1. BESPOKE ORDERS AND TAILORING
                  </h2>
                  <p className="text-[#0F4C5C]">
                    By submitting body measurements on our customised clothing platform, you represent that the measurements provided are accurate. Sizing adjustments requested after completion may be subject to additional fabric costs if the sizing variance exceeds standard tolerances.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#0F4C5C]">
                    2. PAYMENT AND TRANSACTIONS
                  </h2>
                  <p className="text-[#0F4C5C]">
                    We process transaction charges in INR (Indian Rupees) using Secure Razorpay APIs. Orders are confirmed only upon receipt of payment authorisation confirmation from the gateway merchant.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#0F4C5C]">
                    3. LIMITATION OF LIABILITY
                  </h2>
                  <p className="text-[#0F4C5C]">
                    AARU Luxury, including its designers and weavers, shall not be held liable for delayed shipments caused by logistics delays, transport strikes, or weather conditions affecting fabric production clusters.
                  </p>
                </section>
              </div>
            </article>
          )}

          {/* Quick Switcher Between Policy Documents */}
          <div className="mt-12 pt-8 border-t border-[#0F4C5C]/20 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold uppercase tracking-wider">
            <button
              type="button"
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 text-[#0F4C5C] hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Storefront
            </button>

            {onNavigatePolicy && (
              <div className="flex flex-wrap gap-4 text-[#0F4C5C]">
                {type !== 'returns-policy' && (
                  <button
                    type="button"
                    onClick={() => onNavigatePolicy('returns-policy')}
                    className="hover:underline cursor-pointer"
                  >
                    Returns Policy
                  </button>
                )}
                {type !== 'shipping-policy' && (
                  <button
                    type="button"
                    onClick={() => onNavigatePolicy('shipping-policy')}
                    className="hover:underline cursor-pointer"
                  >
                    Shipping Policy
                  </button>
                )}
                {type !== 'privacy-policy' && (
                  <button
                    type="button"
                    onClick={() => onNavigatePolicy('privacy-policy')}
                    className="hover:underline cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                )}
                {type !== 'terms-of-use' && (
                  <button
                    type="button"
                    onClick={() => onNavigatePolicy('terms-of-use')}
                    className="hover:underline cursor-pointer"
                  >
                    Terms of Use
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ReturnsPolicyPage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => (
  <PolicyPage type="returns-policy" onNavigateHome={onNavigateHome} />
);

export const ShippingPolicyPage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => (
  <PolicyPage type="shipping-policy" onNavigateHome={onNavigateHome} />
);

export const PrivacyPolicyPage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => (
  <PolicyPage type="privacy-policy" onNavigateHome={onNavigateHome} />
);

export const TermsOfUsePage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => (
  <PolicyPage type="terms-of-use" onNavigateHome={onNavigateHome} />
);
