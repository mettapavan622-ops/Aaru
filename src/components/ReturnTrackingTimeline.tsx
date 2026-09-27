import React, { useState, useEffect } from 'react';
import { 
  Order, 
  ReturnExchangeRequest, 
  ReturnTrackingData, 
  ReturnTrackingStep, 
  ReturnTrackingStepStatus 
} from '../types';
import { 
  CheckCircle2, 
  Clock, 
  Truck, 
  Package, 
  ShieldCheck, 
  RotateCcw, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertCircle,
  Calendar,
  CreditCard,
  Building2,
  Info
} from 'lucide-react';

interface ReturnTrackingTimelineProps {
  order: Order;
  returnRequest?: ReturnExchangeRequest;
  onStatusUpdated?: () => void;
}

export const ReturnTrackingTimeline: React.FC<ReturnTrackingTimelineProps> = ({
  order,
  returnRequest: initialReturnRequest,
  onStatusUpdated
}) => {
  const effectiveRequest = initialReturnRequest || order.returnRequest;
  const [trackingData, setTrackingData] = useState<ReturnTrackingData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUpdatingStage, setIsUpdatingStage] = useState<boolean>(false);

  // Fetch return tracking data from server API
  const fetchTracking = async () => {
    if (!order.id) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/orders/${order.id}/return-tracking`);
      if (res.ok) {
        const data: ReturnTrackingData = await res.json();
        setTrackingData(data);
      } else {
        // Fallback calculation from order and returnRequest if endpoint hasn't synced
        generateFallbackData();
      }
    } catch (err) {
      console.warn('Could not fetch tracking from API, using local order model:', err);
      generateFallbackData();
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackData = () => {
    if (!effectiveRequest) return;
    const currentStatus: ReturnTrackingStepStatus = effectiveRequest.trackingStatus || 'Return Approved';
    const pickupDate = effectiveRequest.pickupScheduledDate || 'Tomorrow, 11:00 AM - 02:00 PM';
    const reverseWaybill = effectiveRequest.reverseTrackingNumber || `BD-REV-${order.orderNumber.replace(/[^0-9]/g, '') || '894210'}IN`;
    const refundAmount = effectiveRequest.refundAmount || order.total;

    const stages: ReturnTrackingStepStatus[] = [
      'Return Approved',
      'Out for Pickup',
      'Package Received',
      'Refund Processed'
    ];

    const currentIdx = stages.indexOf(currentStatus);

    const steps: ReturnTrackingStep[] = [
      {
        step: 'Return Approved',
        label: 'Return Approved',
        completed: currentIdx >= 0,
        current: currentIdx === 0,
        date: effectiveRequest.createdAt ? new Date(effectiveRequest.createdAt).toLocaleDateString() : 'Today',
        description: 'Authorized by Atelier Director Moni. Reverse logistics docket initialized.'
      },
      {
        step: 'Out for Pickup',
        label: 'Out for Pickup',
        completed: currentIdx >= 1,
        current: currentIdx === 1,
        date: currentIdx >= 1 ? 'In Transit' : pickupDate,
        description: `Blue Dart pickup agent assigned. Scheduled collection: ${pickupDate}.`
      },
      {
        step: 'Package Received',
        label: 'Inspection at Workshop',
        completed: currentIdx >= 2,
        current: currentIdx === 2,
        date: currentIdx >= 2 ? 'Inspected' : 'Upcoming',
        description: 'Quality inspection of saree zari, fall, and tags at Varanasi workshop.'
      },
      {
        step: 'Refund Processed',
        label: 'Refund Processed',
        completed: currentIdx >= 3,
        current: currentIdx === 3,
        date: currentIdx >= 3 ? 'Completed' : 'Pending Inspection',
        description: `₹${refundAmount.toLocaleString('en-IN')} initiated to original payment source (Ref: REF-${order.orderNumber.replace(/[^0-9]/g, '') || '9921'}).`
      }
    ];

    setTrackingData({
      orderId: order.id,
      orderNumber: order.orderNumber,
      returnRequestId: effectiveRequest.id,
      requestType: effectiveRequest.requestType,
      currentStatus,
      pickupScheduledDate: pickupDate,
      reverseCourier: effectiveRequest.reverseCourier || 'Blue Dart Luxury Express - Reverse Logistics',
      reverseTrackingNumber: reverseWaybill,
      refundAmount,
      refundMethod: 'Original Payment Method (Direct Bank / UPI)',
      refundReferenceId: effectiveRequest.refundReferenceId || `REF-${order.orderNumber.replace(/[^0-9]/g, '') || '894210'}`,
      steps
    });
  };

  useEffect(() => {
    fetchTracking();
  }, [order.id, effectiveRequest?.status, effectiveRequest?.trackingStatus]);

  const handleCopyWaybill = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Allow advancing status for demonstration / live testing
  const handleAdvanceStatus = async (newStep: ReturnTrackingStepStatus) => {
    if (!effectiveRequest?.id) return;
    setIsUpdatingStage(true);
    try {
      const res = await fetch(`/api/return-requests/${effectiveRequest.id}/tracking-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingStatus: newStep })
      });
      if (res.ok) {
        await fetchTracking();
        if (onStatusUpdated) onStatusUpdated();
      }
    } catch (e) {
      console.error('Failed to update tracking stage:', e);
    } finally {
      setIsUpdatingStage(false);
    }
  };

  if (!effectiveRequest) {
    return null;
  }

  // Only display the active return tracking timeline once approved or actively processing
  const isApproved = effectiveRequest.status === 'Approved' || 
    order.status === 'Return Approved' || 
    order.status === 'Exchange Approved' ||
    Boolean(trackingData);

  if (!isApproved) {
    return (
      <div className="p-4 bg-amber-50/70 border border-amber-200 text-amber-900 rounded-none space-y-1 text-xs">
        <p className="font-bold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          Return Request Pending Atelier Review
        </p>
        <p className="text-[#5C5549]">
          Your return request for {order.orderNumber} is under review by Atelier Director Moni. Once approved, live reverse pickup tracking and refund milestones will appear here.
        </p>
      </div>
    );
  }

  const currentStatus = trackingData?.currentStatus || effectiveRequest.trackingStatus || 'Return Approved';
  const reverseTrackingNumber = trackingData?.reverseTrackingNumber || effectiveRequest.reverseTrackingNumber || `BD-REV-${order.orderNumber.replace(/[^0-9]/g, '') || '894210'}IN`;
  const pickupDate = trackingData?.pickupScheduledDate || effectiveRequest.pickupScheduledDate || 'Tomorrow, 11:00 AM - 02:00 PM';
  const courierPartner = trackingData?.reverseCourier || 'Blue Dart Luxury Express - Reverse Logistics';
  const refundAmount = trackingData?.refundAmount || order.total;

  const steps = trackingData?.steps || [
    {
      step: 'Return Approved',
      label: 'Return Approved',
      completed: true,
      current: currentStatus === 'Return Approved',
      date: 'Authorized',
      description: 'Request authorized by Atelier Director Moni. Reverse shipment generated.'
    },
    {
      step: 'Out for Pickup',
      label: 'Out for Pickup',
      completed: currentStatus !== 'Return Approved',
      current: currentStatus === 'Out for Pickup',
      date: pickupDate,
      description: 'Blue Dart courier executive dispatched for scheduled home collection.'
    },
    {
      step: 'Package Received',
      label: 'Inspection at Atelier Loom',
      completed: currentStatus === 'Package Received' || currentStatus === 'Refund Processed',
      current: currentStatus === 'Package Received',
      date: 'Varanasi Atelier',
      description: 'Drape inspection for pure zari, fall, and tags intact.'
    },
    {
      step: 'Refund Processed',
      label: 'Refund Processed',
      completed: currentStatus === 'Refund Processed',
      current: currentStatus === 'Refund Processed',
      date: 'Completed',
      description: `₹${refundAmount.toLocaleString('en-IN')} refunded to original payment instrument.`
    }
  ];

  return (
    <div className="bg-[#FAF7F2] border border-[#D4C7B5] p-5 space-y-5 shadow-xs animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8DFD5] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-[#2D5A46] text-white">
              Reverse Logistics
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C6D37]">
              Return Tracking Dossier
            </span>
          </div>
          <h4 className="font-serif text-lg font-bold text-[#24211E] mt-1">
            Return Tracking: {order.orderNumber}
          </h4>
          <p className="text-xs text-[#736B5E]">
            Direct courier tracking connecting your doorstep to our workshop
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchTracking}
            disabled={isLoading}
            className="px-3 py-1.5 bg-white border border-[#D4C7B5] hover:border-[#0F4C5C] text-[#24211E] hover:text-[#0F4C5C] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Refresh reverse tracking status"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#0F4C5C]' : ''}`} />
            <span className="hidden sm:inline">Refresh Tracking</span>
          </button>
        </div>
      </div>

      {/* Live Stepper Indicator (Visual Timeline Bar) */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 relative">
          {steps.map((st, idx) => {
            const isCompleted = st.completed;
            const isCurrent = st.current;
            return (
              <div 
                key={idx} 
                className={`p-3 border transition-all ${
                  isCurrent 
                    ? 'bg-white border-[#0F4C5C] shadow-sm ring-1 ring-[#0F4C5C]' 
                    : isCompleted 
                      ? 'bg-emerald-50/60 border-emerald-300' 
                      : 'bg-gray-50/80 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#8C6D37]">
                    0{idx + 1}
                  </span>
                  {isCompleted && !isCurrent ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0F4C5C] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0F4C5C]"></span>
                    </span>
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </div>

                <p className={`text-xs font-bold ${isCurrent ? 'text-[#0F4C5C]' : isCompleted ? 'text-emerald-950' : 'text-gray-500'}`}>
                  {st.label}
                </p>
                
                <p className="text-[10px] text-[#736B5E] mt-0.5 line-clamp-1">
                  {st.date || (isCompleted ? 'Completed' : 'Upcoming')}
                </p>
              </div>
            );
          })}
        </div>

        {/* Detailed Milestones List */}
        <div className="bg-white border border-[#E8DFD5] p-4 space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#24211E] border-b border-[#E8DFD5] pb-2">
            Detailed Return Milestones
          </p>
          <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8DFD5]">
            {steps.map((st, idx) => (
              <div key={idx} className="relative flex items-start gap-3">
                <span className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs ${
                  st.completed && !st.current 
                    ? 'bg-[#2D5A46]' 
                    : st.current 
                      ? 'bg-[#0F4C5C] ring-4 ring-[#0F4C5C]/20' 
                      : 'bg-gray-300'
                }`}>
                  {st.completed && !st.current ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : st.current ? (
                    <Truck className="w-3.5 h-3.5" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-1">
                    <p className={`text-xs font-bold ${st.completed || st.current ? 'text-[#24211E]' : 'text-gray-400'}`}>
                      {st.label}
                    </p>
                    {st.date && (
                      <span className="text-[10px] font-mono text-[#8C6D37]">
                        {st.date}
                      </span>
                    )}
                  </div>
                  {st.description && (
                    <p className="text-[11px] text-[#736B5E] mt-0.5">
                      {st.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Courier & Reverse Logistics Specifications Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Logistics Partner Info */}
        <div className="bg-white border border-[#E8DFD5] p-3.5 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-[#0F4C5C] font-bold">
            <Truck className="w-4 h-4 text-[#8C6D37]" />
            <span>Reverse Pickup Courier</span>
          </div>
          <p className="text-sm font-semibold text-[#24211E]">
            {courierPartner}
          </p>
          <div className="pt-2 border-t border-[#E8DFD5] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#736B5E] block">Reverse Docket #</span>
              <span className="font-mono text-xs font-bold text-[#0F4C5C]">{reverseTrackingNumber}</span>
            </div>
            <button
              type="button"
              onClick={() => handleCopyWaybill(reverseTrackingNumber)}
              className="p-1.5 bg-[#FAF7F2] border border-[#D4C7B5] hover:bg-[#E8DFD5] text-xs flex items-center gap-1 cursor-pointer transition-colors"
              title="Copy reverse waybill number"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#5C5549]" />}
              <span className="text-[10px]">{isCopied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pickup Window: {pickupDate}</span>
          </div>
        </div>

        {/* Refund & Atelier Guarantee */}
        <div className="bg-white border border-[#E8DFD5] p-3.5 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-[#2D5A46] font-bold">
            <ShieldCheck className="w-4 h-4 text-[#2D5A46]" />
            <span>Refund Settlement Dossier</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-[#5C5549]">Refundable Value:</span>
            <span className="font-serif text-base font-bold text-[#2D5A46]">
              ₹{refundAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="pt-2 border-t border-[#E8DFD5] text-[11px] text-[#5C5549] space-y-1">
            <p className="flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[#8C6D37]" />
              <span>Destination: {trackingData?.refundMethod || 'Original Payment Instrument'}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#8C6D37]" />
              <span>Reference UTR: {trackingData?.refundReferenceId || `REF-${order.orderNumber.replace(/[^0-9]/g, '') || '9281'}`}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Packaging & Handover Checklist Instructions */}
      <div className="p-3.5 bg-white border border-[#D4C7B5] text-xs space-y-2">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#8C6D37] text-[10px]">
          <Info className="w-3.5 h-3.5" />
          <span>Handover Protocol for Artisanal Weaves</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-[#5C5549] text-[11px]">
          <li>Keep the handloom drape neatly folded with the original butter paper lining.</li>
          <li>Place the garment securely inside the signature AARU ivory velvet gift box.</li>
          <li>Ensure the security tags and Silk Mark certification card remain intact.</li>
          <li>Hand over to the Blue Dart reverse courier executive upon verifying their uniform badge.</li>
        </ul>
      </div>

      {/* Interactive Stage Testing / Simulation Bar (Supports seamless demo of all stages) */}
      <div className="p-3 bg-[#FAF7F2] border-t border-[#E8DFD5] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-[11px] text-[#736B5E]">
          <span className="font-semibold text-[#24211E]">Test Stage Transition:</span>
          <span>(Simulate return progress)</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {(['Return Approved', 'Out for Pickup', 'Package Received', 'Refund Processed'] as ReturnTrackingStepStatus[]).map((stepName) => (
            <button
              key={stepName}
              type="button"
              disabled={isUpdatingStage}
              onClick={() => handleAdvanceStatus(stepName)}
              className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-colors ${
                currentStatus === stepName
                  ? 'bg-[#0F4C5C] text-white border-[#0F4C5C]'
                  : 'bg-white text-[#5C5549] border-[#D4C7B5] hover:border-[#0F4C5C]'
              }`}
            >
              {stepName}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
