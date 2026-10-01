import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  Plus, 
  RefreshCw, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  AlertCircle, 
  ShoppingBag, 
  Trash2, 
  Edit2, 
  X, 
  Mail, 
  Phone, 
  Calendar,
  Shield
} from 'lucide-react';
import { User, UserRole, AccountStatus } from '../../types';

interface ManagedUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'ADMIN' | 'USER';
  status: 'ACTIVE' | 'SUSPENDED' | 'REVOKED';
  createdAt: string;
  lastLoginAt?: string;
  ordersCount: number;
  totalSpend: number;
}

export const CustomerAccessManagement: React.FC = () => {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED' | 'REVOKED'>('ALL');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'USER' | 'ADMIN'>('ALL');

  // Notification Toast
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Provision User Modal State
  const [isProvisionOpen, setIsProvisionOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'USER' | 'ADMIN'>('USER');
  const [newStatus, setNewStatus] = useState<'ACTIVE' | 'SUSPENDED' | 'REVOKED'>('ACTIVE');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Confirmation Modal State for Role or Status Modification
  const [actionTarget, setActionTarget] = useState<{
    user: ManagedUser;
    action: 'grant' | 'suspend' | 'revoke' | 'toggle-role' | 'delete';
  } | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('aaru_auth_token');
      const res = await fetch('/api/admin/users', {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error('Access denied. Administrator privileges required.');
        }
        throw new Error('Failed to load user records.');
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Error fetching user directory.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateStatus = async (user: ManagedUser, newStatus: AccountStatus) => {
    try {
      const token = localStorage.getItem('aaru_auth_token');
      const res = await fetch(`/api/admin/users/${encodeURIComponent(user.id)}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update access status.');
      }

      setNotification({
        type: 'success',
        message: newStatus === 'ACTIVE'
          ? `Status restored to ACTIVE for ${user.email}.`
          : `Status set to ${newStatus} for ${user.email}.`
      });
      setActionTarget(null);
      fetchUsers();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Status update failed.' });
    }
  };

  const handleUpdateRole = async (user: ManagedUser, newRole: 'USER' | 'ADMIN') => {
    try {
      const token = localStorage.getItem('aaru_auth_token');
      const res = await fetch(`/api/admin/users/${encodeURIComponent(user.id)}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ role: newRole })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update user role.');
      }

      setNotification({
        type: 'success',
        message: `Account role for ${user.email} updated to ${newRole}.`
      });
      setActionTarget(null);
      fetchUsers();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Role update failed.' });
    }
  };

  const handleDeleteUser = async (user: ManagedUser) => {
    try {
      const token = localStorage.getItem('aaru_auth_token');
      const res = await fetch(`/api/admin/users/${encodeURIComponent(user.id)}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete account.');
      }

      setNotification({
        type: 'success',
        message: `Account ${user.email} has been removed permanently.`
      });
      setActionTarget(null);
      fetchUsers();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Account removal failed.' });
    }
  };

  const handleProvisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newName || !newPassword) {
      setNotification({ type: 'error', message: 'Please fill in Name, Email, and Password.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('aaru_auth_token');
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          phone: newPhone,
          password: newPassword,
          role: newRole,
          status: newStatus
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to provision account.');
      }

      setNotification({
        type: 'success',
        message: `New account created successfully for ${newName} (${newEmail}).`
      });
      setIsProvisionOpen(false);
      setNewName('');
      setNewEmail('');
      setNewPhone('');
      setNewPassword('');
      setNewRole('USER');
      setNewStatus('ACTIVE');
      fetchUsers();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Provisioning failed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phone && u.phone.includes(q))
    );

    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const totalUsers = users.length;
  const activeCount = users.filter(u => u.status === 'ACTIVE').length;
  const revokedCount = users.filter(u => u.status === 'REVOKED' || u.status === 'SUSPENDED').length;
  const adminCount = users.filter(u => u.role === 'ADMIN').length;

  return (
    <div id="customer-access-management" className="space-y-6">
      {/* Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-[#E8DFD5] p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-[#0F4C5C]" />
            <h2 className="font-serif text-xl font-bold text-[#24211E]">
              Customer Access & Account Security Management
            </h2>
          </div>
          <p className="text-xs text-[#736B5E] max-w-2xl">
            Audit, grant, revoke, or suspend patron access permissions. Enforce role-based access control (RBAC) across customer storefront and atelier administration routes.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={fetchUsers}
            disabled={isLoading}
            className="p-2.5 bg-[#FAF7F2] hover:bg-[#F5EFE6] border border-[#D4C7B5] text-[#24211E] transition-colors cursor-pointer text-xs flex items-center gap-1.5"
            title="Refresh User Directory"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#0F4C5C]' : ''}`} />
            <span className="hidden sm:inline font-semibold">Refresh</span>
          </button>

          <button
            id="btn-provision-account"
            type="button"
            onClick={() => setIsProvisionOpen(true)}
            className="px-4 py-2.5 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Provision Account</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E8DFD5] p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C6D37]">Total Registered</span>
            <Users className="w-4 h-4 text-[#8C6D37]" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#24211E] mt-1">{totalUsers}</p>
          <p className="text-[11px] text-[#736B5E] mt-0.5">Database patrons & staff</p>
        </div>

        <div className="bg-white border border-[#E8DFD5] p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700">Active Access</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif text-2xl font-bold text-emerald-700 mt-1">{activeCount}</p>
          <p className="text-[11px] text-[#736B5E] mt-0.5">Authorized for commerce & orders</p>
        </div>

        <div className="bg-white border border-[#E8DFD5] p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-rose-700">Access Restricted</span>
            <UserX className="w-4 h-4 text-rose-600" />
          </div>
          <p className="font-serif text-2xl font-bold text-rose-700 mt-1">{revokedCount}</p>
          <p className="text-[11px] text-[#736B5E] mt-0.5">Suspended or revoked patrons</p>
        </div>

        <div className="bg-white border border-[#E8DFD5] p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#0F4C5C]">Administrators</span>
            <Shield className="w-4 h-4 text-[#0F4C5C]" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#0F4C5C] mt-1">{adminCount}</p>
          <p className="text-[11px] text-[#736B5E] mt-0.5">Full atelier access permissions</p>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`p-4 border flex items-start justify-between gap-3 animate-in fade-in duration-200 ${
          notification.type === 'success' 
            ? 'bg-[#F0FDF4] border-[#86EFAC] text-[#166534]' 
            : 'bg-[#FEF2F2] border-[#F87171] text-[#991B1B]'
        }`}>
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <p className="text-xs font-medium">{notification.message}</p>
          </div>
          <button 
            type="button" 
            onClick={() => setNotification(null)}
            className="text-xs font-bold opacity-60 hover:opacity-100 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="bg-white border border-[#E8DFD5] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            id="user-search-input"
            type="text"
            placeholder="Search by patron name, email, or mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FAF9F5] border border-[#D4C7B5] focus:border-[#0F4C5C] focus:bg-white text-xs text-[#24211E] placeholder:text-[#8A8175] focus:outline-none transition-colors"
          />
          <Search className="w-4 h-4 text-[#8C6D37] absolute left-3 top-2.5 pointer-events-none" />
        </div>

        {/* Status & Role Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#736B5E] font-medium text-[11px] uppercase tracking-wider">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-[#FAF9F5] border border-[#D4C7B5] px-2.5 py-1.5 text-xs text-[#24211E] focus:outline-none focus:border-[#0F4C5C]"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="REVOKED">Revoked</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#736B5E] font-medium text-[11px] uppercase tracking-wider">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="bg-[#FAF9F5] border border-[#D4C7B5] px-2.5 py-1.5 text-xs text-[#24211E] focus:outline-none focus:border-[#0F4C5C]"
            >
              <option value="ALL">All Roles</option>
              <option value="USER">Standard User</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Directory Table */}
      <div className="bg-white border border-[#E8DFD5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E8DFD5] text-[#8C6D37] uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-4">Patron / Identity</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Access Status</th>
                <th className="py-3 px-4">Orders & Spend</th>
                <th className="py-3 px-4">Member Since</th>
                <th className="py-3 px-4 text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFD5]">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const isRootAdmin = user.email.toLowerCase() === 'aarubymoni@admin.co.in';

                  return (
                    <tr key={user.id} className="hover:bg-[#FAF9F5] transition-colors">
                      {/* Identity */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-serif text-sm font-bold shadow-2xs shrink-0 ${
                            user.role === 'ADMIN'
                              ? 'bg-[#0F4C5C] text-[#FAF7F2]'
                              : 'bg-[#F5EFE6] text-[#8C6D37] border border-[#E8DFD5]'
                          }`}>
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-semibold text-[#24211E] truncate">{user.name}</p>
                              {isRootAdmin && (
                                <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-bold uppercase tracking-wider">
                                  Root Admin
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-[#736B5E] mt-0.5">
                              <span className="truncate">{user.email}</span>
                              {user.phone && (
                                <>
                                  <span>•</span>
                                  <span>{user.phone}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          user.role === 'ADMIN'
                            ? 'bg-[#0F4C5C] text-white'
                            : 'bg-[#F5EFE6] text-[#5C5549] border border-[#D4C7B5]'
                        }`}>
                          {user.role === 'ADMIN' && <Shield className="w-3 h-3" />}
                          {user.role}
                        </span>
                      </td>

                      {/* Access Status Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          user.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                            : user.status === 'SUSPENDED'
                            ? 'bg-amber-50 text-amber-800 border border-amber-300'
                            : 'bg-rose-50 text-rose-800 border border-rose-300'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            user.status === 'ACTIVE'
                              ? 'bg-emerald-600'
                              : user.status === 'SUSPENDED'
                              ? 'bg-amber-500'
                              : 'bg-rose-600'
                          }`} />
                          {user.status}
                        </span>
                      </td>

                      {/* Orders & Spend */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs">
                          <span className="font-semibold text-[#24211E]">{user.ordersCount} Orders</span>
                          {user.totalSpend > 0 && (
                            <p className="text-[11px] text-[#8C6D37]">₹{user.totalSpend.toLocaleString('en-IN')}</p>
                          )}
                        </div>
                      </td>

                      {/* Member Since */}
                      <td className="py-3.5 px-4 text-[#736B5E] text-[11px]">
                        <div>{new Date(user.createdAt).toLocaleDateString()}</div>
                        {user.lastLoginAt && (
                          <div className="text-[10px] text-[#8A8175] mt-0.5">
                            Last active: {new Date(user.lastLoginAt).toLocaleDateString()}
                          </div>
                        )}
                      </td>

                      {/* Access Controls Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          {!isRootAdmin ? (
                            <>
                              {/* 1. SUSPEND: sends request to set status to suspended */}
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(user, 'SUSPENDED')}
                                className="px-2.5 py-1.5 bg-white hover:bg-amber-50 border border-[#F59E0B] text-[#B45309] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                                title="Set status to Suspended"
                              >
                                <Lock className="w-3.5 h-3.5 text-[#D97706]" />
                                <span>SUSPEND</span>
                              </button>

                              {/* 2. REVOKE: sends request to restore status to active */}
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(user, 'ACTIVE')}
                                className="px-2.5 py-1.5 bg-white hover:bg-rose-50 border border-[#FDA4AF] text-[#9F1239] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                                title="Restore status to Active"
                              >
                                <UserX className="w-3.5 h-3.5 text-[#BE185D]" />
                                <span>REVOKE</span>
                              </button>

                              {/* 3. MAKE ADMIN / MAKE USER TOGGLE: sends exact new role to backend */}
                              <button
                                type="button"
                                onClick={() => {
                                  const exactNewRole: 'USER' | 'ADMIN' = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
                                  handleUpdateRole(user, exactNewRole);
                                }}
                                className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F5EFE6] border border-[#D4C7B5] text-[#1E293B] text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors shadow-2xs"
                                title={`Set role to ${user.role === 'ADMIN' ? 'USER' : 'ADMIN'}`}
                              >
                                <span>{user.role === 'ADMIN' ? 'MAKE USER' : 'MAKE ADMIN'}</span>
                              </button>

                              {/* 4. Delete Account */}
                              <button
                                type="button"
                                onClick={() => setActionTarget({ user, action: 'delete' })}
                                className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Delete account"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-[#8C6D37] italic pr-2">Protected</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#736B5E]">
                    <Users className="w-8 h-8 text-[#D4C7B5] mx-auto mb-2" />
                    <p className="text-xs font-semibold">No accounts match the selected filters.</p>
                    <p className="text-[11px] text-[#8C6D37] mt-1">Try resetting the search query or status filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision Account Modal */}
      {isProvisionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-[#D4C7B5] shadow-2xl p-6 relative">
            <button
              type="button"
              onClick={() => setIsProvisionOpen(false)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E8DFD5]">
              <Plus className="w-5 h-5 text-[#0F4C5C]" />
              <h3 className="font-serif text-lg font-bold text-[#24211E]">
                Provision Patron / Admin Account
              </h3>
            </div>

            <form onSubmit={handleProvisionSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Sen"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#D4C7B5] focus:border-[#0F4C5C] text-xs text-[#24211E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. radhika.sen@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#D4C7B5] focus:border-[#0F4C5C] text-xs text-[#24211E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  placeholder="+91 98450 12345"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#D4C7B5] focus:border-[#0F4C5C] text-xs text-[#24211E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider mb-1">
                  Initial Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#D4C7B5] focus:border-[#0F4C5C] text-xs text-[#24211E] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider mb-1">
                    Role
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#D4C7B5] focus:border-[#0F4C5C] text-xs text-[#24211E] focus:outline-none"
                  >
                    <option value="USER">USER (Patron)</option>
                    <option value="ADMIN">ADMIN (Staff)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider mb-1">
                    Initial Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#D4C7B5] focus:border-[#0F4C5C] text-xs text-[#24211E] focus:outline-none"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="REVOKED">REVOKED</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#E8DFD5]">
                <button
                  type="button"
                  onClick={() => setIsProvisionOpen(false)}
                  className="px-4 py-2 border border-[#D4C7B5] text-xs font-semibold text-[#5C5549] hover:bg-[#FAF7F2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {isSubmitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {actionTarget && actionTarget.action === 'delete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white border border-[#D4C7B5] shadow-2xl p-6 text-center">
            <AlertCircle className="w-10 h-10 text-rose-600 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-[#24211E] mb-1">
              Delete Account?
            </h3>
            <p className="text-xs text-[#5C5549] mb-5">
              Are you sure you want to permanently delete account <strong>{actionTarget.user.email}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setActionTarget(null)}
                className="px-4 py-2 border border-[#D4C7B5] text-xs font-semibold text-[#5C5549] hover:bg-[#FAF7F2] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteUser(actionTarget.user)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
