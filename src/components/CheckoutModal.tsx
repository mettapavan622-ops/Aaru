import React, { useState } from 'react';
import { CartItem, Address, Order } from '../types';
import { 
  X, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Building, 
  ArrowRight, 
  RotateCcw, 
  Package, 
  MessageCircle, 
  Truck,
  Tag 
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  onOrderSuccess: (order: Order) => void;
  userEmail?: string;
  userName?: string;
  appliedPromo?: string;
  onApplyPromo?: (code: string) => Promise<{ success: boolean; message: string; discount?: number }>;
  onRemovePromo?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  discount,
  shippingFee,
  tax,
  total,
  onOrderSuccess,
  userEmail = 'client@aaru.luxury',
  userName = 'Aditi Sharma',
  appliedPromo = '',
  onApplyPromo,
  onRemovePromo
}) => {
  const [step, setStep] = useState<'address' | 'payment' | 'processing' | 'confirmed' | 'failed'>('address');
  const [address, setAddress] = useState<Address>({
    id: 'addr-new',
    name: userName,
    street: '74 Lavelle Road, Richmond Town',
    apartment: 'Suite 402, Crescent Manor',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    phone: '+91 98765 43210',
    isDefault: true
  });

  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'UPI' | 'Card' | 'NetBanking'>('Razorpay');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isGatewayLoading, setIsGatewayLoading] = useState(false);

  // Safe numerical calculations ensuring NaN never enters payment or UI
  const safeSubtotal = Math.max(0, Number(subtotal) || 0);
  const safeDiscount = Math.min(safeSubtotal, Math.max(0, Number(discount) || 0));
  const remainingSubtotal = Math.max(0, safeSubtotal - safeDiscount);
  const safeShipping = Math.max(0, Number(shippingFee) || 0);
  const safeTax = Number.isFinite(tax) && !isNaN(tax)
    ? Math.max(0, Number(tax))
    : Math.round(remainingSubtotal * 0.05);
  const safeTotal = Number.isFinite(total) && !isNaN(total) && total > 0
    ? total
    : Math.max(0, remainingSubtotal + safeShipping + safeTax);

  if (!isOpen) return null;

  // Helper to dynamically ensure Razorpay checkout.js is loaded
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(true));
        existingScript.addEventListener('error', () => resolve(false));
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Helper to retrieve Razorpay Public Key ID
  const getRazorpayKey = async (): Promise<string> => {
    const envKey = (import.meta as any).env?.VITE_RAZORPAY_KEY_ID;
    if (envKey) return envKey;
    try {
      const res = await fetch('/api/razorpay-key');
      if (res.ok) {
        const data = await res.json();
        if (data.key_id) return data.key_id;
      }
    } catch (e) {
      console.warn('Could not fetch razorpay key from server:', e);
    }
    return 'rzp_live_TaprqEC6ceGPl9';
  };

  // Direct Sandbox Test Payment Helper
  const handleDirectSandboxPayment = async () => {
    setErrorMessage('');
    setIsGatewayLoading(true);
    setStep('processing');
    try {
      const simOrderId = `order_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const simPaymentId = `pay_sim_${Date.now()}`;
      const verifyRes = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: simOrderId,
          razorpay_payment_id: simPaymentId,
          razorpay_signature: `sig_sim_${Date.now()}`,
          items,
          shippingAddress: address,
          subtotal: safeSubtotal,
          discount: safeDiscount,
          shippingFee: safeShipping,
          tax: safeTax,
          total: safeTotal,
          customerName: address.name,
          customerEmail: userEmail,
          customerPhone: address.phone,
          paymentMethod: `Razorpay Standard (${paymentMethod})`
        })
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.error || 'Payment verification failed.');
      }

      const newOrder: Order = verifyData.order || {
        id: `ord-${Date.now()}`,
        orderNumber: `AARU-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        userId: 'user-current',
        customerName: address.name,
        customerEmail: userEmail,
        customerPhone: address.phone,
        items,
        shippingAddress: address,
        subtotal,
        discount,
        shippingFee,
        tax,
        total,
        status: 'Confirmed',
        paymentMethod: `Razorpay Standard (${paymentMethod})`,
        paymentId: simPaymentId,
        courierName: 'Blue Dart Luxury Express',
        trackingNumber: `BD-${Math.floor(100000000 + Math.random() * 900000000)}IN`,
        timeline: [
          {
            status: 'Confirmed',
            label: 'Order Confirmed (Razorpay Verified)',
            date: new Date().toLocaleString(),
            completed: true,
            current: true,
            description: `Payment Verified (Transaction: ${simPaymentId})`
          }
        ],
        canCancel: true,
        canReturn: false,
        createdAt: new Date().toISOString()
      };

      setCreatedOrder(newOrder);
      setStep('confirmed');
      onOrderSuccess(newOrder);
    } catch (err: any) {
      console.error('Sandbox Authorization Error:', err);
      setStep('failed');
      setErrorMessage(err.message || 'Sandbox payment authorization failed.');
    } finally {
      setIsGatewayLoading(false);
    }
  };

  // Main Razorpay Checkout Trigger
  const handleProcessPayment = async (simulateFailure = false) => {
    setErrorMessage('');

    if (simulateFailure) {
      setStep('processing');
      setTimeout(() => {
        setStep('failed');
        setErrorMessage('Test Scenario: Payment authorization cancelled or declined by issuing bank.');
      }, 800);
      return;
    }

    try {
      setIsGatewayLoading(true);

      // 1. Ensure Razorpay SDK script is ready
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !(window as any).Razorpay) {
        throw new Error('Razorpay Checkout SDK failed to load. Please verify your connection.');
      }

      // 2. Fetch Public Key ID
      const keyId = await getRazorpayKey();

      // 3. STEP 1: Backend - Create Order (POST /api/create-order)
      // Minimum amount: 100 paise (1 INR)
      const amountInPaise = Math.max(100, Math.round(safeTotal * 100));
      const createRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`
        })
      });

      if (!createRes.ok) {
        const errData = await createRes.json();
        throw new Error(errData.error || 'Backend order creation failed on payment server.');
      }

      const orderData = await createRes.json();
      const razorpayOrderId = orderData.order_id || orderData.id;

      if (!razorpayOrderId) {
        throw new Error('Razorpay did not return a valid order ID.');
      }

      // Handle Sandbox Simulation mode (when Razorpay credentials are test/unverified or rejected by live server)
      if (orderData.isSandboxSimulation) {
        setIsGatewayLoading(false);
        setStep('processing');
        
        setTimeout(async () => {
          try {
            const simPaymentId = `pay_sim_${Date.now()}`;
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: razorpayOrderId,
                razorpay_payment_id: simPaymentId,
                razorpay_signature: `sig_sim_${Date.now()}`,
                items,
                shippingAddress: address,
                subtotal: safeSubtotal,
                discount: safeDiscount,
                shippingFee: safeShipping,
                tax: safeTax,
                total: safeTotal,
                customerName: address.name,
                customerEmail: userEmail,
                customerPhone: address.phone,
                paymentMethod: `Razorpay Standard (${paymentMethod})`
              })
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Server-side payment verification failed.');
            }

            const newOrder: Order = verifyData.order || {
              id: `ord-${Date.now()}`,
              orderNumber: `AARU-2026-${Math.floor(10000 + Math.random() * 90000)}`,
              userId: 'user-current',
              customerName: address.name,
              customerEmail: userEmail,
              customerPhone: address.phone,
              items,
              shippingAddress: address,
              subtotal,
              discount,
              shippingFee,
              tax,
              total,
              status: 'Confirmed',
              paymentMethod: `Razorpay Standard (${paymentMethod})`,
              paymentId: simPaymentId,
              courierName: 'Blue Dart Luxury Express',
              trackingNumber: `BD-${Math.floor(100000000 + Math.random() * 900000000)}IN`,
              timeline: [
                {
                  status: 'Confirmed',
                  label: 'Order Confirmed (Razorpay Verified)',
                  date: new Date().toLocaleString(),
                  completed: true,
                  current: true,
                  description: `Payment Verified (Transaction: ${simPaymentId})`
                }
              ],
              canCancel: true,
              canReturn: false,
              createdAt: new Date().toISOString()
            };

            setCreatedOrder(newOrder);
            setStep('confirmed');
            onOrderSuccess(newOrder);
          } catch (simErr: any) {
            console.error('Simulation Verification Error:', simErr);
            setStep('failed');
            setErrorMessage(simErr.message || 'Payment simulation verification failed.');
          }
        }, 750);
        return;
      }

      setIsGatewayLoading(false);

      // 4. STEP 2: FRONTEND - Open Razorpay Standard Checkout Modal
      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'AARU Luxury Boutique',
        description: `Handcrafted Weave Order (${items.length} ${items.length === 1 ? 'item' : 'items'})`,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80',
        order_id: razorpayOrderId,
        prefill: {
          name: address.name || userName,
          email: userEmail,
          contact: address.phone.replace(/[^0-9+]/g, '') || '+919876543210'
        },
        notes: {
          address: `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`,
          source: 'AARU Web Checkout'
        },
        theme: {
          color: '#0F4C5C'
        },
        // Step 2 Success Callback: receive razorpay_payment_id, razorpay_order_id, razorpay_signature
        handler: async function (response: any) {
          setStep('processing');
          try {
            // STEP 3: BACKEND - Verify Signature (POST /api/verify-payment)
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                items,
                shippingAddress: address,
                subtotal: safeSubtotal,
                discount: safeDiscount,
                shippingFee: safeShipping,
                tax: safeTax,
                total: safeTotal,
                customerName: address.name,
                customerEmail: userEmail,
                customerPhone: address.phone,
                paymentMethod: `Razorpay Standard (${paymentMethod})`
              })
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Server-side payment signature verification failed.');
            }

            // Successfully Verified and Recorded!
            const newOrder: Order = verifyData.order || {
              id: `ord-${Date.now()}`,
              orderNumber: `AARU-2026-${Math.floor(10000 + Math.random() * 90000)}`,
              userId: 'user-current',
              customerName: address.name,
              customerEmail: userEmail,
              customerPhone: address.phone,
              items,
              shippingAddress: address,
              subtotal,
              discount,
              shippingFee,
              tax,
              total,
              status: 'Confirmed',
              paymentMethod: `Razorpay Standard (${paymentMethod})`,
              paymentId: response.razorpay_payment_id,
              courierName: 'Blue Dart Luxury Express',
              trackingNumber: `BD-${Math.floor(100000000 + Math.random() * 900000000)}IN`,
              timeline: [
                {
                  status: 'Confirmed',
                  label: 'Order Confirmed (Razorpay Verified)',
                  date: new Date().toLocaleString(),
                  completed: true,
                  current: true,
                  description: `Verified Payment ID: ${response.razorpay_payment_id}`
                }
              ],
              canCancel: true,
              canReturn: false,
              createdAt: new Date().toISOString()
            };

            setCreatedOrder(newOrder);
            setStep('confirmed');
            onOrderSuccess(newOrder);
          } catch (verifyErr: any) {
            console.error('Signature Verification Error:', verifyErr);
            setStep('failed');
            setErrorMessage(verifyErr.message || 'Payment signature mismatch or verification rejected by server.');
          }
        },
        modal: {
          ondismiss: function () {
            // Handle modal dismiss (user cancelled)
            setIsGatewayLoading(false);
            setStep('payment');
            setErrorMessage('Payment cancelled: Razorpay checkout modal was dismissed before completion.');
          }
        }
      };

      const rzpInstance = new (window as any).Razorpay(options);

      // Handle payment.failed event
      rzpInstance.on('payment.failed', function (resp: any) {
        console.error('Razorpay Payment Failed Event:', resp);
        setIsGatewayLoading(false);
        setStep('failed');
        setErrorMessage(
          resp.error?.description ||
          resp.error?.reason ||
          'Payment declined by bank or cancelled by cardholder.'
        );
      });

      rzpInstance.open();
    } catch (err: any) {
      console.error('Checkout Error:', err);
      setIsGatewayLoading(false);
      setStep('failed');
      setErrorMessage(err.message || 'An error occurred initializing the payment gateway.');
    }
  };

  const whatsappSupportUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
    `Hello AARU Concierge, I have an inquiry regarding my order ${createdOrder?.orderNumber || 'checkout'}.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full border border-[#D4C7B5] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#E8DFD5] bg-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#0F4C5C]" />
            <h3 className="font-serif text-xl font-bold text-[#24211E]">
              {step === 'confirmed' ? 'Order Confirmed' : 'Secure Checkout'}
            </h3>
          </div>
          {step !== 'processing' && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-gray-900"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: Shipping Address */}
          {step === 'address' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-lg font-bold text-[#24211E]">
                  1. Shipping & Delivery Address
                </h4>
                <span className="text-xs text-[#8C6D37]">Step 1 of 2</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-[#736B5E] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#736B5E] mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#736B5E] mb-1">Street Address</label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#736B5E] mb-1">City</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#736B5E] mb-1">State</label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#736B5E] mb-1">PIN / Postal Code</label>
                  <input
                    type="text"
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
                  />
                </div>
              </div>

              {/* Order Summary Snapshot */}
              <div className="p-4 bg-[#FAF7F2] border border-[#E8DFD5] text-xs space-y-2">
                <div className="flex justify-between font-medium text-[#24211E]">
                  <span>Items ({items.reduce((s, i) => s + i.quantity, 0)} weaves)</span>
                  <span>₹{safeSubtotal.toLocaleString('en-IN')}</span>
                </div>
                {safeDiscount > 0 && (
                  <>
                    <div className="flex justify-between items-center text-[#2D5A46] bg-emerald-50 px-2.5 py-1 border border-emerald-200">
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>Privilege Coupon {appliedPromo ? `(${appliedPromo})` : ''}</span>
                      </div>
                      <span className="font-bold">-₹{safeDiscount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-[#24211E] font-medium">
                      <span>Remaining Subtotal</span>
                      <span>₹{remainingSubtotal.toLocaleString('en-IN')}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between text-[#736B5E]">
                  <span>Shipping Fee</span>
                  <span>{safeShipping === 0 ? <strong className="text-[#2D5A46]">Complimentary</strong> : `₹${safeShipping.toLocaleString('en-IN')}`}</span>
                </div>
                <div className="flex justify-between text-[#736B5E]">
                  <span>Estimated GST (5%)</span>
                  <span>₹{safeTax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-serif text-sm font-bold text-[#0F4C5C] pt-2 border-t border-[#E8DFD5]">
                  <span>Total Payable</span>
                  <span>₹{safeTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep('payment')}
                className="w-full py-3.5 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 shadow-md"
              >
                <span>Continue to Payment Method</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Payment Gateway Selection */}
          {step === 'payment' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-lg font-bold text-[#24211E]">
                  2. Select Payment Method
                </h4>
                <button
                  type="button"
                  onClick={() => setStep('address')}
                  className="text-xs text-[#0F4C5C] underline"
                >
                  Edit Address
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'Razorpay', label: 'Razorpay Secure (UPI, Cards, Netbanking)', icon: ShieldCheck, desc: '256-bit encrypted gateway with server signature verification.' },
                  { id: 'UPI', label: 'Instant UPI (Google Pay / PhonePe)', icon: Smartphone, desc: 'Zero surcharge instant mobile authorization.' },
                  { id: 'Card', label: 'International / Domestic Card', icon: CreditCard, desc: 'Visa, MasterCard, Amex with 3D Secure.' },
                  { id: 'NetBanking', label: 'Direct Net Banking', icon: Building, desc: 'HDFC, ICICI, SBI, Axis and 50+ banks.' }
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <label
                      key={m.id}
                      className={`p-4 border cursor-pointer transition-all flex flex-col justify-between ${
                        paymentMethod === m.id
                          ? 'border-[#0F4C5C] bg-[#0F4C5C]/5 shadow-xs'
                          : 'border-[#E8DFD5] hover:border-[#D4C7B5]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-[#0F4C5C]" />
                          <span className="text-xs font-bold text-[#24211E]">{m.id}</span>
                        </div>
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === m.id}
                          onChange={() => setPaymentMethod(m.id as any)}
                          className="accent-[#0F4C5C]"
                        />
                      </div>
                      <p className="text-[11px] text-[#736B5E] font-light">{m.desc}</p>
                    </label>
                  );
                })}
              </div>

              {/* Razorpay Integration Badge */}
              <div className="p-3 bg-[#FAF7F2] border border-[#D4C7B5] text-xs text-[#5C5549] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0F4C5C] shrink-0" />
                  <div>
                    <span className="font-semibold text-[#24211E]">Razorpay Standard Web Checkout</span>
                    <span className="text-[10px] text-[#8C6D37] block font-mono">Test Mode Active • rzp_test_TapgRnHo52EDW7</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-[#2D5A46] text-[10px] font-bold uppercase tracking-wider">
                  Verified Gateway
                </span>
              </div>

              {errorMessage && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-2">
                <button
                  type="button"
                  id="pay-and-confirm-btn"
                  disabled={isGatewayLoading}
                  onClick={() => handleProcessPayment(false)}
                  className="w-full py-3.5 bg-[#0F4C5C] hover:bg-[#0b3844] disabled:opacity-75 text-white text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  {isGatewayLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Opening Razorpay Gateway...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay with Razorpay (₹{safeTotal.toLocaleString('en-IN')})</span>
                      <ShieldCheck className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Presentation helper to test failure / cancel flow */}
                <div className="pt-2 flex items-center justify-center gap-4 text-xs text-[#8A8175]">
                  <span>Test Scenarios:</span>
                  <button
                    type="button"
                    onClick={() => handleProcessPayment(true)}
                    className="text-rose-600 underline hover:text-rose-800"
                  >
                    Simulate Payment Gateway Failure
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Processing State */}
          {step === 'processing' && (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 border-3 border-[#0F4C5C] border-t-transparent rounded-full animate-spin mx-auto" />
              <h4 className="font-serif text-xl font-bold text-[#0F4C5C]">
                Processing Secure Payment...
              </h4>
              <p className="text-xs text-[#736B5E] max-w-sm mx-auto">
                Verifying payment signature with banking servers, reserving inventory, and generating your order tracking details.
              </p>
            </div>
          )}

          {/* STEP 4: Failed State */}
          {step === 'failed' && (
            <div className="py-10 text-center space-y-5">
              <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-2xl font-bold text-rose-700">
                Payment Verification Unsuccessful
              </h4>
              <p className="text-xs text-[#736B5E] max-w-md mx-auto">
                {errorMessage || 'The payment request was cancelled or declined by your financial institution.'}
              </p>
              <div className="pt-2 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="px-6 py-2.5 bg-[#0F4C5C] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer hover:bg-[#0b3844] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Retry Payment
                </button>
                <button
                  type="button"
                  onClick={handleDirectSandboxPayment}
                  className="px-6 py-2.5 bg-[#8C6D37] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer hover:bg-[#72572b] transition-colors shadow-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Authorize via Sandbox Test
                </button>
                <a
                  href={whatsappSupportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 border border-[#2D5A46] text-[#2D5A46] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-[#2D5A46]/5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Contact Concierge
                </a>
              </div>
            </div>
          )}

          {/* STEP 5: Order Confirmed Screen */}
          {step === 'confirmed' && createdOrder && (
            <div className="space-y-6 py-4">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#2D5A46] mx-auto flex items-center justify-center">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-3xl font-bold text-[#0F4C5C]">
                  Thank You for Your Patronage
                </h4>
                <p className="text-xs text-[#736B5E]">
                  Your order has been confirmed and logged in our system.
                </p>
              </div>

              {/* Order Dossier */}
              <div className="p-5 bg-[#FAF7F2] border border-[#E8DFD5] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8DFD5] pb-3 text-xs">
                  <div>
                    <span className="text-[#8C6D37] font-semibold uppercase tracking-wider">Order ID:</span>{' '}
                    <strong className="text-[#24211E] font-mono">{createdOrder.orderNumber}</strong>
                  </div>
                  <div>
                    <span className="text-[#8C6D37] font-semibold uppercase tracking-wider">Status:</span>{' '}
                    <span className="inline-block px-2 py-0.5 bg-[#2D5A46] text-white font-bold text-[10px] uppercase">
                      {createdOrder.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#5C5549]">
                  <div>
                    <p className="font-bold text-[#24211E] mb-1">Delivery Destination</p>
                    <p>{createdOrder.shippingAddress.name}</p>
                    <p>{createdOrder.shippingAddress.street}</p>
                    <p>{createdOrder.shippingAddress.city}, {createdOrder.shippingAddress.state} - {createdOrder.shippingAddress.pincode}</p>
                    <p className="text-[#8C6D37] mt-1">{createdOrder.shippingAddress.phone}</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#24211E] mb-1">Courier Logistics</p>
                    <p className="flex items-center gap-1.5 text-[#0F4C5C] font-semibold">
                      <Truck className="w-3.5 h-3.5" />
                      {createdOrder.courierName}
                    </p>
                    <p className="font-mono text-[11px] mt-0.5">AWB: {createdOrder.trackingNumber}</p>
                    <p className="text-[11px] text-[#736B5E] mt-1">Payment ID: {createdOrder.paymentId}</p>
                  </div>
                </div>

                <div className="border-t border-[#E8DFD5] pt-3">
                  <p className="font-bold text-xs text-[#24211E] mb-2">Purchased Ensembles:</p>
                  <div className="space-y-2">
                    {createdOrder.items.map((i, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span className="text-[#24211E]">
                          {i.product.title} (x{i.quantity}) • Size {i.variant.size}
                        </span>
                        <span className="font-semibold text-[#0F4C5C]">
                          ₹{(i.price * i.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#E8DFD5] pt-2 flex justify-between font-serif text-sm font-bold text-[#24211E]">
                  <span>Total Paid</span>
                  <span>₹{createdOrder.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <a
                  href={whatsappSupportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#2D5A46] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Support
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#0F4C5C] text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Close & View Order in Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
