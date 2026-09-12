import React, { useState, useEffect } from 'react';
import { Product, Order, AnnouncementSettings, Category, Collection, CustomerInquiry, ReturnExchangeRequest } from '../../types';
import { ProductEditor } from './ProductEditor';
import { DatabaseSchemaViewer } from './DatabaseSchemaViewer';
import { 
  Package, 
  ShoppingBag, 
  Tag, 
  Megaphone, 
  Database, 
  Plus, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Truck, 
  ExternalLink, 
  CheckCircle, 
  ArrowLeft, 
  SlidersHorizontal,
  RefreshCw,
  Search,
  MessageSquare,
  Mail,
  Phone,
  Clock,
  Filter,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar
} from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  announcement: AnnouncementSettings;
  categories: Category[];
  collections: Collection[];
  onSaveProduct: (productData: Partial<Product>) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
  onUpdateAnnouncement: (newSettings: Partial<AnnouncementSettings>) => Promise<void>;
  onUpdateOrderStatus: (orderId: string, status: Order['status'], trackingNumber?: string, courierName?: string) => Promise<void>;
  onSwitchToUser: () => void;
  onRefreshOrders?: () => Promise<void> | void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  announcement,
  categories,
  collections,
  onSaveProduct,
  onDeleteProduct,
  onUpdateAnnouncement,
  onUpdateOrderStatus,
  onSwitchToUser,
  onRefreshOrders
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'returns' | 'inquiries' | 'announcement' | 'schema'>('products');
  const [productEditing, setProductEditing] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  // Customer Inquiries Queue State
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);
  const [inquirySourceFilter, setInquirySourceFilter] = useState<'all' | 'Homepage Inquiry' | 'Customisation Inquiry'>('all');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<'all' | 'New' | 'In Review' | 'Resolved'>('all');
  const [inquirySearch, setInquirySearch] = useState('');

  // Return & Exchange Requests State
  const [returnRequests, setReturnRequests] = useState<ReturnExchangeRequest[]>([]);
  const [isLoadingReturns, setIsLoadingReturns] = useState(false);
  const [returnStatusFilter, setReturnStatusFilter] = useState<'all' | 'Pending' | 'Approved' | 'Rejected'>('all');
  const [returnSearch, setReturnSearch] = useState('');
  const [selectedRequestForAction, setSelectedRequestForAction] = useState<{
    request: ReturnExchangeRequest;
    actionType: 'approve' | 'reject';
  } | null>(null);
  const [adminActionNote, setAdminActionNote] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  const fetchReturnRequests = async () => {
    setIsLoadingReturns(true);
    try {
      const res = await fetch('/api/return-requests');
      const data = await res.json();
      if (Array.isArray(data)) {
        setReturnRequests(data);
      }
    } catch (err) {
      console.error('Failed to load return requests:', err);
    } finally {
      setIsLoadingReturns(false);
    }
  };

  const fetchInquiries = async () => {
    setIsLoadingInquiries(true);
    try {
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      if (Array.isArray(data)) {
        setInquiries(data);
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setIsLoadingInquiries(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
    fetchReturnRequests();
  }, []);

  const handleOpenActionModal = (request: ReturnExchangeRequest, actionType: 'approve' | 'reject') => {
    setSelectedRequestForAction({ request, actionType });
    if (actionType === 'approve') {
      setAdminActionNote(
        request.requestType === 'Exchange'
          ? `Exchange approved. Replacement weave size (${request.exchangeSize || 'standard'}) prepared for dispatch.`
          : 'Return approved after atelier inspection. Reverse pickup scheduled via Blue Dart Luxury Express.'
      );
      // default pickup date: tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setPickupDate(tomorrow.toISOString().split('T')[0]);
    } else {
      setAdminActionNote('Request could not be approved based on 7-day return and atelier inspection policy.');
      setPickupDate('');
    }
  };

  const handleConfirmReturnAction = async () => {
    if (!selectedRequestForAction) return;
    setIsSubmittingAction(true);
    const { request, actionType } = selectedRequestForAction;
    try {
      const endpoint = actionType === 'approve'
        ? `/api/return-requests/${request.id}/approve`
        : `/api/return-requests/${request.id}/reject`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminNote: adminActionNote,
          pickupScheduledDate: actionType === 'approve' ? pickupDate : undefined
        })
      });

      if (res.ok) {
        await fetchReturnRequests();
        if (onRefreshOrders) {
          await onRefreshOrders();
        }
        setSelectedRequestForAction(null);
      } else {
        alert('Failed to update request. Please try again.');
      }
    } catch (err) {
      console.error('Error in return request action:', err);
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleUpdateInquiryStatus = async (inquiryId: string, status: 'New' | 'In Review' | 'Resolved') => {
    try {
      const res = await fetch(`/api/inquiries/${inquiryId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setInquiries(prev => prev.map(inq => inq.id === inquiryId ? { ...inq, status } : inq));
      }
    } catch (err) {
      console.error('Failed to update inquiry status:', err);
    }
  };

  // Announcement Form State
  const [announcementText, setAnnouncementText] = useState(announcement.text);
  const [isSaleActive, setIsSaleActive] = useState(announcement.isSaleActive);
  const [saleHighlight, setSaleHighlight] = useState(announcement.saleHighlight || '');
  const [announcementSuccess, setAnnouncementSuccess] = useState(false);

  // Status update modal / tracker
  const [selectedOrderToUpdate, setSelectedOrderToUpdate] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<Order['status']>('Processing');
  const [newTracking, setNewTracking] = useState('');

  const filteredProducts = (products || []).filter(p => {
    if (!p) return false;
    const q = (productSearch || '').toLowerCase();
    return Boolean(
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.collection && p.collection.toLowerCase().includes(q))
    );
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalInventory = products.reduce((sum, p) => sum + p.totalInventory, 0);
  const readyToShipCount = products.filter(p => p.isReadyToShip).length;

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateAnnouncement({
      text: announcementText,
      isSaleActive,
      saleHighlight
    });
    setAnnouncementSuccess(true);
    setTimeout(() => setAnnouncementSuccess(false), 2000);
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderToUpdate) return;
    await onUpdateOrderStatus(
      selectedOrderToUpdate.id,
      newStatus,
      newTracking || selectedOrderToUpdate.trackingNumber
    );
    setSelectedOrderToUpdate(null);
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6] text-[#24211E]">
      {/* Admin Operations Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#24211E] text-[#FAF7F2] border-b border-[#3D3730] px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold tracking-[0.2em] text-[#FAF7F2]">
              AARU
            </span>
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] px-2 py-0.5 bg-[#9C7C38] text-white font-bold">
              Atelier CMS Engine
            </span>
          </div>
        </div>

        {/* Presentation Switcher back to User Storefront */}
        <div className="flex items-center gap-3">
          <button
            id="admin-return-storefront-btn"
            type="button"
            onClick={onSwitchToUser}
            className="px-4 py-2 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 rounded-none transition-colors shadow-md cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Switch to User Storefront</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Metric Blocks */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E8DFD5] p-5 shadow-xs">
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#8C6D37]">Total Catalog Weaves</p>
            <p className="font-serif text-3xl font-bold text-[#0F4C5C] mt-1">{products.length}</p>
            <p className="text-[11px] text-[#736B5E] mt-0.5">{totalInventory} total units in stock</p>
          </div>

          <div className="bg-white border border-[#E8DFD5] p-5 shadow-xs">
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#8C6D37]">Ready to Ship Drapes</p>
            <p className="font-serif text-3xl font-bold text-[#2D5A46] mt-1">{readyToShipCount}</p>
            <p className="text-[11px] text-[#736B5E] mt-0.5">Dispatched within 24 hours</p>
          </div>

          <div className="bg-white border border-[#E8DFD5] p-5 shadow-xs">
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#8C6D37]">Active Customer Orders</p>
            <p className="font-serif text-3xl font-bold text-[#24211E] mt-1">{orders.length}</p>
            <p className="text-[11px] text-[#736B5E] mt-0.5">Blue Dart Luxury Express</p>
          </div>

          <div className="bg-white border border-[#E8DFD5] p-5 shadow-xs">
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#8C6D37]">Gross Transaction Value</p>
            <p className="font-serif text-3xl font-bold text-[#9C7C38] mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
            <p className="text-[11px] text-[#736B5E] mt-0.5">Razorpay & SSL Idempotent</p>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#D4C7B5] pb-2">
          {[
            { id: 'products', label: 'Catalog & Product Manager', icon: Package },
            { id: 'orders', label: `Customer Orders (${orders.length})`, icon: ShoppingBag },
            { 
              id: 'returns', 
              label: `Returns & Exchanges (${returnRequests.filter(r => r.status === 'Pending').length} Pending)`, 
              icon: RotateCcw,
              highlight: returnRequests.some(r => r.status === 'Pending')
            },
            { id: 'inquiries', label: `Customer Inquiries (${inquiries.length})`, icon: MessageSquare },
            { id: 'announcement', label: 'Sale Banners & Customer Alerts', icon: Megaphone },
            { id: 'schema', label: 'PostgreSQL Database Architecture', icon: Database }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setIsCreatingNew(false);
                  setProductEditing(null);
                  if (tab.id === 'inquiries') fetchInquiries();
                  if (tab.id === 'returns') fetchReturnRequests();
                }}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer relative ${
                  isActive
                    ? 'bg-[#0F4C5C] text-white shadow-xs'
                    : 'bg-white/70 text-[#5C5549] hover:bg-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Product Editor / Products Table */}
        {activeTab === 'products' && (
          <div>
            {isCreatingNew || productEditing ? (
              <ProductEditor
                productToEdit={productEditing}
                onSaveProduct={async (data) => {
                  await onSaveProduct({
                    ...data,
                    id: productEditing ? productEditing.id : undefined
                  });
                  setIsCreatingNew(false);
                  setProductEditing(null);
                }}
                onCancel={() => {
                  setIsCreatingNew(false);
                  setProductEditing(null);
                }}
                categories={categories.map(c => c.name)}
                collections={collections.map(c => c.title)}
              />
            ) : (
              <div className="bg-white border border-[#E8DFD5] shadow-xs overflow-hidden">
                {/* Table Top Controls */}
                <div className="p-4 border-b border-[#E8DFD5] bg-[#FAF7F2] flex flex-wrap items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <input
                      type="text"
                      placeholder="Search weaves by title, category, collection..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  </div>

                  <button
                    id="admin-create-product-btn"
                    type="button"
                    onClick={() => {
                      setProductEditing(null);
                      setIsCreatingNew(true);
                    }}
                    className="px-4 py-2 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Create New Product
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#FAF7F2] border-b border-[#E8DFD5] text-[#8C6D37] font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="p-3">Weave</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Price / Sale</th>
                        <th className="p-3">Inventory</th>
                        <th className="p-3">Ready to Ship</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8DFD5]">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                          <td className="p-3 flex items-center gap-3">
                            <img src={p.images[0]} alt={p.title} className="w-10 h-12 object-cover bg-gray-100" />
                            <div>
                              <p className="font-serif font-bold text-sm text-[#24211E]">{p.title}</p>
                              <p className="text-[11px] text-[#736B5E]">{p.collection}</p>
                            </div>
                          </td>
                          <td className="p-3 font-medium text-[#5C5549]">{p.category}</td>
                          <td className="p-3">
                            {p.isOnSale && p.salePrice ? (
                              <div>
                                <span className="font-bold text-[#0F4C5C]">₹{p.salePrice.toLocaleString('en-IN')}</span>
                                <span className="text-[10px] text-[#8A8175] line-through ml-1.5">₹{p.price.toLocaleString('en-IN')}</span>
                              </div>
                            ) : (
                              <span className="font-bold text-[#24211E]">₹{p.price.toLocaleString('en-IN')}</span>
                            )}
                          </td>
                          <td className="p-3 font-semibold text-[#24211E]">{p.totalInventory} units</td>
                          <td className="p-3">
                            {p.isReadyToShip ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#2D5A46] text-white text-[10px] font-semibold uppercase">
                                <Sparkles className="w-2.5 h-2.5" />
                                Ready
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-[10px] font-medium uppercase">
                                Made to Order
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setProductEditing(p);
                                  setIsCreatingNew(false);
                                }}
                                className="p-1.5 text-[#0F4C5C] hover:bg-[#0F4C5C]/10 transition-colors"
                                title="Edit Product"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeleteProduct(p.id)}
                                className="p-1.5 text-[#C08081] hover:bg-rose-50 transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Orders Management */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-[#E8DFD5] shadow-xs overflow-hidden space-y-4">
            <div className="p-4 border-b border-[#E8DFD5] bg-[#FAF7F2] flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#24211E]">Client Orders & Fulfillment</h3>
              <span className="text-xs text-[#8C6D37]">{orders.length} Total Orders Registered</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAF7F2] border-b border-[#E8DFD5] text-[#8C6D37] font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Order Number</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Current Status</th>
                    <th className="p-3">Courier AWB</th>
                    <th className="p-3 text-right">Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DFD5]">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#FAF7F2]/60">
                      <td className="p-3 font-mono font-bold text-[#0F4C5C]">
                        {ord.orderNumber}
                        {ord.returnRequest && (
                          <span className={`block text-[9px] font-sans font-bold px-1.5 py-0.2 mt-0.5 rounded-xs w-fit ${
                            ord.returnRequest.status === 'Pending'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : ord.returnRequest.status === 'Approved'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-rose-100 text-rose-900'
                          }`}>
                            {ord.returnRequest.requestType}: {ord.returnRequest.status}
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <p className="font-semibold text-[#24211E]">{ord.customerName}</p>
                        <p className="text-[11px] text-[#736B5E]">{ord.customerEmail}</p>
                      </td>
                      <td className="p-3 text-[#5C5549]">{ord.items.length} item(s)</td>
                      <td className="p-3 font-bold text-[#24211E]">₹{ord.total.toLocaleString('en-IN')}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                          ord.status === 'Delivered' 
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'Shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.status.includes('Return') || ord.status.includes('Exchange')
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-[#736B5E]">{ord.trackingNumber}</td>
                      <td className="p-3 text-right space-x-1.5">
                        {ord.returnRequest && ord.returnRequest.status === 'Pending' && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab('returns');
                              fetchReturnRequests();
                            }}
                            className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold uppercase tracking-wider cursor-pointer"
                          >
                            Review Request
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrderToUpdate(ord);
                            setNewStatus(ord.status);
                            setNewTracking(ord.trackingNumber);
                          }}
                          className="px-2.5 py-1 bg-[#0F4C5C] text-white text-[11px] font-semibold uppercase tracking-wider cursor-pointer"
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Status Update Modal */}
            {selectedOrderToUpdate && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white max-w-md w-full p-6 border border-[#D4C7B5] shadow-2xl space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h4 className="font-serif text-lg font-bold text-[#24211E]">
                      Update Order: {selectedOrderToUpdate.orderNumber}
                    </h4>
                    <button type="button" onClick={() => setSelectedOrderToUpdate(null)}>✕</button>
                  </div>

                  <form onSubmit={handleStatusSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#5C5549] mb-1">Status Transition</label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as any)}
                        className="w-full p-2 border border-[#D4C7B5] text-xs"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing (Quality Check & Packing)</option>
                        <option value="Shipped">Shipped (Dispatched with Blue Dart)</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered to Recipient</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#5C5549] mb-1">Courier Tracking AWB</label>
                      <input
                        type="text"
                        value={newTracking}
                        onChange={(e) => setNewTracking(e.target.value)}
                        className="w-full p-2 border border-[#D4C7B5] font-mono text-xs"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedOrderToUpdate(null)}
                        className="px-4 py-2 border text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#0F4C5C] text-white text-xs font-semibold uppercase tracking-wider"
                      >
                        Save Status
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Client Return & Exchange Management (User Request: Admin can approve or cancel) */}
        {activeTab === 'returns' && (
          <div className="space-y-6">
            {/* Header & Metrics */}
            <div className="bg-white border border-[#E8DFD5] p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FAF7F2] pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-5 h-5 text-[#0F4C5C]" />
                    <h3 className="font-serif text-xl font-bold text-[#24211E]">
                      Client Return & Exchange Management
                    </h3>
                  </div>
                  <p className="text-xs text-[#736B5E] mt-1">
                    Review client reasons, approve reverse pickup, or cancel/reject requests under atelier policies.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={fetchReturnRequests}
                  disabled={isLoadingReturns}
                  className="px-4 py-2 border border-[#D4C7B5] bg-[#FAF7F2] hover:bg-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 text-[#5C5549] transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingReturns ? 'animate-spin text-[#0F4C5C]' : ''}`} />
                  <span>Refresh Requests</span>
                </button>
              </div>

              {/* Metrics Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5">
                <div className="p-3 bg-[#FAF7F2] border border-[#E8DFD5]">
                  <p className="text-[10px] uppercase font-bold text-[#736B5E] tracking-wider">Total Requests</p>
                  <p className="text-2xl font-serif font-bold text-[#24211E]">{returnRequests.length}</p>
                </div>
                <div className="p-3 bg-amber-50/60 border border-amber-200">
                  <p className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">Pending Review</p>
                  <p className="text-2xl font-serif font-bold text-amber-900">
                    {returnRequests.filter(r => r.status === 'Pending').length}
                  </p>
                </div>
                <div className="p-3 bg-emerald-50/60 border border-emerald-200">
                  <p className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Approved</p>
                  <p className="text-2xl font-serif font-bold text-emerald-900">
                    {returnRequests.filter(r => r.status === 'Approved').length}
                  </p>
                </div>
                <div className="p-3 bg-rose-50/60 border border-rose-200">
                  <p className="text-[10px] uppercase font-bold text-rose-800 tracking-wider">Cancelled / Rejected</p>
                  <p className="text-2xl font-serif font-bold text-rose-900">
                    {returnRequests.filter(r => r.status === 'Rejected' || r.status === 'Cancelled').length}
                  </p>
                </div>
              </div>

              {/* Filter and Search */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5">
                <div className="relative sm:col-span-2">
                  <input
                    type="text"
                    value={returnSearch}
                    onChange={(e) => setReturnSearch(e.target.value)}
                    placeholder="Search by client name, order number, reason..."
                    className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>

                <div>
                  <select
                    value={returnStatusFilter}
                    onChange={(e) => setReturnStatusFilter(e.target.value as any)}
                    className="w-full py-2 px-3 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none"
                  >
                    <option value="all">All Request Statuses</option>
                    <option value="Pending">Pending Review Only</option>
                    <option value="Approved">Approved Requests</option>
                    <option value="Rejected">Cancelled / Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Requests List */}
            {isLoadingReturns ? (
              <div className="bg-white border border-[#E8DFD5] p-12 text-center">
                <RefreshCw className="w-8 h-8 text-[#0F4C5C] animate-spin mx-auto mb-2" />
                <p className="text-xs text-[#736B5E]">Loading return and exchange dossiers...</p>
              </div>
            ) : returnRequests.length === 0 ? (
              <div className="bg-white border border-[#E8DFD5] p-12 text-center space-y-2">
                <RotateCcw className="w-10 h-10 text-[#D4C7B5] mx-auto" />
                <h4 className="font-serif text-lg font-bold text-[#24211E]">No Return or Exchange Requests Yet</h4>
                <p className="text-xs text-[#736B5E]">
                  When customers initiate a return or exchange from their order tracking portal, it will be queued here for your approval or cancellation.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {returnRequests
                  .filter(req => {
                    if (returnStatusFilter !== 'all' && req.status !== returnStatusFilter) return false;
                    if (returnSearch) {
                      const q = returnSearch.toLowerCase();
                      const matchOrder = req.orderNumber?.toLowerCase().includes(q);
                      const matchName = req.customerName?.toLowerCase().includes(q);
                      const matchReason = req.reason?.toLowerCase().includes(q);
                      const matchNote = req.clientNote?.toLowerCase().includes(q);
                      if (!matchOrder && !matchName && !matchReason && !matchNote) return false;
                    }
                    return true;
                  })
                  .map((req) => (
                    <div
                      key={req.id}
                      className={`bg-white border p-5 shadow-xs transition-all space-y-4 ${
                        req.status === 'Pending'
                          ? 'border-amber-300 ring-1 ring-amber-200/60'
                          : req.status === 'Approved'
                            ? 'border-emerald-300'
                            : 'border-gray-200'
                      }`}
                    >
                      {/* Top Bar: Header & Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#FAF7F2]">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          {/* Request Type Badge */}
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                            req.requestType === 'Exchange'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-teal-50 text-[#0F4C5C] border border-[#0F4C5C]/20'
                          }`}>
                            <RotateCcw className="w-3 h-3" />
                            <span>{req.requestType} Request</span>
                          </span>

                          {/* Order Number */}
                          <span className="font-mono text-xs font-bold text-[#24211E]">
                            Order: {req.orderNumber}
                          </span>

                          {/* Status Badge */}
                          <span className={`px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                            req.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800 animate-pulse'
                              : req.status === 'Approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                          }`}>
                            {req.status === 'Pending' ? 'Pending Approval' : req.status}
                          </span>

                          <span className="text-[11px] text-[#8A8175] flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" />
                            {new Date(req.createdAt).toLocaleString()}
                          </span>
                        </div>

                        {/* Admin Action Buttons (User Requirement: Approve or Cancel) */}
                        {req.status === 'Pending' ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenActionModal(req, 'approve')}
                              className="px-3 py-1.5 bg-[#2D5A46] hover:bg-[#234737] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve Request</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenActionModal(req, 'reject')}
                              className="px-3 py-1.5 border border-rose-400 text-rose-700 hover:bg-rose-50 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Cancel / Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-[#736B5E] font-medium">
                            Processed: {req.updatedAt ? new Date(req.updatedAt).toLocaleDateString() : 'Yes'}
                          </span>
                        )}
                      </div>

                      {/* Request Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                        {/* Customer Info */}
                        <div className="md:col-span-4 space-y-2 border-r md:border-[#E8DFD5] md:pr-4">
                          <p className="font-serif text-base font-bold text-[#24211E]">{req.customerName}</p>
                          <div className="space-y-1 text-xs text-[#5C5549]">
                            <p className="flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5 text-[#8C6D37]" />
                              <a href={`mailto:${req.customerEmail}`} className="hover:underline text-[#0F4C5C]">
                                {req.customerEmail}
                              </a>
                            </p>
                            {req.customerPhone && (
                              <p className="flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-[#8C6D37]" />
                                <a href={`tel:${req.customerPhone}`} className="hover:underline">
                                  {req.customerPhone}
                                </a>
                              </p>
                            )}
                          </div>

                          {/* Ensembles in Order */}
                          <div className="pt-2 border-t border-[#E8DFD5]">
                            <p className="text-[10px] uppercase font-bold text-[#736B5E] tracking-wider mb-1.5">
                              Ensembles in Order:
                            </p>
                            <div className="space-y-1.5">
                              {req.items?.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs">
                                  {item.image && (
                                    <img src={item.image} alt={item.productTitle} className="w-8 h-9 object-cover rounded-xs border border-gray-200" />
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <p className="font-medium text-[#24211E] truncate">{item.productTitle}</p>
                                    <p className="text-[10px] text-[#736B5E]">Size: {item.size} • Qty: {item.quantity}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Reason & Client Request details */}
                        <div className="md:col-span-8 space-y-3">
                          <div className="p-3.5 bg-[#FAF7F2] border border-[#E8DFD5] space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C6D37]">
                                Customer Stated Reason:
                              </span>
                              {req.exchangeSize && (
                                <span className="bg-white border border-[#D4C7B5] px-2 py-0.5 text-[11px] font-bold text-[#0F4C5C]">
                                  Requested Exchange Size: {req.exchangeSize}
                                </span>
                              )}
                            </div>
                            <p className="font-semibold text-sm text-[#24211E]">{req.reason}</p>

                            {req.clientNote && (
                              <div className="pt-2 border-t border-[#E8DFD5]/70">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-[#736B5E] block mb-0.5">
                                  Client Additional Notes:
                                </span>
                                <p className="italic bg-white p-2 border border-[#E8DFD5] text-[#4A4339]">
                                  "{req.clientNote}"
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Admin Resolution Dossier */}
                          {req.adminNote && (
                            <div className={`p-3 border text-xs space-y-1 ${
                              req.status === 'Approved'
                                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                                : 'bg-rose-50/70 border-rose-200 text-rose-900'
                            }`}>
                              <p className="font-bold flex items-center gap-1.5">
                                {req.status === 'Approved' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
                                Atelier Admin Decision:
                              </p>
                              <p>{req.adminNote}</p>
                              {req.pickupScheduledDate && (
                                <p className="text-[11px] font-semibold text-emerald-800 pt-0.5">
                                  Scheduled Reverse Pickup Date: {req.pickupScheduledDate} via Blue Dart Luxury Express
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Admin Action Confirmation Modal (Approve or Reject) */}
            {selectedRequestForAction && (
              <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white max-w-lg w-full border border-[#D4C7B5] shadow-2xl p-6 space-y-4 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center border-b border-[#E8DFD5] pb-3">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#24211E]">
                        {selectedRequestForAction.actionType === 'approve' ? 'Approve Client Request' : 'Cancel / Reject Client Request'}
                      </h4>
                      <p className="text-xs text-[#8C6D37] mt-0.5">
                        Order #{selectedRequestForAction.request.orderNumber} • {selectedRequestForAction.request.customerName}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedRequestForAction(null)}
                      className="text-gray-400 hover:text-gray-700 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="p-3 bg-[#FAF7F2] border border-[#E8DFD5] text-xs space-y-1">
                    <p className="font-bold text-[#24211E]">
                      Request: {selectedRequestForAction.request.requestType}
                    </p>
                    <p className="text-[#5C5549]">Reason: {selectedRequestForAction.request.reason}</p>
                    {selectedRequestForAction.request.exchangeSize && (
                      <p className="text-[#0F4C5C] font-semibold">
                        Desired Replacement Size: {selectedRequestForAction.request.exchangeSize}
                      </p>
                    )}
                  </div>

                  {/* If Approving, schedule reverse pickup date */}
                  {selectedRequestForAction.actionType === 'approve' && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5C5549] mb-1">
                        Scheduled Reverse Courier Pickup Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={pickupDate}
                          onChange={(e) => setPickupDate(e.target.value)}
                          className="w-full p-2 border border-[#D4C7B5] text-xs bg-[#FAF7F2] focus:outline-none focus:border-[#0F4C5C]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Admin Note / Communication message to customer */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5C5549] mb-1">
                      {selectedRequestForAction.actionType === 'approve' ? 'Approval & Pickup Instructions' : 'Reason for Cancellation / Rejection'} *
                    </label>
                    <textarea
                      rows={3}
                      value={adminActionNote}
                      onChange={(e) => setAdminActionNote(e.target.value)}
                      className="w-full p-2 border border-[#D4C7B5] text-xs bg-[#FAF7F2] focus:outline-none focus:border-[#0F4C5C]"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8DFD5]">
                    <button
                      type="button"
                      onClick={() => setSelectedRequestForAction(null)}
                      className="px-4 py-2 border border-[#D4C7B5] text-xs font-semibold text-[#5C5549] hover:bg-gray-50 cursor-pointer"
                    >
                      Dismiss
                    </button>

                    <button
                      type="button"
                      onClick={handleConfirmReturnAction}
                      disabled={isSubmittingAction}
                      className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-sm flex items-center gap-2 cursor-pointer transition-colors ${
                        selectedRequestForAction.actionType === 'approve'
                          ? 'bg-[#2D5A46] hover:bg-[#234737]'
                          : 'bg-rose-700 hover:bg-rose-800'
                      }`}
                    >
                      {isSubmittingAction && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                      <span>
                        {selectedRequestForAction.actionType === 'approve' ? 'Confirm Approval' : 'Confirm Cancellation'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Sale Announcement & Banner Manager */}
        {activeTab === 'announcement' && (
          <div className="bg-white border border-[#E8DFD5] p-6 sm:p-8 shadow-xs max-w-2xl mx-auto space-y-6">
            <div>
              <div className="flex items-center gap-2 text-[#0F4C5C] mb-1">
                <Megaphone className="w-5 h-5" />
                <h3 className="font-serif text-2xl font-bold text-[#24211E]">
                  Sale Announcement & Customer Alert Center
                </h3>
              </div>
              <p className="text-xs text-[#736B5E]">
                The text and sale status updated here instantly appears across all customer storefront headers in real-time.
              </p>
            </div>

            {announcementSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-[#2D5A46] flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Storefront announcement successfully broadcast to all shoppers!</span>
              </div>
            )}

            <form onSubmit={handleAnnouncementSubmit} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C5549] mb-1">
                  Announcement Message Banner *
                </label>
                <textarea
                  rows={3}
                  required
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="e.g. Mid-Season Atelier Sale: Up to 25% off Curated Heirloom Weaves"
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
                />
              </div>

              <div className="p-4 bg-[#FAF7F2] border border-[#E8DFD5] space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSaleActive}
                    onChange={(e) => setIsSaleActive(e.target.checked)}
                    className="accent-[#C08081] w-4 h-4"
                  />
                  <div>
                    <p className="text-xs font-bold text-[#24211E]">Active Flash / Seasonal Sale</p>
                    <p className="text-[11px] text-[#736B5E]">Shows high-contrast 'Exclusive' badge on customer storefront.</p>
                  </div>
                </label>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C5549] mb-1">
                    Sale Headline / Tagline
                  </label>
                  <input
                    type="text"
                    value={saleHighlight}
                    onChange={(e) => setSaleHighlight(e.target.value)}
                    placeholder="e.g. Mid-Season Atelier Sale: Up to 25% Off"
                    className="w-full p-2 bg-white border border-[#D4C7B5] text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Live Preview of Announcement Bar */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C6D37] block mb-1">Live Storefront Header Preview</span>
                <div className="bg-[#0F4C5C] text-[#FAF7F2] text-xs tracking-wider py-2.5 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {isSaleActive && (
                      <span className="bg-[#C08081] text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5">
                        Exclusive
                      </span>
                    )}
                    <span className="font-light">{announcementText}</span>
                    <span className="underline ml-1 font-medium">Explore Now</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-[0.16em] shadow-md transition-colors cursor-pointer"
              >
                Broadcast Announcement to Storefront
              </button>
            </form>
          </div>
        )}

        {/* Tab: Customer Inquiries Queue Module */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E8DFD5] p-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E8DFD5]">
                <div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#0F4C5C]" />
                    <h3 className="font-serif text-xl font-bold text-[#24211E]">
                      Customer Inquiries & Atelier Concierge Queue
                    </h3>
                  </div>
                  <p className="text-xs text-[#736B5E] mt-1">
                    Manage incoming requests from the Homepage Concierge and Customised Clothing Studio.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={fetchInquiries}
                  disabled={isLoadingInquiries}
                  className="px-4 py-2 border border-[#D4C7B5] bg-[#FAF7F2] hover:bg-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 text-[#5C5549] transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingInquiries ? 'animate-spin text-[#0F4C5C]' : ''}`} />
                  <span>Refresh Queue</span>
                </button>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5">
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    value={inquirySearch}
                    onChange={(e) => setInquirySearch(e.target.value)}
                    placeholder="Search customer, email, notes..."
                    className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>

                {/* Source Filter */}
                <div>
                  <select
                    value={inquirySourceFilter}
                    onChange={(e) => setInquirySourceFilter(e.target.value as any)}
                    className="w-full py-2 px-3 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none"
                  >
                    <option value="all">All Sources</option>
                    <option value="Homepage Inquiry">Homepage Inquiry</option>
                    <option value="Customisation Inquiry">Customisation Inquiry</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    value={inquiryStatusFilter}
                    onChange={(e) => setInquiryStatusFilter(e.target.value as any)}
                    className="w-full py-2 px-3 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="New">New</option>
                    <option value="In Review">In Review</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Inquiries Queue Items */}
            {isLoadingInquiries ? (
              <div className="bg-white border border-[#E8DFD5] p-12 text-center">
                <RefreshCw className="w-8 h-8 text-[#0F4C5C] animate-spin mx-auto mb-2" />
                <p className="text-xs text-[#736B5E]">Loading concierge inquiries...</p>
              </div>
            ) : inquiries.length === 0 ? (
              <div className="bg-white border border-[#E8DFD5] p-12 text-center space-y-2">
                <MessageSquare className="w-10 h-10 text-[#D4C7B5] mx-auto" />
                <h4 className="font-serif text-lg font-bold text-[#24211E]">No Inquiries in Queue</h4>
                <p className="text-xs text-[#736B5E]">
                  Customer requests from the Contact Concierge or Custom Studio will appear here in real-time.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries
                  .filter(inq => {
                    if (inquirySourceFilter !== 'all' && inq.source !== inquirySourceFilter) return false;
                    if (inquiryStatusFilter !== 'all' && inq.status !== inquiryStatusFilter) return false;
                    if (inquirySearch) {
                      const q = inquirySearch.toLowerCase();
                      const matchName = inq.customerName?.toLowerCase().includes(q);
                      const matchEmail = inq.customerEmail?.toLowerCase().includes(q);
                      const matchMsg = inq.message?.toLowerCase().includes(q);
                      const matchGarment = inq.designPreferences?.garmentType?.toLowerCase().includes(q);
                      if (!matchName && !matchEmail && !matchMsg && !matchGarment) return false;
                    }
                    return true;
                  })
                  .map((inq) => {
                    const isCustom = inq.source === 'Customisation Inquiry';
                    return (
                      <div 
                        key={inq.id}
                        className="bg-white border border-[#E8DFD5] p-5 shadow-xs hover:border-[#D4C7B5] transition-all space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#FAF7F2]">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            {/* Source Badge */}
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                              isCustom 
                                ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                                : 'bg-[#EBF3F5] text-[#0F4C5C] border border-[#0F4C5C]/20'
                            }`}>
                              {isCustom ? <Sparkles className="w-3 h-3 text-amber-700" /> : <Mail className="w-3 h-3 text-[#0F4C5C]" />}
                              <span>{inq.source}</span>
                            </span>

                            {/* Status Badge */}
                            <span className={`px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                              inq.status === 'New'
                                ? 'bg-rose-100 text-rose-800'
                                : inq.status === 'In Review'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {inq.status}
                            </span>

                            <span className="text-[11px] text-[#8A8175] flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3" />
                              {new Date(inq.createdAt).toLocaleString()}
                            </span>
                          </div>

                          {/* Quick Status Updater */}
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-[#736B5E] font-medium">Update Status:</span>
                            <select
                              value={inq.status}
                              onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as any)}
                              className="text-xs bg-[#FAF7F2] border border-[#D4C7B5] px-2 py-1 font-semibold focus:outline-none"
                            >
                              <option value="New">New</option>
                              <option value="In Review">In Review</option>
                              <option value="Resolved">Resolved</option>
                            </select>
                          </div>
                        </div>

                        {/* Customer Details & Body */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                          {/* Contact info column */}
                          <div className="md:col-span-4 space-y-1.5 border-r md:border-[#E8DFD5] md:pr-4">
                            <p className="font-serif text-base font-bold text-[#24211E]">{inq.customerName}</p>
                            <div className="flex items-center gap-2 text-xs text-[#5C5549]">
                              <Mail className="w-3.5 h-3.5 text-[#8C6D37]" />
                              <a href={`mailto:${inq.customerEmail}`} className="hover:underline text-[#0F4C5C]">
                                {inq.customerEmail}
                              </a>
                            </div>
                            {inq.customerPhone && (
                              <div className="flex items-center gap-2 text-xs text-[#5C5549]">
                                <Phone className="w-3.5 h-3.5 text-[#8C6D37]" />
                                <a href={`tel:${inq.customerPhone}`} className="hover:underline">
                                  {inq.customerPhone}
                                </a>
                              </div>
                            )}
                          </div>

                          {/* Custom Specs / Preferences & Message */}
                          <div className="md:col-span-8 space-y-3">
                            {/* Customisation Specs */}
                            {inq.designPreferences && (
                              <div className="p-3 bg-[#FAF7F2] border border-[#E8DFD5] text-xs space-y-1.5">
                                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C6D37] block">
                                  Custom Atelier Preferences
                                </span>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[#4A4339]">
                                  {inq.designPreferences.garmentType && (
                                    <div>
                                      <span className="text-[10px] text-gray-500 block">Garment:</span>
                                      <span className="font-semibold">{inq.designPreferences.garmentType}</span>
                                    </div>
                                  )}
                                  {inq.designPreferences.fabricPreference && (
                                    <div>
                                      <span className="text-[10px] text-gray-500 block">Fabric:</span>
                                      <span className="font-semibold">{inq.designPreferences.fabricPreference}</span>
                                    </div>
                                  )}
                                  {inq.designPreferences.colorPreference && (
                                    <div>
                                      <span className="text-[10px] text-gray-500 block">Color Palette:</span>
                                      <span className="font-semibold">{inq.designPreferences.colorPreference}</span>
                                    </div>
                                  )}
                                  {inq.designPreferences.budgetRange && (
                                    <div>
                                      <span className="text-[10px] text-gray-500 block">Budget:</span>
                                      <span className="font-semibold">{inq.designPreferences.budgetRange}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Message / Notes */}
                            {inq.message && (
                              <div className="text-xs text-[#24211E]">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-[#736B5E] block mb-0.5">
                                  Customer Request / Notes:
                                </span>
                                <p className="italic bg-white p-2.5 border border-[#E8DFD5] rounded-xs text-[#4A4339]">
                                  "{inq.message}"
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: PostgreSQL Database Architecture */}
        {activeTab === 'schema' && (
          <DatabaseSchemaViewer />
        )}
      </div>
    </div>
  );
};
