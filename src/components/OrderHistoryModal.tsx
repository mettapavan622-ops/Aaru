import React, { useState, useEffect } from 'react';
import { Order, ReturnExchangeRequest } from '../types';
import { 
  X, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  RotateCcw, 
  AlertCircle, 
  MessageCircle, 
  ChevronRight,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onCancelOrder: (orderId: string) => void;
  onRequestReturn?: (orderId: string) => void;
  onRequestReturnWithDetails?: (orderId: string, details: {
    requestType: 'Return' | 'Exchange';
    reason: string;
    clientNote: string;
    exchangeSize?: string;
  }) => Promise<void>;
  onRefreshOrders?: () => Promise<void> | void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  orders,
  onCancelOrder,
  onRequestReturn,
  onRequestReturnWithDetails,
  onRefreshOrders
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
    orders[0]?.id || null
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Return / Exchange Request Dialog State
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [orderForReturn, setOrderForReturn] = useState<Order | null>(null);
  const [requestType, setRequestType] = useState<'Return' | 'Exchange'>('Return');
  const [returnReason, setReturnReason] = useState<string>('Sizing or Fit Issue (Too loose / too tight)');
  const [clientNote, setClientNote] = useState<string>('');
  const [exchangeSize, setExchangeSize] = useState<string>('Free Size');
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);
  const [returnSuccessMessage, setReturnSuccessMessage] = useState<string | null>(null);

  // Auto-sync orders when modal is open
  useEffect(() => {
    if (isOpen && onRefreshOrders) {
      onRefreshOrders();
    }
  }, [isOpen]);

  useEffect(() => {
    if (orders.length > 0 && (!selectedOrderId || !orders.find(o => o.id === selectedOrderId))) {
      setSelectedOrderId(orders[0].id);
    }
  }, [orders, selectedOrderId]);

  const handleManualRefresh = async () => {
    if (!onRefreshOrders) return;
    setIsRefreshing(true);
    try {
      await onRefreshOrders();
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  const handleOpenReturnModal = (order: Order) => {
    setOrderForReturn(order);
    setRequestType('Return');
    setReturnReason('Sizing or Fit Issue (Too loose / too tight)');
    setClientNote('');
    setExchangeSize(order.items[0]?.variant.size || 'Free Size');
    setReturnSuccessMessage(null);
    setIsReturnModalOpen(true);
  };

  const handleSubmitReturnRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderForReturn) return;

    setIsSubmittingReturn(true);
    try {
      if (onRequestReturnWithDetails) {
        await onRequestReturnWithDetails(orderForReturn.id, {
          requestType,
          reason: returnReason,
          clientNote,
          exchangeSize: requestType === 'Exchange' ? exchangeSize : undefined
        });
      } else {
        const res = await fetch(`/api/orders/${orderForReturn.id}/return-request`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requestType,
            reason: returnReason,
            clientNote,
            exchangeSize: requestType === 'Exchange' ? exchangeSize : undefined
          })
        });
        if (!res.ok) {
          throw new Error('Failed to submit return request');
        }
        if (onRefreshOrders) {
          await onRefreshOrders();
        }
      }

      setReturnSuccessMessage(
        `Your ${requestType} request for ${orderForReturn.orderNumber} has been dispatched to the Atelier Admin Dashboard. Our Director will review and process approval.`
      );
      setTimeout(() => {
        setIsReturnModalOpen(false);
        setReturnSuccessMessage(null);
      }, 2200);
    } catch (err: any) {
      alert(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setIsSubmittingReturn(false);
    }
  };

  if (!isOpen) return null;

  const currentOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-4xl w-full border border-[#D4C7B5] shadow-2xl flex flex-col max-h-[90vh] relative">
        {/* Header */}
        <div className="p-5 border-b border-[#E8DFD5] bg-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-[#0F4C5C]" />
            <div>
              <h3 className="font-serif text-xl font-bold text-[#24211E]">
                Your Atelier Orders & Live Tracking
              </h3>
              <p className="text-[11px] text-[#736B5E]">Real-time synchronization with atelier dispatch system</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onRefreshOrders && (
              <button
                type="button"
                onClick={handleManualRefresh}
                title="Sync latest tracking status"
                className="p-1.5 text-[#5C5549] hover:text-[#0F4C5C] hover:bg-[#E8DFD5]/50 transition-colors rounded-xs flex items-center gap-1 text-xs cursor-pointer"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#0F4C5C]' : ''}`} />
                <span className="hidden sm:inline">Sync Status</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {orders.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Package className="w-12 h-12 text-[#D4C7B5] mx-auto" />
              <p className="font-serif text-lg text-[#24211E]">No orders placed yet</p>
              <p className="text-xs text-[#736B5E]">Explore our heirloom collections to place your first weave.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Order selector list */}
              <div className="lg:col-span-4 border-r border-[#E8DFD5] pr-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C6D37]">Order History</h4>
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrderId(ord.id)}
                    className={`p-3.5 border cursor-pointer transition-all ${
                      selectedOrderId === ord.id
                        ? 'bg-[#FAF7F2] border-[#0F4C5C] shadow-xs'
                        : 'border-[#E8DFD5] hover:border-[#D4C7B5]'
                    }`}
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-mono text-xs font-bold text-[#24211E]">{ord.orderNumber}</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 ${
                        ord.status.includes('Return') || ord.status.includes('Exchange')
                          ? 'bg-amber-100 text-amber-900'
                          : ord.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-teal-50 text-[#0F4C5C]'
                      }`}>
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#736B5E]">{ord.items.length} item(s) • ₹{ord.total.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{new Date(ord.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>

              {/* Order Tracking & Timeline Detail */}
              {currentOrder && (
                <div className="lg:col-span-8 space-y-6">
                  {/* Order Overview Header (Matching Screenshot 2026-09-12 105659.png) */}
                  <div className="p-4 bg-[#FAF7F2] border border-[#E8DFD5] flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-[#8C6D37] font-medium uppercase tracking-wider">Tracking Dossier</p>
                      <h4 className="font-serif text-lg font-bold text-[#24211E]">{currentOrder.orderNumber}</h4>
                      <p className="text-[11px] text-[#736B5E]">
                        Courier: {currentOrder.courierName || 'Blue Dart Luxury Express'} ({currentOrder.trackingNumber || 'BD-884219482IN'})
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {currentOrder.canCancel && (
                        <button
                          type="button"
                          onClick={() => onCancelOrder(currentOrder.id)}
                          className="px-3 py-1.5 border border-rose-400 text-rose-700 hover:bg-rose-50 text-xs font-medium uppercase tracking-wider cursor-pointer"
                        >
                          Cancel Order
                        </button>
                      )}

                      {/* Request Return / Exchange Button (Screenshot 2026-09-12 105659.png) */}
                      {currentOrder.canReturn && !currentOrder.returnRequest && (
                        <button
                          type="button"
                          id="request-return-exchange-btn"
                          onClick={() => handleOpenReturnModal(currentOrder)}
                          className="px-4 py-2 border border-[#2D5A46] bg-white text-[#2D5A46] hover:bg-[#2D5A46] hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Request Return/Exchange</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Active Return or Exchange Request Status Card */}
                  {currentOrder.returnRequest && (
                    <div className={`p-4 border text-xs space-y-2 ${
                      currentOrder.returnRequest.status === 'Approved'
                        ? 'bg-emerald-50/70 border-emerald-300 text-[#194030]'
                        : currentOrder.returnRequest.status === 'Rejected' || currentOrder.returnRequest.status === 'Cancelled'
                          ? 'bg-rose-50 border-rose-300 text-rose-900'
                          : 'bg-amber-50/80 border-amber-300 text-amber-900'
                    }`}>
                      <div className="flex items-center justify-between border-b border-current/15 pb-1.5">
                        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                          {currentOrder.returnRequest.status === 'Approved' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : currentOrder.returnRequest.status === 'Rejected' ? (
                            <XCircle className="w-4 h-4 text-rose-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-amber-600" />
                          )}
                          <span>
                            {currentOrder.returnRequest.requestType} Request: {currentOrder.returnRequest.status === 'Pending' ? 'Pending Admin Approval' : currentOrder.returnRequest.status}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono opacity-70">
                          {new Date(currentOrder.returnRequest.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <p>
                          <span className="font-semibold">Reason:</span> {currentOrder.returnRequest.reason}
                        </p>
                        {currentOrder.returnRequest.exchangeSize && (
                          <p>
                            <span className="font-semibold">Requested Size:</span> {currentOrder.returnRequest.exchangeSize}
                          </p>
                        )}
                        {currentOrder.returnRequest.clientNote && (
                          <p>
                            <span className="font-semibold">Client Note:</span> "{currentOrder.returnRequest.clientNote}"
                          </p>
                        )}
                      </div>

                      {/* Admin Decision Note */}
                      {currentOrder.returnRequest.adminNote && (
                        <div className="mt-2 pt-2 border-t border-current/15 bg-white/60 p-2 text-[11px] rounded-xs">
                          <p className="font-bold">Atelier Admin Response:</p>
                          <p>{currentOrder.returnRequest.adminNote}</p>
                          {currentOrder.returnRequest.pickupScheduledDate && (
                            <p className="text-emerald-700 font-medium mt-0.5">
                              Pickup Scheduled: {currentOrder.returnRequest.pickupScheduledDate} via Blue Dart
                            </p>
                          )}
                        </div>
                      )}

                      {currentOrder.returnRequest.status === 'Pending' && (
                        <p className="text-[11px] text-amber-800 italic pt-1">
                          This request has been dispatched to the Admin dashboard. The Atelier Director will review and approve or contact you within 24 hours.
                        </p>
                      )}
                    </div>
                  )}

                  {/* 5-Step Order Timeline Tracker */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#24211E]">Dispatch Timeline</h5>
                    <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8DFD5]">
                      {currentOrder.timeline.map((step, idx) => (
                        <div key={idx} className="relative flex items-start gap-3">
                          <span className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white ${
                            step.completed ? 'bg-[#2D5A46]' : step.current ? 'bg-[#0F4C5C] ring-4 ring-[#0F4C5C]/20' : 'bg-gray-300'
                          }`}>
                            {step.completed ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          </span>
                          <div>
                            <p className={`text-xs font-bold ${step.completed || step.current ? 'text-[#24211E]' : 'text-gray-400'}`}>
                              {step.label}
                            </p>
                            {step.date && <p className="text-[10px] text-[#8C6D37]">{step.date}</p>}
                            {step.description && <p className="text-[11px] text-[#736B5E] mt-0.5">{step.description}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Items in order */}
                  <div className="pt-4 border-t border-[#E8DFD5]">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#24211E] mb-3">Ensembles Ordered</h5>
                    <div className="space-y-3">
                      {currentOrder.items.map((i, idx) => (
                        <div key={idx} className="flex gap-3 items-center text-xs">
                          <img src={i.product.images[0]} alt={i.product.title} className="w-12 h-14 object-cover bg-gray-100" />
                          <div className="flex-1 min-w-0">
                            <p className="font-serif font-bold text-[#24211E] truncate">{i.product.title}</p>
                            <p className="text-[11px] text-[#736B5E]">Size: {i.variant.size} • Qty: {i.quantity}</p>
                          </div>
                          <span className="font-semibold text-[#0F4C5C]">
                            ₹{(i.price * i.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* WhatsApp Support CTA */}
                  <div className="pt-4 border-t border-[#E8DFD5] flex items-center justify-between">
                    <span className="text-xs text-[#736B5E]">Need delivery help or alterations?</span>
                    <a
                      href={`https://wa.me/919876543210?text=Hello%20AARU%20Atelier,%20I%20have%20a%20query%20on%20Order%20${currentOrder.orderNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D5A46] hover:underline"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat with Courier Concierge
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dedicated Return / Exchange Request Modal */}
        {isReturnModalOpen && orderForReturn && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white max-w-lg w-full border border-[#D4C7B5] shadow-2xl p-6 space-y-5 animate-in fade-in duration-200">
              {/* Modal Header */}
              <div className="flex justify-between items-center border-b border-[#E8DFD5] pb-3">
                <div>
                  <h4 className="font-serif text-xl font-bold text-[#24211E]">
                    Request Return or Exchange
                  </h4>
                  <p className="text-xs text-[#8C6D37] mt-0.5">
                    Order: <span className="font-mono font-bold">{orderForReturn.orderNumber}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsReturnModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {returnSuccessMessage ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2 text-center py-6">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-bold text-sm">Request Successfully Submitted</p>
                  <p>{returnSuccessMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReturnRequest} className="space-y-4">
                  {/* Select Type */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5C5549] mb-1.5">
                      Request Option *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRequestType('Return')}
                        className={`p-3 border text-left cursor-pointer transition-all ${
                          requestType === 'Return'
                            ? 'border-[#0F4C5C] bg-[#FAF7F2] ring-1 ring-[#0F4C5C]'
                            : 'border-[#E8DFD5] hover:border-[#D4C7B5]'
                        }`}
                      >
                        <p className="text-xs font-bold text-[#24211E]">Return</p>
                        <p className="text-[11px] text-[#736B5E]">Reverse pickup & refund to source</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRequestType('Exchange')}
                        className={`p-3 border text-left cursor-pointer transition-all ${
                          requestType === 'Exchange'
                            ? 'border-[#0F4C5C] bg-[#FAF7F2] ring-1 ring-[#0F4C5C]'
                            : 'border-[#E8DFD5] hover:border-[#D4C7B5]'
                        }`}
                      >
                        <p className="text-xs font-bold text-[#24211E]">Exchange</p>
                        <p className="text-[11px] text-[#736B5E]">Replacement size / variant swap</p>
                      </button>
                    </div>
                  </div>

                  {/* If Exchange, pick size */}
                  {requestType === 'Exchange' && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5C5549] mb-1">
                        Preferred Replacement Size *
                      </label>
                      <select
                        value={exchangeSize}
                        onChange={(e) => setExchangeSize(e.target.value)}
                        className="w-full p-2.5 border border-[#D4C7B5] bg-[#FAF7F2] text-xs font-medium focus:outline-none focus:border-[#0F4C5C]"
                      >
                        <option value="Free Size">Free Size (Standard 5.5m Drape)</option>
                        <option value="XS">Extra Small (XS)</option>
                        <option value="S">Small (S)</option>
                        <option value="M">Medium (M)</option>
                        <option value="L">Large (L)</option>
                        <option value="XL">Extra Large (XL)</option>
                        <option value="Custom">Custom Measurements</option>
                      </select>
                    </div>
                  )}

                  {/* Return Reason */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5C5549] mb-1">
                      Reason for {requestType} *
                    </label>
                    <select
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      className="w-full p-2.5 border border-[#D4C7B5] bg-[#FAF7F2] text-xs font-medium focus:outline-none focus:border-[#0F4C5C]"
                    >
                      <option value="Sizing or Fit Issue (Too loose / too tight)">
                        Sizing or Fit Issue (Too loose / too tight)
                      </option>
                      <option value="Fabric or Color different from expectation">
                        Fabric or Color different from expectation
                      </option>
                      <option value="Quality concern or defect observed in weave">
                        Quality concern or defect observed in weave
                      </option>
                      <option value="Exchange for different size">
                        Exchange for different size
                      </option>
                      <option value="Arrived late / Event concluded">
                        Arrived late / Event concluded
                      </option>
                      <option value="Ordered by mistake">
                        Ordered by mistake
                      </option>
                      <option value="Other reason">
                        Other reason
                      </option>
                    </select>
                  </div>

                  {/* Detailed client message */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5C5549] mb-1">
                      Client Note / Specific Request Details
                    </label>
                    <textarea
                      rows={3}
                      value={clientNote}
                      onChange={(e) => setClientNote(e.target.value)}
                      placeholder="e.g. Please send size M instead of S, or describe specific alteration requirement..."
                      className="w-full p-2.5 border border-[#D4C7B5] bg-[#FAF7F2] text-xs focus:outline-none focus:border-[#0F4C5C]"
                    />
                  </div>

                  {/* Policy Info Box */}
                  <div className="p-3 bg-[#FAF7F2] border border-[#E8DFD5] text-[11px] text-[#736B5E] space-y-1">
                    <p className="font-semibold text-[#24211E] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#0F4C5C]" />
                      Atelier Policy Reminder
                    </p>
                    <p>
                      Items must be unworn with all security tags intact. Once submitted, your request is reviewed by the Atelier Admin for approval and courier pickup scheduling.
                    </p>
                  </div>

                  {/* Modal Footer Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsReturnModalOpen(false)}
                      className="px-4 py-2 border border-[#D4C7B5] text-xs font-semibold text-[#5C5549] hover:bg-gray-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingReturn}
                      className="px-5 py-2.5 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-wider shadow-md transition-colors cursor-pointer flex items-center gap-2"
                    >
                      {isSubmittingReturn && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                      <span>Submit Request to Admin</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
