import React from 'react';
import { ChevronRight } from 'lucide-react';

export type PolicyType = 'shipping-policy' | 'returns-policy' | 'privacy-policy' | 'terms-of-use';

interface PolicyPageProps {
  type: PolicyType;
  onNavigateHome: () => void;
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ type, onNavigateHome }) => {
  return (
    <div className="bg-[#FAF9F5] min-h-[70vh] py-12 sm:py-16 text-[#24211E]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#8C8275] mb-8 font-sans">
          <button 
            type="button" 
            onClick={onNavigateHome}
            className="hover:text-[#0F4C5C] transition-colors cursor-pointer"
          >
            HOME
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#C4B7A5]" />
          <span className="text-[#24211E] font-medium">
            {type === 'shipping-policy' && 'SHIPPING POLICY'}
            {type === 'returns-policy' && 'RETURNS POLICY'}
            {type === 'privacy-policy' && 'PRIVACY POLICY'}
            {type === 'terms-of-use' && 'TERMS OF USE'}
          </span>
        </nav>

        {/* 1. Shipping Policy */}
        {type === 'shipping-policy' && (
          <article className="space-y-8 animate-in fade-in duration-300">
            <h1 className="font-serif text-4xl sm:text-5xl font-medium text-[#24211E] tracking-tight">
              Shipping Policy
            </h1>

            <div className="space-y-8 pt-4 text-base sm:text-lg text-[#5C5549] leading-relaxed">
              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-[#24211E]">Domestic Shipping</h2>
                <p>
                  All orders within India are shipped via insured express courier. Standard delivery takes 5–7 business days from dispatch. Ready To Ship items are dispatched within 2–3 business days.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-[#24211E]">International Shipping</h2>
                <p>
                  AARU ships to 30+ countries worldwide. International delivery typically takes 10–15 business days. Customs duties and taxes may apply based on your country's regulations.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-[#24211E]">Shipping Charges</h2>
                <p>
                  Complimentary express shipping on all domestic orders above ₹25,000. Standard shipping rates apply for orders below this threshold and all international orders.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-[#24211E]">Order Tracking</h2>
                <p>
                  Once your order is dispatched, you will receive a tracking number via email and SMS. Track your shipment through your AARU dashboard or the courier partner's website.
                </p>
              </section>
            </div>
          </article>
        )}

        {/* 2. Returns Policy */}
        {type === 'returns-policy' && (
          <article className="space-y-8 animate-in fade-in duration-300">
            <h1 className="font-serif text-4xl sm:text-5xl font-medium text-[#24211E] tracking-tight">
              Returns Policy
            </h1>

            <div className="space-y-8 pt-4 text-base sm:text-lg text-[#5C5549] leading-relaxed">
              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-[#24211E]">Return Eligibility</h2>
                <p>
                  Ready To Ship items may be returned within 7 days of delivery, provided they are unworn, unwashed, and in original packaging with all tags attached. Bespoke and customized garments are non-returnable.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-[#24211E]">Return Process</h2>
                <p>
                  Contact our customer care team via WhatsApp or email to initiate a return. Once approved, we will arrange a pickup from your registered address. Refunds are processed within 7–10 business days after quality inspection.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-[#24211E]">Exchanges</h2>
                <p>
                  Size exchanges are available for eligible ready-to-wear items subject to stock availability. Contact us within 7 days of delivery to request an exchange.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-[#24211E]">Damaged Items</h2>
                <p>
                  If your order arrives damaged, please contact us within 48 hours with photographs. We will arrange a replacement or full refund at no additional cost.
                </p>
              </section>
            </div>
          </article>
        )}

        {/* 3. Privacy Policy */}
        {type === 'privacy-policy' && (
          <article className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h1 className="font-serif text-4xl sm:text-5xl font-medium text-[#24211E] tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-xs uppercase tracking-widest text-[#8C6D37] mt-3 font-semibold">
                LAST UPDATED: JUNE 12, 2026
              </p>
              <div className="w-16 h-0.5 bg-[#C49E62] mt-3" />
            </div>

            <div className="space-y-8 pt-4 text-base sm:text-lg text-[#5C5549] leading-relaxed">
              <p>
                At AARU Luxury, accessible from aaru.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by AARU and how we use it.
              </p>

              <section className="space-y-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold uppercase tracking-wider text-[#24211E]">
                  1. INFORMATION WE COLLECT
                </h2>
                <p>
                  When you register for an account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number. If you use our bespoke custom clothing service, we also collect measurement parameters (bust, waist, hips, height) to tailor products specifically for you.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold uppercase tracking-wider text-[#24211E]">
                  2. HOW WE USE YOUR INFORMATION
                </h2>
                <p>
                  We use the information we collect in various ways, including to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[#5C5549]">
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

        {/* 4. Terms of Use */}
        {type === 'terms-of-use' && (
          <article className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h1 className="font-serif text-4xl sm:text-5xl font-medium text-[#24211E] tracking-tight">
                Terms of Use
              </h1>
              <p className="text-xs uppercase tracking-widest text-[#8C6D37] mt-3 font-semibold">
                LAST UPDATED: JUNE 12, 2026
              </p>
              <div className="w-16 h-0.5 bg-[#C49E62] mt-3" />
            </div>

            <div className="space-y-8 pt-4 text-base sm:text-lg text-[#5C5549] leading-relaxed">
              <p>
                Welcome to AARU Luxury. These terms and conditions outline the rules and regulations for the use of AARU Luxury Fashion Website.
              </p>

              <section className="space-y-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold uppercase tracking-wider text-[#24211E]">
                  1. BESPOKE ORDERS AND TAILORING
                </h2>
                <p>
                  By submitting body measurements on our customized clothing platform, you represent that the measurements provided are accurate. Sizing adjustments requested after completion may be subject to additional fabric costs if the sizing variance exceeds standard tolerances.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold uppercase tracking-wider text-[#24211E]">
                  2. PAYMENT AND TRANSACTIONS
                </h2>
                <p>
                  We process transaction charges in INR (Indian Rupees) using Secure Razorpay APIs. Orders are confirmed only upon receipt of payment authorization confirmation from the gateway merchant.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold uppercase tracking-wider text-[#24211E]">
                  3. LIMITATION OF LIABILITY
                </h2>
                <p>
                  AARU Luxury, including its designers and weavers, shall not be held liable for delayed shipments caused by logistics delays, transport strikes, or weather conditions affecting fabric production clusters.
                </p>
              </section>
            </div>
          </article>
        )}
      </div>
    </div>
  );
};
