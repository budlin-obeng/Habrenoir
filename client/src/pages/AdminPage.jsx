import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { HabrenoirLogo } from '../components/HabrenoirLogo';

export const AdminPage = () => {
  const { user, isAdmin, loginAsAdmin } = useAuth();
  const { formatCurrency } = useCart();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'orders', 'products', 'inquiries', 'integrations'
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState(null);

  // Orders live filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Inquiries live filters
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('all');

  // Waybill Modal State
  const [waybillOrder, setWaybillOrder] = useState(null);

  // Product Edit Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editActiveSection, setEditActiveSection] = useState('core'); // 'core', 'details', 'dimensions', 'colors'

  // New Product Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [addActiveSection, setAddActiveSection] = useState('core');

  const defaultNewProduct = {
    name: '',
    ref: `Ref. ${Math.floor(100000 + Math.random() * 900000)}-HN`,
    category: 'bags',
    categoryName: 'Bags & Leather Goods',
    subcategory: 'Leather Goods',
    gender: 'unisex',
    price: 18000,
    stock: 5,
    badge: 'NEW ARRIVAL',
    shortDescription: 'Mastercrafted in the Habrenoir ateliers using sculpted box calfskin.',
    details: [
      'Hand-selected full-grain French box calfskin',
      'Custom-cast lost-wax solid brass hardware with antiqued gold electroplating',
      'Hand-painted and saddle-stitched edges',
      'Includes protective Habrenoir archival dust bag and presentation case'
    ],
    sizeLabel: 'Standard Size',
    dimensions: {
      width: '26 cm',
      height: '19 cm',
      depth: '10 cm',
      strapDrop: '52 cm'
    },
    image: '/images/products/bags/vendome-burgundy.jpg',
    color: 'bordeaux',
    colorName: 'Deep Burgundy',
    colorHex: '#3D0C15',
    availableColors: [
      {
        slug: 'bordeaux',
        name: 'Deep Burgundy',
        hex: '#3D0C15',
        image: '/images/products/bags/vendome-burgundy.jpg',
        caption: 'Deep Burgundy Finish'
      }
    ]
  };

  const [newProduct, setNewProduct] = useState(defaultNewProduct);

  const showNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4500);
  };

  const getAdminHeaders = (extraHeaders = {}) => {
    const adminKey = import.meta.env.VITE_ADMIN_KEY || 'habrenoir_admin_sec_2026';
    return {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey,
      ...extraHeaders
    };
  };

  const getCleanPhone = (phone) => {
    if (!phone) return '';
    let cleaned = phone.toString().replace(/[^\d+]/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '233' + cleaned.slice(1);
    } else if (cleaned.startsWith('+')) {
      cleaned = cleaned.slice(1);
    }
    return cleaned;
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const adminHeaders = getAdminHeaders();
      const [ordersRes, productsRes, inquiriesRes, healthRes] = await Promise.all([
        fetch('/api/orders', { headers: adminHeaders }).catch(() => null),
        fetch('/api/products').catch(() => null),
        fetch('/api/inquiries', { headers: adminHeaders }).catch(() => null),
        fetch('/api/health').catch(() => null)
      ]);

      if (ordersRes && ordersRes.ok) {
        const oData = await ordersRes.json();
        setOrders(oData.data || []);
      }

      if (productsRes && productsRes.ok) {
        const pData = await productsRes.json();
        setProducts(pData.data || []);
      }

      if (inquiriesRes && inquiriesRes.ok) {
        const iData = await inquiriesRes.json();
        setInquiries(iData.data || []);
      }

      if (healthRes && healthRes.ok) {
        const hData = await healthRes.json();
        setHealthData(hData);
      }
    } catch (e) {
      console.warn('Admin data fetch warning', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Order status update
  const handleUpdateOrderStatus = async (reference, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${reference}/status`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        showNotice(`Order #${reference} status updated to '${newStatus}'. Arkesel SMS dispatched.`);
        fetchAdminData();
      }
    } catch (e) {
      showNotice('Failed to update order status.');
    }
  };

  // Quick inline stock adjustment (+ / -)
  const handleQuickStockChange = async (product, delta) => {
    const currentStock = Number(product.stock) || 0;
    const newStock = Math.max(0, currentStock + delta);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify({ stock: newStock })
      });
      if (res.ok) {
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock: newStock } : p));
        showNotice(`Stock for "${product.name}" updated to ${newStock} units.`);
      }
    } catch (e) {
      showNotice('Error updating inventory count.');
    }
  };

  // Delete product
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the catalog?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders()
      });
      if (res.ok) {
        showNotice(`Creation "${name}" removed from catalog.`);
        fetchAdminData();
      }
    } catch (e) {
      showNotice('Error deleting creation.');
    }
  };

  // Launch Edit Product Modal with full PDP data
  const handleStartEditProduct = (prod) => {
    setEditingProduct({
      ...prod,
      price: Number(prod.price) || 0,
      stock: Number(prod.stock) || 0,
      details: Array.isArray(prod.details) ? [...prod.details] : (prod.details ? [prod.details] : []),
      dimensions: prod.dimensions || { width: '—', height: '—', depth: '—', strapDrop: '—' },
      availableColors: Array.isArray(prod.availableColors) && prod.availableColors.length > 0
        ? JSON.parse(JSON.stringify(prod.availableColors))
        : [
            {
              slug: prod.color || 'noir',
              name: prod.colorName || 'Nero Classic',
              hex: prod.colorHex || '#111111',
              image: prod.image || '',
              caption: prod.name
            }
          ]
    });
    setEditActiveSection('core');
  };

  // Save Product Edits
  const handleSaveProductEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const payload = {
        ...editingProduct,
        price: Number(editingProduct.price),
        stock: Number(editingProduct.stock),
        formattedPrice: `GH₵ ${Number(editingProduct.price).toLocaleString()}`,
        color: editingProduct.availableColors?.[0]?.slug || editingProduct.color || 'noir',
        colorName: editingProduct.availableColors?.[0]?.name || editingProduct.colorName || 'Noir',
        colorHex: editingProduct.availableColors?.[0]?.hex || editingProduct.colorHex || '#111111',
        image: editingProduct.image || editingProduct.availableColors?.[0]?.image || '/images/products/bags/vendome-burgundy.jpg'
      };

      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showNotice(`Creation "${editingProduct.name}" updated successfully.`);
        setEditingProduct(null);
        fetchAdminData();
      } else {
        const err = await res.json().catch(() => ({}));
        showNotice(err.message || 'Error saving product edits.');
      }
    } catch (e) {
      showNotice('Error saving product edits.');
    }
  };

  // Create new product submit
  const handleCreateProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        formattedPrice: `GH₵ ${Number(newProduct.price).toLocaleString()}`,
        color: newProduct.availableColors?.[0]?.slug || 'noir',
        colorName: newProduct.availableColors?.[0]?.name || 'Noir',
        colorHex: newProduct.availableColors?.[0]?.hex || '#111111',
        image: newProduct.image || newProduct.availableColors?.[0]?.image || '/images/products/bags/vendome-burgundy.jpg'
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showNotice(`New creation "${newProduct.name}" registered successfully.`);
        setIsAddProductOpen(false);
        setNewProduct(defaultNewProduct);
        fetchAdminData();
      } else {
        const err = await res.json().catch(() => ({}));
        showNotice(err.message || 'Error creating product.');
      }
    } catch (e) {
      showNotice('Error creating product.');
    }
  };

  // Inquiries status update
  const handleUpdateInquiryStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/inquiries/${id}/status`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setInquiries(prev => prev.map(inq => (inq.id === id || inq.reference === id ? { ...inq, status } : inq)));
        showNotice(`Inquiry status updated to "${status}".`);
      }
    } catch (e) {
      showNotice('Failed to update inquiry status.');
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter(order => {
    const matchesStatus = orderStatusFilter === 'all' || (order.status || 'pending').toLowerCase() === orderStatusFilter.toLowerCase();
    const q = orderSearch.trim().toLowerCase();
    const matchesSearch = !q || (
      (order.reference || '').toLowerCase().includes(q) ||
      (order.customerName || '').toLowerCase().includes(q) ||
      (order.customerPhone || '').toLowerCase().includes(q) ||
      (order.customerEmail || '').toLowerCase().includes(q)
    );
    return matchesStatus && matchesSearch;
  });

  // Filtered Inquiries
  const filteredInquiries = inquiries.filter(inq => {
    const matchesStatus = inquiryStatusFilter === 'all' || (inq.status || 'new').toLowerCase() === inquiryStatusFilter.toLowerCase();
    const q = inquirySearch.trim().toLowerCase();
    const matchesSearch = !q || (
      (inq.reference || '').toLowerCase().includes(q) ||
      (inq.name || '').toLowerCase().includes(q) ||
      (inq.phone || '').toLowerCase().includes(q) ||
      (inq.email || '').toLowerCase().includes(q) ||
      (inq.subject || '').toLowerCase().includes(q) ||
      (inq.notes || '').toLowerCase().includes(q)
    );
    return matchesStatus && matchesSearch;
  });

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const lowStockCount = products.filter(p => (Number(p.stock) || 0) <= 5).length;
  const newInquiriesCount = inquiries.filter(i => (i.status || 'new') === 'new').length;

  if (!isAdmin) {
    return (
      <main className="w-full min-h-screen bg-[#F9F8F6] pt-32 pb-20 flex items-center justify-center font-sans text-[#111111] px-4">
        <div className="bg-[#FFFFFF] border border-[#E8E3DC] p-8 sm:p-12 max-w-lg w-full text-center shadow-none rounded-none animate-fade-in">
          <HabrenoirLogo
            color="#3D0C15"
            className="w-14 h-14 mx-auto mb-5"
          />
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold block mb-2">
            HABRENOIR · DIRECTOR PORTAL
          </span>
          <h2 className="font-serif text-[28px] sm:text-[34px] text-[#111111] font-normal mb-3">
            Director Portal
          </h2>
          <p className="font-sans text-[13px] text-[#524344] leading-relaxed mb-8">
            Access to the administration suite is restricted to authorized directors, inventory managers, and dispatch coordinators.
          </p>
          <div className="space-y-3">
            <button
              onClick={loginAsAdmin}
              className="w-full py-3.5 bg-[#3D0C15] text-[#FFFFFF] font-sans text-[11px] tracking-[0.2em] uppercase hover:bg-[#140002] transition-colors border border-[#3D0C15] font-medium"
            >
              Sign In as Brand Director
            </button>
            <Link
              to="/"
              className="block w-full py-3 text-center text-[#857374] hover:text-[#111111] font-sans text-[10px] uppercase tracking-widest"
            >
              ← Return to Storefront
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen bg-[#F9F8F6] pt-24 sm:pt-28 pb-20 font-sans text-[#111111]">
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #habrenoir-waybill-slip, #habrenoir-waybill-slip * {
            visibility: visible !important;
          }
          #habrenoir-waybill-slip {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 32px !important;
            background: #FFFFFF !important;
            border: 1px solid #111111 !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="max-w-[1700px] mx-auto px-4 sm:px-8">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8E3DC] mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <HabrenoirLogo
              color="#3D0C15"
              className="w-11 h-11 flex-shrink-0"
            />
            <div>
              <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold block mb-1">
                HABRENOIR · DIRECTOR PORTAL
              </span>
              <h1 className="font-serif text-[30px] sm:text-[38px] text-[#111111] font-normal leading-tight">
                Administration Suite
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-[11px] text-[#524344] bg-[#FFFFFF] px-3 py-1.5 border border-[#E8E3DC]">
              <span className="w-2 h-2 bg-[#124C34] rounded-full"></span>
              <span>Active: <strong>{user?.fullName || 'Director'}</strong></span>
            </div>

            <button
              onClick={fetchAdminData}
              className="px-4 py-2 bg-[#FFFFFF] border border-[#E8E3DC] hover:border-[#111111] text-[11px] uppercase tracking-wider transition-colors inline-flex items-center space-x-1.5"
            >
              <svg className="w-3 h-3 text-[#524344]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Global Action Notice Banner */}
        {actionNotice && (
          <div className="mb-6 p-4 bg-[#140002] text-[#FFFFFF] text-[12px] font-sans tracking-wider border border-[#C5A880] flex items-center justify-between animate-fade-in shadow-sm">
            <span>{actionNotice}</span>
            <button onClick={() => setActionNotice(null)} className="text-[#C5A880] p-1 hover:text-[#FFFFFF]" aria-label="Dismiss notice">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex space-x-3 border-b border-[#E8E3DC] mb-8 font-sans text-[11px] uppercase tracking-wider overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'overview' ? 'border-[#3D0C15] text-[#3D0C15]' : 'border-transparent text-[#857374] hover:text-[#111111]'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-4 font-medium transition-colors border-b-2 whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'orders' ? 'border-[#3D0C15] text-[#3D0C15]' : 'border-transparent text-[#857374] hover:text-[#111111]'
            }`}
          >
            <span>Orders & Dispatch</span>
            <span className="px-1.5 py-0.2 bg-[#F4F1EC] text-[#3D0C15] font-semibold text-[10px]">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-4 font-medium transition-colors border-b-2 whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'products' ? 'border-[#3D0C15] text-[#3D0C15]' : 'border-transparent text-[#857374] hover:text-[#111111]'
            }`}
          >
            <span>Creations Catalog</span>
            <span className="px-1.5 py-0.2 bg-[#F4F1EC] text-[#3D0C15] font-semibold text-[10px]">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-3 px-4 font-medium transition-colors border-b-2 whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'inquiries' ? 'border-[#3D0C15] text-[#3D0C15]' : 'border-transparent text-[#857374] hover:text-[#111111]'
            }`}
          >
            <span>Inquiries & VIP Leads</span>
            {newInquiriesCount > 0 ? (
              <span className="px-1.5 py-0.2 bg-[#3D0C15] text-[#FFFFFF] font-semibold text-[10px]">
                {newInquiriesCount} new
              </span>
            ) : (
              <span className="px-1.5 py-0.2 bg-[#F4F1EC] text-[#857374] font-semibold text-[10px]">
                {inquiries.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('integrations')}
            className={`pb-3 px-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'integrations' ? 'border-[#3D0C15] text-[#3D0C15]' : 'border-transparent text-[#857374] hover:text-[#111111]'
            }`}
          >
            Infrastructure & Integrations
          </button>
        </div>

        {/* =========================================================================
            TAB 1: OVERVIEW METRICS
           ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-[#FFFFFF] border border-[#E8E3DC] p-6">
                <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#857374] block mb-2">
                  Total Atelier Gross
                </span>
                <span className="font-serif text-[28px] text-[#3D0C15] font-normal">
                  {formatCurrency(totalRevenue)}
                </span>
                <span className="text-[10px] text-[#767676] block mt-1">Direct retail ledger in Ghanaian Cedis</span>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E8E3DC] p-6">
                <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#857374] block mb-2">
                  Total Orders Sealed
                </span>
                <span className="font-serif text-[28px] text-[#111111] font-normal">
                  {orders.length}
                </span>
                <span className="text-[10px] text-[#767676] block mt-1">Live in persistent store</span>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E8E3DC] p-6">
                <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#857374] block mb-2">
                  Catalog Creations
                </span>
                <span className="font-serif text-[28px] text-[#111111] font-normal">
                  {products.length}
                </span>
                <span className="text-[10px] text-[#767676] block mt-1">Active across 5 categories</span>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E8E3DC] p-6">
                <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#857374] block mb-2">
                  New Client Inquiries
                </span>
                <span className="font-serif text-[28px] text-[#8C582B] font-normal">
                  {newInquiriesCount}
                </span>
                <span className="text-[10px] text-[#767676] block mt-1">Awaiting concierge contact</span>
              </div>
            </div>

            {/* Quick Action Shortcuts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  setNewProduct(defaultNewProduct);
                  setIsAddProductOpen(true);
                }}
                className="p-5 bg-[#FFFFFF] border border-[#E8E3DC] hover:border-[#3D0C15] text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-sans text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold block mb-1">CATALOG MANAGEMENT</span>
                  <span className="font-serif text-[18px] text-[#111111] block">+ Catalog New Creation</span>
                  <span className="font-sans text-[11px] text-[#857374]">Add product with full PDP details, materials, and colorways</span>
                </div>
                <span className="font-serif text-[22px] text-[#3D0C15] ml-4">→</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className="p-5 bg-[#FFFFFF] border border-[#E8E3DC] hover:border-[#3D0C15] text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-sans text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold block mb-1">FULFILLMENT DISPATCH</span>
                  <span className="font-serif text-[18px] text-[#111111] block">Manage Orders & Waybills</span>
                  <span className="font-sans text-[11px] text-[#857374]">1-Click WhatsApp, dispatch slip printing, and Arkesel SMS</span>
                </div>
                <span className="font-serif text-[22px] text-[#3D0C15] ml-4">→</span>
              </button>

              <button
                onClick={() => setActiveTab('inquiries')}
                className="p-5 bg-[#FFFFFF] border border-[#E8E3DC] hover:border-[#3D0C15] text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-sans text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold block mb-1">CONCIERGE DESK</span>
                  <span className="font-serif text-[18px] text-[#111111] block">Client Inquiries & Leads</span>
                  <span className="font-sans text-[11px] text-[#857374]">Direct WhatsApp replies to client inquiries from Contact Page</span>
                </div>
                <span className="font-serif text-[22px] text-[#3D0C15] ml-4">→</span>
              </button>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-[#FFFFFF] border border-[#E8E3DC] p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-serif text-[20px] text-[#111111]">Recent Ledger Entries</h3>
                  <span className="font-sans text-[11px] text-[#857374]">Latest client purchases recorded in Accra</span>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="font-sans text-[11px] uppercase tracking-wider text-[#3D0C15] hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-10 text-[#857374] font-sans text-[12px]">
                  No orders recorded yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-[11px]">
                    <thead>
                      <tr className="border-b border-[#E8E3DC] text-[#857374] uppercase tracking-wider">
                        <th className="py-2.5">Reference</th>
                        <th className="py-2.5">Client</th>
                        <th className="py-2.5">Phone</th>
                        <th className="py-2.5">Status</th>
                        <th className="py-2.5">Amount</th>
                        <th className="py-2.5 text-right">Fulfillment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E3DC]">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.reference}>
                          <td className="py-3 font-semibold text-[#111111]">{order.reference}</td>
                          <td className="py-3">{order.customerName || 'Valued Client'}</td>
                          <td className="py-3 text-[#524344]">{order.customerPhone || '—'}</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 bg-[#F9F8F6] border border-[#E8E3DC] uppercase text-[9px] font-semibold text-[#3D0C15]">
                              {order.status || 'pending'}
                            </span>
                          </td>
                          <td className="py-3 font-semibold">{formatCurrency(order.amount)}</td>
                          <td className="py-3 text-right space-x-2">
                            <button
                              onClick={() => setWaybillOrder(order)}
                              className="text-[#725B38] hover:underline uppercase text-[10px]"
                            >
                              Waybill
                            </button>
                            <span>·</span>
                            <Link
                              to={`/track?order=${order.reference}`}
                              className="text-[#3D0C15] hover:underline uppercase text-[10px]"
                            >
                              Track
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: ORDERS MANAGEMENT & FULFILLMENT
           ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="bg-[#FFFFFF] border border-[#E8E3DC] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-[#E8E3DC] gap-4">
              <div>
                <h3 className="font-serif text-[22px] text-[#111111]">Client Orders & Fulfillment</h3>
                <p className="font-sans text-[12px] text-[#767676] mt-0.5">
                  Update statuses, print dispatch waybills for courier handover, and contact clients directly via WhatsApp.
                </p>
              </div>

              {/* Status Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 font-sans text-[10px] uppercase tracking-wider">
                {[
                  { key: 'all', label: 'All Orders' },
                  { key: 'pending', label: 'Pending' },
                  { key: 'confirmed', label: 'Confirmed' },
                  { key: 'benchwork', label: 'Benchwork' },
                  { key: 'dispatched', label: 'Dispatched' },
                  { key: 'delivered', label: 'Delivered' }
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => setOrderStatusFilter(item.key)}
                    className={`px-3 py-1.5 border transition-colors ${
                      orderStatusFilter === item.key
                        ? 'bg-[#3D0C15] text-[#FFFFFF] border-[#3D0C15]'
                        : 'bg-[#FFFFFF] text-[#524344] border-[#E8E3DC] hover:border-[#111111]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Search Bar */}
            <div className="flex items-center space-x-3 bg-[#F9F8F6] border border-[#E8E3DC] px-4 py-2.5">
              <svg className="w-3.5 h-3.5 text-[#857374] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search orders by Reference #, Client Name, Phone, or Email..."
                className="bg-transparent w-full outline-none font-sans text-[12px] text-[#111111]"
              />
              {orderSearch && (
                <button
                  onClick={() => setOrderSearch('')}
                  className="text-[11px] text-[#857374] hover:text-[#111111] uppercase"
                >
                  Clear
                </button>
              )}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 text-[#857374] font-sans text-[12px]">
                No orders match your filter criteria.
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <div
                    key={order.reference}
                    className="p-5 border border-[#E8E3DC] bg-[#FAFAF8] space-y-4 hover:border-[#111111] transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-[#E8E3DC] pb-3 gap-3">
                      <div>
                        <div className="flex items-center space-x-3">
                          <span className="font-serif text-[18px] text-[#111111] font-semibold">
                            #{order.reference}
                          </span>
                          <span className="px-2 py-0.5 bg-[#3D0C15] text-[#FFFFFF] text-[9px] uppercase tracking-wider font-medium">
                            {order.status || 'pending'}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#857374] block mt-0.5">
                          Placed: {new Date(order.createdAt || Date.now()).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* 1-Click WhatsApp Client */}
                        {order.customerPhone && (
                          <a
                            href={`https://wa.me/${getCleanPhone(order.customerPhone)}?text=${encodeURIComponent(
                              `Hello ${order.customerName || 'Valued Client'}, this is Habrenoir Accra regarding your creation order #${order.reference}. We are pleased to assist you with delivery coordination.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-[#25D366] text-[#FFFFFF] font-sans text-[10px] uppercase tracking-wider font-semibold hover:bg-[#1EBE5D] transition-colors flex items-center space-x-1.5"
                          >
                            <span>WhatsApp Client</span>
                          </a>
                        )}

                        {/* Direct Phone Call */}
                        {order.customerPhone && (
                          <a
                            href={`tel:${order.customerPhone}`}
                            className="px-3 py-1.5 bg-[#FFFFFF] border border-[#E8E3DC] text-[#111111] font-sans text-[10px] uppercase tracking-wider hover:border-[#111111] transition-colors"
                          >
                            Call
                          </a>
                        )}

                        {/* Printable Waybill Button */}
                        <button
                          onClick={() => setWaybillOrder(order)}
                          className="px-3 py-1.5 bg-[#FFFFFF] border border-[#E8E3DC] text-[#725B38] font-sans text-[10px] uppercase tracking-wider font-semibold hover:border-[#725B38] transition-colors"
                        >
                          Print Waybill Slip
                        </button>

                        {/* Status Select */}
                        <div className="flex items-center space-x-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-[#857374]">Status:</label>
                          <select
                            value={order.status || 'pending'}
                            onChange={(e) => handleUpdateOrderStatus(order.reference, e.target.value)}
                            className="bg-[#FFFFFF] border border-[#E8E3DC] px-2.5 py-1 text-[11px] font-sans outline-none font-medium"
                          >
                            <option value="pending">Order Pending</option>
                            <option value="confirmed">Confirmed & Reserved</option>
                            <option value="benchwork">Packaging & Quality Control</option>
                            <option value="dispatched">Out for Courier Delivery</option>
                            <option value="delivered">Delivered Handover</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Client & Shipping Data */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[11px] font-sans">
                      <div>
                        <span className="text-[#857374] uppercase tracking-wider block text-[9px]">Client Details</span>
                        <strong className="block text-[#111111] mt-0.5">{order.customerName || 'Valued Client'}</strong>
                        <span className="text-[#524344] block">{order.customerEmail}</span>
                        <span className="text-[#3D0C15] font-semibold block">{order.customerPhone}</span>
                      </div>

                      <div>
                        <span className="text-[#857374] uppercase tracking-wider block text-[9px]">Valet Destination</span>
                        <span className="block text-[#111111] mt-0.5">{order.shipping?.address || 'Flagship Salon Collection'}</span>
                        <span className="text-[#524344] block">{order.shipping?.city}, {order.shipping?.country || 'Ghana'}</span>
                        {order.shipping?.notes && (
                          <span className="text-[#725B38] italic block mt-1">"{order.shipping.notes}"</span>
                        )}
                      </div>

                      <div>
                        <span className="text-[#857374] uppercase tracking-wider block text-[9px]">Total Amount</span>
                        <span className="font-serif text-[18px] text-[#111111] block mt-0.5 font-semibold">
                          {formatCurrency(order.amount)}
                        </span>
                        <span className="text-[#725B38] text-[10px] block">White-Glove Courier Included</span>
                      </div>
                    </div>

                    {/* Items Purchased */}
                    {order.items && order.items.length > 0 && (
                      <div className="pt-2 border-t border-[#E8E3DC]">
                        <span className="text-[9px] uppercase tracking-wider text-[#857374] block mb-2">Creations in Order</span>
                        <div className="flex flex-wrap gap-2">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="px-3 py-1.5 bg-[#FFFFFF] border border-[#E8E3DC] text-[10px] flex items-center space-x-2"
                            >
                              <span className="font-medium text-[#111111]">{item.name}</span>
                              <span className="text-[#857374]">({item.color || 'Standard'} · {item.size || 'Standard'})</span>
                              <strong className="text-[#3D0C15]">×{item.quantity}</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: PRODUCTS CATALOG MANAGEMENT
           ========================================================================= */}
        {activeTab === 'products' && (
          <div className="bg-[#FFFFFF] border border-[#E8E3DC] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8E3DC] gap-4">
              <div>
                <h3 className="font-serif text-[22px] text-[#111111]">Creations Catalog</h3>
                <p className="font-sans text-[12px] text-[#767676] mt-0.5">
                  Catalog new creations or edit all details displayed on the Product Details Page (finishes, sizes, craftsmanship bullets, and colorways).
                </p>
              </div>

              <button
                onClick={() => {
                  setNewProduct(defaultNewProduct);
                  setIsAddProductOpen(true);
                  setAddActiveSection('core');
                }}
                className="px-5 py-2.5 bg-[#3D0C15] text-[#FFFFFF] font-sans text-[11px] tracking-wider uppercase hover:bg-[#140002] transition-colors"
              >
                + Add New Creation
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-[11px]">
                <thead>
                  <tr className="border-b border-[#E8E3DC] text-[#857374] uppercase tracking-wider">
                    <th className="py-2.5">Image</th>
                    <th className="py-2.5">Creation Name & SKU</th>
                    <th className="py-2.5">Category</th>
                    <th className="py-2.5">Gender</th>
                    <th className="py-2.5">Price</th>
                    <th className="py-2.5 text-center">Stock Inventory</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E3DC]">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#F9F8F6] transition-colors">
                      <td className="py-2.5">
                        <div className="w-12 h-14 bg-[#FFFFFF] border border-[#E8E3DC] p-1 flex items-center justify-center">
                          <img
                            src={p.image || p.availableColors?.[0]?.image}
                            alt={p.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </td>
                      <td className="py-2.5">
                        <Link to={`/product/${p.id}`} className="font-medium text-[#111111] hover:underline block text-[12px]">
                          {p.name}
                        </Link>
                        <span className="text-[10px] text-[#857374]">{p.ref || 'Ref. Standard'}</span>
                        {p.badge && (
                          <span className="ml-2 px-1.5 py-0.2 bg-[#F4F1EC] text-[#725B38] text-[9px] uppercase font-semibold">
                            {p.badge}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 uppercase text-[10px] text-[#524344]">{p.category}</td>
                      <td className="py-2.5 uppercase text-[10px] text-[#524344]">{p.gender || 'unisex'}</td>
                      <td className="py-2.5 font-semibold text-[#3D0C15]">{formatCurrency(p.price)}</td>
                      
                      {/* Inline Stock Quick Counter */}
                      <td className="py-2.5 text-center">
                        <div className="inline-flex items-center space-x-1.5 bg-[#FFFFFF] border border-[#E8E3DC] px-2 py-0.5">
                          <button
                            onClick={() => handleQuickStockChange(p, -1)}
                            title="Decrease Stock"
                            className="w-5 h-5 flex items-center justify-center text-[#857374] hover:text-[#111111] hover:bg-[#F9F8F6]"
                            aria-label="Decrease stock"
                          >
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" />
                            </svg>
                          </button>
                          <span className={`min-w-[28px] text-center font-medium ${Number(p.stock) <= 5 ? 'text-[#725B38] font-bold' : 'text-[#111111]'}`}>
                            {p.stock}
                          </span>
                          <button
                            onClick={() => handleQuickStockChange(p, 1)}
                            title="Increase Stock"
                            className="w-5 h-5 flex items-center justify-center text-[#857374] hover:text-[#111111] hover:bg-[#F9F8F6]"
                            aria-label="Increase stock"
                          >
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </td>

                      <td className="py-2.5 text-right space-x-2">
                        <button
                          onClick={() => handleStartEditProduct(p)}
                          className="px-2.5 py-1 bg-[#3D0C15] text-[#FFFFFF] text-[10px] uppercase tracking-wider hover:bg-[#140002] transition-colors"
                        >
                          Edit Details
                        </button>
                        <Link
                          to={`/product/${p.id}`}
                          target="_blank"
                          className="text-[#524344] hover:text-[#111111] uppercase text-[10px] inline-flex items-center space-x-1"
                          title="View on Storefront"
                        >
                          <span>View</span>
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </Link>
                        <span>·</span>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="text-[#8C582B] hover:underline uppercase text-[10px]"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: INQUIRIES & VIP CLIENT LEADS
           ========================================================================= */}
        {activeTab === 'inquiries' && (
          <div className="bg-[#FFFFFF] border border-[#E8E3DC] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-[#E8E3DC] gap-4">
              <div>
                <h3 className="font-serif text-[22px] text-[#111111]">Client Inquiries & VIP Concierge Leads</h3>
                <p className="font-sans text-[12px] text-[#767676] mt-0.5">
                  Submissions received from the Contact Page, WhatsApp Concierge, and flagship boutique styling requests.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2 font-sans text-[10px] uppercase tracking-wider">
                {[
                  { key: 'all', label: 'All Inquiries' },
                  { key: 'new', label: 'New / Unread' },
                  { key: 'contacted', label: 'Contacted' }
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => setInquiryStatusFilter(item.key)}
                    className={`px-3 py-1.5 border transition-colors ${
                      inquiryStatusFilter === item.key
                        ? 'bg-[#3D0C15] text-[#FFFFFF] border-[#3D0C15]'
                        : 'bg-[#FFFFFF] text-[#524344] border-[#E8E3DC] hover:border-[#111111]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="flex items-center space-x-3 bg-[#F9F8F6] border border-[#E8E3DC] px-4 py-2.5">
              <svg className="w-3.5 h-3.5 text-[#857374] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={inquirySearch}
                onChange={(e) => setInquirySearch(e.target.value)}
                placeholder="Search inquiries by Client Name, Phone, Email, Reference, or Notes..."
                className="bg-transparent w-full outline-none font-sans text-[12px] text-[#111111]"
              />
              {inquirySearch && (
                <button
                  onClick={() => setInquirySearch('')}
                  className="text-[11px] text-[#857374] hover:text-[#111111] uppercase"
                >
                  Clear
                </button>
              )}
            </div>

            {filteredInquiries.length === 0 ? (
              <div className="text-center py-16 text-[#857374] font-sans text-[12px]">
                No customer inquiries match your current filter.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInquiries.map((inq) => (
                  <div
                    key={inq.id || inq.reference}
                    className="p-5 border border-[#E8E3DC] bg-[#FAFAF8] space-y-3 hover:border-[#111111] transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E8E3DC] pb-3 gap-2">
                      <div>
                        <div className="flex items-center space-x-3">
                          <span className="font-serif text-[17px] text-[#111111] font-medium">
                            {inq.name}
                          </span>
                          <span className="text-[10px] text-[#857374]">
                            Ref: <strong>{inq.reference}</strong>
                          </span>
                          <span className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold ${
                            (inq.status || 'new') === 'new'
                              ? 'bg-[#3D0C15] text-[#FFFFFF]'
                              : 'bg-[#124C34] text-[#FFFFFF]'
                          }`}>
                            {inq.status || 'new'}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#857374] block mt-0.5">
                          Received: {new Date(inq.createdAt || Date.now()).toLocaleString()} · Channel: {inq.channel || 'Direct Desk'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* 1-Click WhatsApp Client */}
                        {inq.phone && (
                          <a
                            href={`https://wa.me/${getCleanPhone(inq.phone)}?text=${encodeURIComponent(
                              `Hello ${inq.name}, this is Habrenoir regarding your inquiry (${inq.reference}). We would be delighted to assist you.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-[#25D366] text-[#FFFFFF] font-sans text-[10px] uppercase tracking-wider font-semibold hover:bg-[#1EBE5D] transition-colors"
                          >
                            WhatsApp Client
                          </a>
                        )}

                        {/* Call Client */}
                        {inq.phone && (
                          <a
                            href={`tel:${inq.phone}`}
                            className="px-3 py-1.5 bg-[#FFFFFF] border border-[#E8E3DC] text-[#111111] font-sans text-[10px] uppercase tracking-wider hover:border-[#111111] transition-colors"
                          >
                            Call
                          </a>
                        )}

                        {/* Toggle Status */}
                        {(inq.status || 'new') === 'new' ? (
                          <button
                            onClick={() => handleUpdateInquiryStatus(inq.id || inq.reference, 'contacted')}
                            className="px-3 py-1.5 bg-[#124C34] text-[#FFFFFF] font-sans text-[10px] uppercase tracking-wider hover:bg-[#0E3A27] transition-colors"
                          >
                            Mark Contacted
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateInquiryStatus(inq.id || inq.reference, 'new')}
                            className="px-3 py-1.5 bg-[#FFFFFF] border border-[#E8E3DC] text-[#857374] font-sans text-[10px] uppercase tracking-wider hover:border-[#111111] transition-colors"
                          >
                            Reopen
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[11px] font-sans">
                      <div>
                        <span className="text-[#857374] uppercase text-[9px] block">Client Contact</span>
                        <span className="text-[#3D0C15] font-semibold block mt-0.5">{inq.phone}</span>
                        <span className="text-[#524344] block">{inq.email}</span>
                      </div>

                      <div>
                        <span className="text-[#857374] uppercase text-[9px] block">Service / Interest</span>
                        <span className="text-[#111111] font-medium block mt-0.5">{inq.subject || 'General Fitting / Inquiry'}</span>
                      </div>

                      <div>
                        <span className="text-[#857374] uppercase text-[9px] block">Message / Client Notes</span>
                        <p className="text-[#524344] italic mt-0.5 leading-relaxed">
                          {inq.notes ? `"${inq.notes}"` : 'No additional notes provided.'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 5: API & INFRASTRUCTURE INTEGRATIONS
           ========================================================================= */}
        {activeTab === 'integrations' && (
          <div className="bg-[#FFFFFF] border border-[#E8E3DC] p-6 sm:p-8 space-y-6 font-sans">
            <div>
              <h3 className="font-serif text-[22px] text-[#111111]">Infrastructure & Integrations</h3>
              <p className="font-sans text-[12px] text-[#767676] mt-0.5">
                Real-time operational status for Database Storage, Paystack Gateway, Arkesel SMS, and Authentication.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Database */}
              <div className="p-6 border border-[#E8E3DC] bg-[#F9F8F6] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold">DATABASE STORAGE</span>
                  <span className="w-2.5 h-2.5 bg-[#124C34] rounded-full"></span>
                </div>
                <h4 className="font-serif text-[18px]">
                  {healthData?.database?.type || 'Resilient Persistent JSON Store'}
                </h4>
                <p className="text-[12px] text-[#524344] leading-relaxed">
                  Dual-tier architecture: Supports native MongoDB / Mongoose connection while guaranteeing permanent zero-loss file persistence (`server/data/store.json`).
                </p>
                <div className="pt-2 text-[11px] text-[#857374] space-x-4">
                  <span>Catalog Products: <strong>{products.length}</strong></span>
                  <span>Orders Logged: <strong>{orders.length}</strong></span>
                  <span>Inquiries: <strong>{inquiries.length}</strong></span>
                </div>
              </div>

              {/* Paystack */}
              <div className="p-6 border border-[#E8E3DC] bg-[#F9F8F6] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold">PAYSTACK GATEWAY</span>
                  <span className={`w-2.5 h-2.5 rounded-full ${healthData?.integrations?.paystack?.configured ? 'bg-[#124C34]' : 'bg-[#725B38]'}`}></span>
                </div>
                <h4 className="font-serif text-[18px]">Paystack Ghana & International</h4>
                <p className="text-[12px] text-[#524344] leading-relaxed">
                  Accepts Ghana Cedis (GH₵ / GHS), MTN Mobile Money, Telecel Cash, and 3D-Secure Visa/Mastercard.
                </p>
                <div className="pt-2 text-[11px]">
                  <span className="text-[#857374]">Key Status: </span>
                  <code className="text-[#3D0C15] bg-[#FFFFFF] px-2 py-0.5 border border-[#E8E3DC]">
                    {healthData?.integrations?.paystack?.configured ? 'Live API Secret Connected' : 'Simulated Sandbox Active'}
                  </code>
                </div>
              </div>

              {/* Arkesel SMS */}
              <div className="p-6 border border-[#E8E3DC] bg-[#F9F8F6] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold">ARKESEL GHANA SMS</span>
                  <span className={`w-2.5 h-2.5 rounded-full ${healthData?.integrations?.arkesel?.configured ? 'bg-[#124C34]' : 'bg-[#725B38]'}`}></span>
                </div>
                <h4 className="font-serif text-[18px]">Arkesel SMS Dispatch Gateway</h4>
                <p className="text-[12px] text-[#524344] leading-relaxed">
                  Dispatches transactional SMS confirmations to clients in Ghana and worldwide upon order placement and courier status updates.
                </p>
                <div className="pt-2 text-[11px]">
                  <span className="text-[#857374]">Sender ID: </span>
                  <strong>{healthData?.integrations?.arkesel?.senderId || 'HABRENOIR'}</strong>
                </div>
              </div>

              {/* Clerk Auth */}
              <div className="p-6 border border-[#E8E3DC] bg-[#F9F8F6] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold">CLERK AUTHENTICATION</span>
                  <span className="w-2.5 h-2.5 bg-[#124C34] rounded-full"></span>
                </div>
                <h4 className="font-serif text-[18px]">Clerk Auth & VIP Client Portal</h4>
                <p className="text-[12px] text-[#524344] leading-relaxed">
                  Full multi-role client access. When `VITE_CLERK_PUBLISHABLE_KEY` is active, routes through Clerk; otherwise provides instant VIP/Admin one-click demo login.
                </p>
                <div className="pt-2 text-[11px]">
                  <span className="text-[#857374]">Status: </span>
                  <strong className="text-[#124C34]">Ready & Active</strong>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* =========================================================================
          PRINTABLE WAYBILL / DISPATCH SLIP MODAL
         ========================================================================= */}
      {waybillOrder && (
        <div className="fixed inset-0 z-[180] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#111111]/60 backdrop-blur-xs no-print"
            onClick={() => setWaybillOrder(null)}
          />

          <div
            id="habrenoir-waybill-slip"
            className="relative w-full max-w-2xl bg-[#FFFFFF] border-2 border-[#111111] p-8 sm:p-10 z-10 max-h-[95vh] overflow-y-auto font-sans shadow-2xl"
          >
            {/* Header / Crest */}
            <div className="border-b-2 border-[#111111] pb-6 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-sans text-[11px] tracking-[0.3em] uppercase text-[#725B38] font-bold block mb-1">
                    HABRENOIR · ACCRA ATELIER
                  </span>
                  <h2 className="font-serif text-[28px] text-[#111111] uppercase tracking-tight">
                    Official Dispatch Waybill
                  </h2>
                  <span className="font-sans text-[11px] text-[#524344] block mt-0.5">
                    Express White-Glove Handover & Client Manifest
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[14px] font-bold text-[#111111] block">
                    WB-{waybillOrder.reference}
                  </span>
                  <span className="text-[10px] text-[#857374] block mt-0.5">
                    {new Date(waybillOrder.createdAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#E8E3DC] text-[10px] text-[#524344]">
                <div>
                  <strong className="text-[#111111] uppercase block">Dispatch Workshop:</strong>
                  <span>Villa 8, Senchi Street, Airport Residential Area, Accra, Ghana</span>
                  <span className="block">Direct: +233 (0) 30 294 8810 · dispatch@habrenoir.luxury</span>
                </div>
                <div className="text-right">
                  <strong className="text-[#111111] uppercase block">Dispatch Priority:</strong>
                  <span className="text-[#3D0C15] font-bold">VIP Doorstep Courier Handover</span>
                  <span className="block">Status: {(waybillOrder.status || 'Pending').toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Consignee / Destination Details */}
            <div className="bg-[#F9F8F6] border border-[#E8E3DC] p-4 mb-6">
              <span className="text-[9px] uppercase tracking-wider text-[#857374] font-bold block mb-2">
                RECIPIENT & VALET DESTINATION
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px]">
                <div>
                  <span className="text-[#857374] text-[10px] block">Client Name</span>
                  <strong className="text-[#111111] text-[13px]">{waybillOrder.customerName || 'Valued Client'}</strong>
                  <span className="text-[#3D0C15] font-semibold block mt-1">{waybillOrder.customerPhone}</span>
                  <span className="text-[#524344] block">{waybillOrder.customerEmail}</span>
                </div>
                <div>
                  <span className="text-[#857374] text-[10px] block">Doorstep Address</span>
                  <strong className="text-[#111111] block">{waybillOrder.shipping?.address || 'Flagship Showroom Collection'}</strong>
                  <span className="text-[#524344] block">{waybillOrder.shipping?.city}, {waybillOrder.shipping?.country || 'Ghana'}</span>
                  {waybillOrder.shipping?.notes && (
                    <span className="text-[#725B38] italic block mt-1">Note: "{waybillOrder.shipping.notes}"</span>
                  )}
                </div>
              </div>
            </div>

            {/* Item Manifest */}
            <div className="mb-6">
              <span className="text-[9px] uppercase tracking-wider text-[#857374] font-bold block mb-2">
                MANIFEST OF ARTICLES
              </span>
              <table className="w-full text-left font-sans text-[11px] border border-[#E8E3DC]">
                <thead className="bg-[#F9F8F6] border-b border-[#E8E3DC] text-[#857374] uppercase text-[9px]">
                  <tr>
                    <th className="p-2.5">Article Description</th>
                    <th className="p-2.5">Finish / Color</th>
                    <th className="p-2.5">Proportion</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E3DC]">
                  {(waybillOrder.items || []).map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-medium text-[#111111]">{item.name}</td>
                      <td className="p-2.5 text-[#524344]">{item.color || 'Standard'}</td>
                      <td className="p-2.5 text-[#524344]">{item.size || 'Standard'}</td>
                      <td className="p-2.5 text-center font-bold text-[#3D0C15]">×{item.quantity}</td>
                      <td className="p-2.5 text-right font-medium">{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end pt-3 text-[13px]">
                <div className="text-right space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#857374] mr-4">Total Amount:</span>
                  <strong className="font-serif text-[18px] text-[#111111]">
                    {formatCurrency(waybillOrder.amount)}
                  </strong>
                </div>
              </div>
            </div>

            {/* Courier Signatures & Acknowledgement */}
            <div className="border-t-2 border-[#111111] pt-6 space-y-6">
              <div className="grid grid-cols-3 gap-4 text-[10px]">
                <div className="border-t border-[#857374] pt-2">
                  <span className="text-[#857374] block">Dispatched by (Workshop):</span>
                  <span className="font-medium text-[#111111] mt-6 block">Dispatcher Signature / Date</span>
                </div>
                <div className="border-t border-[#857374] pt-2">
                  <span className="text-[#857374] block">Courier Valet Handover:</span>
                  <span className="font-medium text-[#111111] mt-6 block">Courier Signature / Date</span>
                </div>
                <div className="border-t border-[#857374] pt-2">
                  <span className="text-[#857374] block">Received in Good Order:</span>
                  <span className="font-medium text-[#111111] mt-6 block">Client Signature / Date</span>
                </div>
              </div>

              <div className="text-center pt-2 text-[9px] text-[#857374] tracking-wider uppercase">
                HABRENOIR · LUXURY GOODS DISPATCH · ACCRA, GHANA
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-6 border-t border-[#E8E3DC] flex items-center justify-between no-print">
              <button
                type="button"
                onClick={() => setWaybillOrder(null)}
                className="px-5 py-2.5 border border-[#E8E3DC] uppercase text-[10px] tracking-wider hover:border-[#111111]"
              >
                Close Slip
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-[#3D0C15] text-[#FFFFFF] uppercase text-[10px] tracking-wider font-semibold hover:bg-[#140002] transition-colors inline-flex items-center space-x-2"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Print Official Waybill</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PRODUCT EDIT MODAL (Full PDP Details, Craftsmanship, Dimensions, Colors)
         ========================================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-[170] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#111111]/60 backdrop-blur-xs"
            onClick={() => setEditingProduct(null)}
          />

          <div className="relative w-full max-w-4xl bg-[#FFFFFF] border border-[#E8E3DC] p-6 sm:p-10 z-10 max-h-[92vh] overflow-y-auto font-sans">
            <div className="flex items-center justify-between border-b border-[#E8E3DC] pb-4 mb-6">
              <div>
                <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-[#C5A880] font-semibold block">
                  PRODUCT DETAILS PAGE (PDP) CURATOR
                </span>
                <h3 className="font-serif text-[24px] text-[#111111]">
                  Edit Creation: {editingProduct.name}
                </h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 text-[#524344] hover:text-[#3D0C15] transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Sub-navigation tabs within the Edit Modal */}
            <div className="flex space-x-2 border-b border-[#E8E3DC] mb-6 text-[11px] uppercase tracking-wider overflow-x-auto">
              <button
                type="button"
                onClick={() => setEditActiveSection('core')}
                className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 ${
                  editActiveSection === 'core' ? 'border-[#3D0C15] text-[#3D0C15]' : 'border-transparent text-[#857374]'
                }`}
              >
                1. Core & Pricing
              </button>
              <button
                type="button"
                onClick={() => setEditActiveSection('details')}
                className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 ${
                  editActiveSection === 'details' ? 'border-[#3D0C15] text-[#3D0C15]' : 'border-transparent text-[#857374]'
                }`}
              >
                2. Story & Craftsmanship Bullets ({editingProduct.details?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setEditActiveSection('dimensions')}
                className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 ${
                  editActiveSection === 'dimensions' ? 'border-[#3D0C15] text-[#3D0C15]' : 'border-transparent text-[#857374]'
                }`}
              >
                3. Sizing & Dimensions
              </button>
              <button
                type="button"
                onClick={() => setEditActiveSection('colors')}
                className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 ${
                  editActiveSection === 'colors' ? 'border-[#3D0C15] text-[#3D0C15]' : 'border-transparent text-[#857374]'
                }`}
              >
                4. Images & Colorways ({editingProduct.availableColors?.length || 1})
              </button>
            </div>

            <form onSubmit={handleSaveProductEdit} className="space-y-6 text-[12px]">
              
              {/* SECTION 1: CORE DETAILS */}
              {editActiveSection === 'core' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#857374] uppercase tracking-wider text-[10px] mb-1">
                        Creation Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="w-full p-2.5 bg-[#F9F8F6] border border-[#E8E3DC] outline-none font-serif text-[16px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#857374] uppercase tracking-wider text-[10px] mb-1">
                        Reference SKU *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingProduct.ref || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, ref: e.target.value })}
                        className="w-full p-2.5 bg-[#F9F8F6] border border-[#E8E3DC] outline-none font-mono text-[13px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[#857374] uppercase tracking-wider text-[10px] mb-1">Category *</label>
                      <select
                        value={editingProduct.category}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                        className="w-full p-2.5 bg-[#F9F8F6] border border-[#E8E3DC] outline-none"
                      >
                        <option value="bags">Bags & Leather Goods</option>
                        <option value="shoes">Footwear & Shoes</option>
                        <option value="shirts">Ready-to-Wear Shirts</option>
                        <option value="blazers">Tailoring & Blazers</option>
                        <option value="accessories">Belts & Accessories</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#857374] uppercase tracking-wider text-[10px] mb-1">Subcategory</label>
                      <input
                        type="text"
                        value={editingProduct.subcategory || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, subcategory: e.target.value })}
                        placeholder="e.g. Leather Goods, Tailoring"
                        className="w-full p-2.5 bg-[#F9F8F6] border border-[#E8E3DC] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#857374] uppercase tracking-wider text-[10px] mb-1">Gender</label>
                      <select
                        value={editingProduct.gender || 'unisex'}
                        onChange={(e) => setEditingProduct({ ...editingProduct, gender: e.target.value })}
                        className="w-full p-2.5 bg-[#F9F8F6] border border-[#E8E3DC] outline-none"
                      >
                        <option value="women">Women</option>
                        <option value="men">Men</option>
                        <option value="unisex">Unisex</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[#857374] uppercase tracking-wider text-[10px] mb-1">Price in GHS (GH₵) *</label>
                      <input
                        type="number"
                        required
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                        className="w-full p-2.5 bg-[#F9F8F6] border border-[#E8E3DC] outline-none font-semibold text-[#3D0C15] text-[15px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#857374] uppercase tracking-wider text-[10px] mb-1">Stock Count *</label>
                      <input
                        type="number"
                        required
                        value={editingProduct.stock}
                        onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                        className="w-full p-2.5 bg-[#F9F8F6] border border-[#E8E3DC] outline-none font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[#857374] uppercase tracking-wider text-[10px] mb-1">Badge</label>
                      <input
                        type="text"
                        value={editingProduct.badge || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                        placeholder="e.g. NEW ARRIVAL, BESTSELLER"
                        className="w-full p-2.5 bg-[#F9F8F6] border border-[#E8E3DC] outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 2: EDITORIAL DESCRIPTION & BULLETS */}
              {editActiveSection === 'details' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#857374] uppercase tracking-wider text-[10px] mb-1">
                      Short Editorial Description (Appears below title on PDP & Card)
                    </label>
                    <textarea
                      rows="3"
                      value={editingProduct.shortDescription || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                      placeholder="e.g. Mastercrafted in the Habrenoir ateliers using sculpted box calfskin."
                      className="w-full p-2.5 bg-[#F9F8F6] border border-[#E8E3DC] outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[#857374] uppercase tracking-wider text-[10px] font-semibold">
                        Materials & Craftsmanship Bullet Points (Displayed in the PDP Accordion)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct({
                            ...editingProduct,
                            details: [...(editingProduct.details || []), 'New craftsmanship detail']
                          });
                        }}
                        className="text-[#3D0C15] text-[11px] uppercase tracking-wider font-semibold hover:underline"
                      >
                        + Add Bullet Point
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(editingProduct.details || []).map((bullet, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 bg-[#C5A880] inline-block flex-shrink-0"></span>
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) => {
                              const updated = [...editingProduct.details];
                              updated[idx] = e.target.value;
                              setEditingProduct({ ...editingProduct, details: updated });
                            }}
                            className="flex-grow p-2 bg-[#F9F8F6] border border-[#E8E3DC] outline-none text-[12px]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingProduct.details.filter((_, i) => i !== idx);
                              setEditingProduct({ ...editingProduct, details: updated });
                            }}
                            className="text-[#8C582B] hover:text-[#111111] p-1.5"
                            title="Remove bullet point"
                            aria-label="Remove bullet point"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 3: SIZING & DIMENSIONS */}
              {editActiveSection === 'dimensions' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#857374] uppercase tracking-wider text-[10px] mb-1">
                      Size Label (Displayed above Size Guide on PDP)
                    </label>
                    <input
                      type="text"
                      value={editingProduct.sizeLabel || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, sizeLabel: e.target.value })}
                      placeholder="e.g. Medium (26 cm), EU 42, or Standard Size"
                      className="w-full p-2.5 bg-[#F9F8F6] border border-[#E8E3DC] outline-none"
                    />
                  </div>

                  <span className="block text-[#857374] uppercase tracking-wider text-[10px] font-semibold pt-2">
                    Exact Physical Dimensions (Displayed in Spec Block)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[#857374] text-[9px] uppercase">Width</label>
                      <input
                        type="text"
                        value={editingProduct.dimensions?.width || ''}
                        onChange={(e) => setEditingProduct({
                          ...editingProduct,
                          dimensions: { ...(editingProduct.dimensions || {}), width: e.target.value }
                        })}
                        placeholder="e.g. 26 cm"
                        className="w-full p-2 bg-[#F9F8F6] border border-[#E8E3DC] outline-none text-[11px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#857374] text-[9px] uppercase">Height</label>
                      <input
                        type="text"
                        value={editingProduct.dimensions?.height || ''}
                        onChange={(e) => setEditingProduct({
                          ...editingProduct,
                          dimensions: { ...(editingProduct.dimensions || {}), height: e.target.value }
                        })}
                        placeholder="e.g. 19 cm"
                        className="w-full p-2 bg-[#F9F8F6] border border-[#E8E3DC] outline-none text-[11px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#857374] text-[9px] uppercase">Depth</label>
                      <input
                        type="text"
                        value={editingProduct.dimensions?.depth || ''}
                        onChange={(e) => setEditingProduct({
                          ...editingProduct,
                          dimensions: { ...(editingProduct.dimensions || {}), depth: e.target.value }
                        })}
                        placeholder="e.g. 10 cm"
                        className="w-full p-2 bg-[#F9F8F6] border border-[#E8E3DC] outline-none text-[11px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#857374] text-[9px] uppercase">Strap Drop / Inseam</label>
                      <input
                        type="text"
                        value={editingProduct.dimensions?.strapDrop || ''}
                        onChange={(e) => setEditingProduct({
                          ...editingProduct,
                          dimensions: { ...(editingProduct.dimensions || {}), strapDrop: e.target.value }
                        })}
                        placeholder="e.g. 52 cm"
                        className="w-full p-2 bg-[#F9F8F6] border border-[#E8E3DC] outline-none text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 4: IMAGERY & COLORWAYS */}
              {editActiveSection === 'colors' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-[#857374] uppercase tracking-wider text-[10px] mb-1">
                      Primary Showcase Image URL *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProduct.image || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      className="w-full p-2.5 bg-[#F9F8F6] border border-[#E8E3DC] outline-none font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-[#857374] uppercase tracking-wider text-[10px] font-semibold block">
                          Available Colorway Variations (PDP Color Selector & Swatches)
                        </span>
                        <span className="text-[10px] text-[#857374]">
                          Each colorway gives shoppers selectable swatches and high-definition photography on the PDP.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newColor = {
                            slug: 'edition-' + (editingProduct.availableColors?.length || 1),
                            name: 'New Colorway',
                            hex: '#111111',
                            image: editingProduct.image || '/images/products/bags/vendome-black.jpg',
                            caption: `${editingProduct.name} in New Colorway`
                          };
                          setEditingProduct({
                            ...editingProduct,
                            availableColors: [...(editingProduct.availableColors || []), newColor]
                          });
                        }}
                        className="text-[#3D0C15] text-[11px] uppercase tracking-wider font-semibold hover:underline"
                      >
                        + Add Colorway
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(editingProduct.availableColors || []).map((clr, idx) => (
                        <div
                          key={idx}
                          className="p-4 border border-[#E8E3DC] bg-[#F9F8F6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          {/* Image preview thumbnail */}
                          <div className="w-14 h-16 bg-[#FFFFFF] border border-[#E8E3DC] p-1 flex-shrink-0 flex items-center justify-center">
                            <img
                              src={clr.image || editingProduct.image}
                              alt={clr.name}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 flex-grow">
                            <div>
                              <label className="block text-[#857374] text-[9px] uppercase">Color Name</label>
                              <input
                                type="text"
                                value={clr.name || ''}
                                onChange={(e) => {
                                  const updated = [...editingProduct.availableColors];
                                  updated[idx] = { ...updated[idx], name: e.target.value };
                                  setEditingProduct({ ...editingProduct, availableColors: updated });
                                }}
                                className="w-full p-1.5 bg-[#FFFFFF] border border-[#E8E3DC] text-[11px] outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[#857374] text-[9px] uppercase">Slug</label>
                              <input
                                type="text"
                                value={clr.slug || ''}
                                onChange={(e) => {
                                  const updated = [...editingProduct.availableColors];
                                  updated[idx] = { ...updated[idx], slug: e.target.value };
                                  setEditingProduct({ ...editingProduct, availableColors: updated });
                                }}
                                className="w-full p-1.5 bg-[#FFFFFF] border border-[#E8E3DC] text-[11px] outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[#857374] text-[9px] uppercase">Hex Swatch</label>
                              <div className="flex items-center space-x-1">
                                <input
                                  type="color"
                                  value={clr.hex || '#111111'}
                                  onChange={(e) => {
                                    const updated = [...editingProduct.availableColors];
                                    updated[idx] = { ...updated[idx], hex: e.target.value };
                                    setEditingProduct({ ...editingProduct, availableColors: updated });
                                  }}
                                  className="w-7 h-7 p-0 border border-[#E8E3DC] cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={clr.hex || ''}
                                  onChange={(e) => {
                                    const updated = [...editingProduct.availableColors];
                                    updated[idx] = { ...updated[idx], hex: e.target.value };
                                    setEditingProduct({ ...editingProduct, availableColors: updated });
                                  }}
                                  className="w-20 p-1.5 bg-[#FFFFFF] border border-[#E8E3DC] text-[11px] outline-none"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[#857374] text-[9px] uppercase">Image URL</label>
                              <input
                                type="text"
                                value={clr.image || ''}
                                onChange={(e) => {
                                  const updated = [...editingProduct.availableColors];
                                  updated[idx] = { ...updated[idx], image: e.target.value };
                                  setEditingProduct({ ...editingProduct, availableColors: updated });
                                }}
                                className="w-full p-1.5 bg-[#FFFFFF] border border-[#E8E3DC] text-[11px] outline-none"
                              />
                            </div>
                          </div>

                          {editingProduct.availableColors.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = editingProduct.availableColors.filter((_, i) => i !== idx);
                                setEditingProduct({ ...editingProduct, availableColors: updated });
                              }}
                              className="text-[#8C582B] hover:text-[#111111] text-[11px] p-1.5 uppercase tracking-wider inline-flex items-center space-x-1"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <span>Remove</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Modal Actions */}
              <div className="pt-4 border-t border-[#E8E3DC] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 border border-[#E8E3DC] uppercase text-[10px] tracking-wider hover:border-[#111111]"
                >
                  Cancel
                </button>

                <div className="space-x-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#3D0C15] text-[#FFFFFF] uppercase text-[10px] tracking-wider font-semibold hover:bg-[#140002] transition-colors"
                  >
                    Save All Creation Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          ADD NEW PRODUCT MODAL (Full PDP Details)
         ========================================================================= */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-[170] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#111111]/60 backdrop-blur-xs"
            onClick={() => setIsAddProductOpen(false)}
          />

          <div className="relative w-full max-w-4xl bg-[#FFFFFF] border border-[#E8E3DC] p-6 sm:p-10 z-10 max-h-[92vh] overflow-y-auto font-sans">
            <div className="flex items-center justify-between border-b border-[#E8E3DC] pb-4 mb-6">
              <div>
                <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-[#C5A880] font-semibold block">
                  ACCRA WORKSHOP & CATALOG
                </span>
                <h3 className="font-serif text-[24px] text-[#111111]">
                  Catalog New Creation
                </h3>
              </div>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="p-2 text-[#524344] hover:text-[#3D0C15] transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Sub-nav tabs */}
            <div className="flex space-x-2 border-b border-[#E8E3DC] mb-6 text-[11px] uppercase tracking-wider overflow-x-auto">
              <button
                type="button"
                onClick={() => setAddActiveSection('core')}
                className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 ${
                  addActiveSection === 'core' ? 'border-[#3D0C15] text-[#3D0C15]' : 'border-transparent text-[#857374]'
                }`}
              >
                1. Core & Pricing
              </button>
              <button
                type="button"
                onClick={() => setAddActiveSection('details')}
                className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 ${
                  addActiveSection === 'details' ? 'border-[#3D0C15] text-[#3D0C15]' : 'border-transparent text-[#857374]'
                }`}
              >
                2. Story & Craftsmanship Bullets ({newProduct.details?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setAddActiveSection('dimensions')}
                className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 ${
                  addActiveSection === 'dimensions' ? 'border-[#3D0C15] text-[#3D0C15]' : 'border-transparent text-[#857374]'
                }`}
              >
                3. Sizing & Dimensions
              </button>
              <button
                type="button"
                onClick={() => setAddActiveSection('colors')}
                className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 ${
                  addActiveSection === 'colors' ? 'border-[#3D0C15] text-[#3D0C15]' : 'border-transparent text-[#857374]'
                }`}
              >
                4. Images & Colorways ({newProduct.availableColors?.length || 1})
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="space-y-6 text-[12px]">
              
              {/* SECTION 1: CORE */}
              {addActiveSection === 'core' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#857374] uppercase tracking-wider text-[10px] mb-1">
                        Creation Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="e.g. The Ashanti Column Bucket Bag"
                        className="w-full p-2.5 bg-[#F9F8F6] border border-[#E8E3DC] outline-none font-serif text-[16px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#857374] uppercase tracking-wider text-[10px] mb-1">
                        Reference SKU *
                      </label>
                      <input
                        type="text"
                        required
                        value={newProduct.ref}
                        onChange={(e) => setNewProduct({ ...newProduct, ref: e.target.value })}
                        className="w-full p-2.5 bg-[#F9F8F6] border border-[#E8E3DC] outline-none font-mono text-[13px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[#857374] uppercase tracking-wider text-[10px] mb-1">Category *</label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="w-full p-2.5 bg-[#F9F8F6] border border-[#E8E3DC] outline-none"
                      >
                        <option value="bags">Bags & Leather Goods</option>
                        <option value="shoes">Footwear & Shoes</option>
                        <option value="shirts">Ready-to-Wear Shirts</option>
                        <option value="blazers">Tailoring & Blazers</option>
                        <option value="accessories">Belts & Accessories</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#857374] uppercase tracking-wider text-[10px] mb-1">Subcategory</label>
                      <input
                        type="text"
                        value={newProduct.subcategory}
                        onChange={(e) => setNewProduct({ ...newProduct, subcategory: e.target.value })}
                        placeholder="e.g. Leather Goods, Tailoring"
                        className="w-full p-2.5 bg-[#F9F8F6] border border-[#E8E3DC] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#857374] uppercase tracking-wider text-[10px] mb-1">Gender</label>
                      <select
                        value={newProduct.gender}
                        onChange={(e) => setNewProduct({ ...newProduct, gender: e.target.value })}
                        className="w-full p-2.5 bg-[#F9F8F6] border border-[#E8E3DC] outline-none"
                      >
                        <option value="women">Women</option>
                        <option value="men">Men</option>
                        <option value="unisex">Unisex</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[#857374] uppercase tracking-wider text-[10px] mb-1">Price in GHS (GH₵) *</label>
                      <input
                        type="number"
                        required
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="w-full p-2.5 bg-[#F9F8F6] border border-[#E8E3DC] outline-none font-semibold text-[#3D0C15] text-[15px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#857374] uppercase tracking-wider text-[10px] mb-1">Stock Count *</label>
                      <input
                        type="number"
                        required
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        className="w-full p-2.5 bg-[#F9F8F6] border border-[#E8E3DC] outline-none font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[#857374] uppercase tracking-wider text-[10px] mb-1">Badge</label>
                      <input
                        type="text"
                        value={newProduct.badge}
                        onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
                        placeholder="e.g. NEW ARRIVAL, BESTSELLER"
                        className="w-full p-2.5 bg-[#F9F8F6] border border-[#E8E3DC] outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 2: EDITORIAL DESCRIPTION & BULLETS */}
              {addActiveSection === 'details' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#857374] uppercase tracking-wider text-[10px] mb-1">
                      Short Editorial Description (Appears below title on PDP & Card)
                    </label>
                    <textarea
                      rows="3"
                      value={newProduct.shortDescription}
                      onChange={(e) => setNewProduct({ ...newProduct, shortDescription: e.target.value })}
                      placeholder="e.g. Mastercrafted in the Habrenoir ateliers using sculpted box calfskin."
                      className="w-full p-2.5 bg-[#F9F8F6] border border-[#E8E3DC] outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[#857374] uppercase tracking-wider text-[10px] font-semibold">
                        Materials & Craftsmanship Bullet Points (Displayed in the PDP Accordion)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setNewProduct({
                            ...newProduct,
                            details: [...(newProduct.details || []), 'New craftsmanship detail']
                          });
                        }}
                        className="text-[#3D0C15] text-[11px] uppercase tracking-wider font-semibold hover:underline"
                      >
                        + Add Bullet Point
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(newProduct.details || []).map((bullet, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 bg-[#C5A880] inline-block flex-shrink-0"></span>
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) => {
                              const updated = [...newProduct.details];
                              updated[idx] = e.target.value;
                              setNewProduct({ ...newProduct, details: updated });
                            }}
                            className="flex-grow p-2 bg-[#F9F8F6] border border-[#E8E3DC] outline-none text-[12px]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = newProduct.details.filter((_, i) => i !== idx);
                              setNewProduct({ ...newProduct, details: updated });
                            }}
                            className="text-[#8C582B] hover:text-[#111111] p-1.5"
                            title="Remove bullet point"
                            aria-label="Remove bullet point"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 3: SIZING & DIMENSIONS */}
              {addActiveSection === 'dimensions' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#857374] uppercase tracking-wider text-[10px] mb-1">
                      Size Label (Displayed above Size Guide on PDP)
                    </label>
                    <input
                      type="text"
                      value={newProduct.sizeLabel}
                      onChange={(e) => setNewProduct({ ...newProduct, sizeLabel: e.target.value })}
                      placeholder="e.g. Medium (26 cm), EU 42, or Standard Size"
                      className="w-full p-2.5 bg-[#F9F8F6] border border-[#E8E3DC] outline-none"
                    />
                  </div>

                  <span className="block text-[#857374] uppercase tracking-wider text-[10px] font-semibold pt-2">
                    Exact Physical Dimensions (Displayed in Spec Block)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[#857374] text-[9px] uppercase">Width</label>
                      <input
                        type="text"
                        value={newProduct.dimensions?.width || ''}
                        onChange={(e) => setNewProduct({
                          ...newProduct,
                          dimensions: { ...(newProduct.dimensions || {}), width: e.target.value }
                        })}
                        placeholder="e.g. 26 cm"
                        className="w-full p-2 bg-[#F9F8F6] border border-[#E8E3DC] outline-none text-[11px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#857374] text-[9px] uppercase">Height</label>
                      <input
                        type="text"
                        value={newProduct.dimensions?.height || ''}
                        onChange={(e) => setNewProduct({
                          ...newProduct,
                          dimensions: { ...(newProduct.dimensions || {}), height: e.target.value }
                        })}
                        placeholder="e.g. 19 cm"
                        className="w-full p-2 bg-[#F9F8F6] border border-[#E8E3DC] outline-none text-[11px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#857374] text-[9px] uppercase">Depth</label>
                      <input
                        type="text"
                        value={newProduct.dimensions?.depth || ''}
                        onChange={(e) => setNewProduct({
                          ...newProduct,
                          dimensions: { ...(newProduct.dimensions || {}), depth: e.target.value }
                        })}
                        placeholder="e.g. 10 cm"
                        className="w-full p-2 bg-[#F9F8F6] border border-[#E8E3DC] outline-none text-[11px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#857374] text-[9px] uppercase">Strap Drop / Inseam</label>
                      <input
                        type="text"
                        value={newProduct.dimensions?.strapDrop || ''}
                        onChange={(e) => setNewProduct({
                          ...newProduct,
                          dimensions: { ...(newProduct.dimensions || {}), strapDrop: e.target.value }
                        })}
                        placeholder="e.g. 52 cm"
                        className="w-full p-2 bg-[#F9F8F6] border border-[#E8E3DC] outline-none text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 4: IMAGERY & COLORWAYS */}
              {addActiveSection === 'colors' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-[#857374] uppercase tracking-wider text-[10px] mb-1">
                      Primary Showcase Image URL *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                      className="w-full p-2.5 bg-[#F9F8F6] border border-[#E8E3DC] outline-none font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-[#857374] uppercase tracking-wider text-[10px] font-semibold block">
                          Available Colorway Variations (PDP Color Selector & Swatches)
                        </span>
                        <span className="text-[10px] text-[#857374]">
                          Each colorway gives shoppers selectable swatches and high-definition photography on the PDP.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newColor = {
                            slug: 'edition-' + (newProduct.availableColors?.length || 1),
                            name: 'New Colorway',
                            hex: '#111111',
                            image: newProduct.image || '/images/products/bags/vendome-black.jpg',
                            caption: `${newProduct.name || 'Creation'} in New Colorway`
                          };
                          setNewProduct({
                            ...newProduct,
                            availableColors: [...(newProduct.availableColors || []), newColor]
                          });
                        }}
                        className="text-[#3D0C15] text-[11px] uppercase tracking-wider font-semibold hover:underline"
                      >
                        + Add Colorway
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(newProduct.availableColors || []).map((clr, idx) => (
                        <div
                          key={idx}
                          className="p-4 border border-[#E8E3DC] bg-[#F9F8F6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          {/* Image preview thumbnail */}
                          <div className="w-14 h-16 bg-[#FFFFFF] border border-[#E8E3DC] p-1 flex-shrink-0 flex items-center justify-center">
                            <img
                              src={clr.image || newProduct.image}
                              alt={clr.name}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 flex-grow">
                            <div>
                              <label className="block text-[#857374] text-[9px] uppercase">Color Name</label>
                              <input
                                type="text"
                                value={clr.name}
                                onChange={(e) => {
                                  const updated = [...newProduct.availableColors];
                                  updated[idx] = { ...updated[idx], name: e.target.value };
                                  setNewProduct({ ...newProduct, availableColors: updated });
                                }}
                                className="w-full p-1.5 bg-[#FFFFFF] border border-[#E8E3DC] text-[11px] outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[#857374] text-[9px] uppercase">Slug</label>
                              <input
                                type="text"
                                value={clr.slug}
                                onChange={(e) => {
                                  const updated = [...newProduct.availableColors];
                                  updated[idx] = { ...updated[idx], slug: e.target.value };
                                  setNewProduct({ ...newProduct, availableColors: updated });
                                }}
                                className="w-full p-1.5 bg-[#FFFFFF] border border-[#E8E3DC] text-[11px] outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[#857374] text-[9px] uppercase">Hex Swatch</label>
                              <div className="flex items-center space-x-1">
                                <input
                                  type="color"
                                  value={clr.hex || '#111111'}
                                  onChange={(e) => {
                                    const updated = [...newProduct.availableColors];
                                    updated[idx] = { ...updated[idx], hex: e.target.value };
                                    setNewProduct({ ...newProduct, availableColors: updated });
                                  }}
                                  className="w-7 h-7 p-0 border border-[#E8E3DC] cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={clr.hex}
                                  onChange={(e) => {
                                    const updated = [...newProduct.availableColors];
                                    updated[idx] = { ...updated[idx], hex: e.target.value };
                                    setNewProduct({ ...newProduct, availableColors: updated });
                                  }}
                                  className="w-20 p-1.5 bg-[#FFFFFF] border border-[#E8E3DC] text-[11px] outline-none"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[#857374] text-[9px] uppercase">Image URL</label>
                              <input
                                type="text"
                                value={clr.image}
                                onChange={(e) => {
                                  const updated = [...newProduct.availableColors];
                                  updated[idx] = { ...updated[idx], image: e.target.value };
                                  setNewProduct({ ...newProduct, availableColors: updated });
                                }}
                                className="w-full p-1.5 bg-[#FFFFFF] border border-[#E8E3DC] text-[11px] outline-none"
                              />
                            </div>
                          </div>

                          {newProduct.availableColors.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = newProduct.availableColors.filter((_, i) => i !== idx);
                                setNewProduct({ ...newProduct, availableColors: updated });
                              }}
                              className="text-[#8C582B] hover:text-[#111111] text-[11px] p-1.5 uppercase tracking-wider inline-flex items-center space-x-1"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <span>Remove</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[#E8E3DC] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-5 py-2.5 border border-[#E8E3DC] uppercase text-[10px] tracking-wider hover:border-[#111111]"
                >
                  Cancel
                </button>

                <div className="space-x-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#3D0C15] text-[#FFFFFF] uppercase text-[10px] tracking-wider font-semibold hover:bg-[#140002] transition-colors"
                  >
                    Register Creation into Catalog
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
};
