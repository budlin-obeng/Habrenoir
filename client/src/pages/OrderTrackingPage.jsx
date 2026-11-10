import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { HabrenoirLogo } from '../components/HabrenoirLogo';

export const OrderTrackingPage = () => {
  const { t } = useLanguage();
  const { formatCurrency } = useCart();
  const { user, isSignedIn, openAuthModal } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialOrder = searchParams.get('order') || '';
  const [query, setQuery] = useState(initialOrder);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [accountOrders, setAccountOrders] = useState([]);
  const [loadingAccountOrders, setLoadingAccountOrders] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Auto-fetch orders placed with the logged-in user's email
  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!user?.email) {
        setAccountOrders([]);
        return;
      }
      setLoadingAccountOrders(true);
      try {
        const res = await fetch(`/api/orders?email=${encodeURIComponent(user.email)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setAccountOrders(json.data);
            // If user has orders and no specific order has been selected in URL, auto-load their latest order
            if (json.data.length > 0 && !initialOrder) {
              setCurrentOrder(json.data[0]);
              setQuery(json.data[0].reference);
            }
          }
        }
      } catch (e) {
        console.warn('Account orders lookup notice:', e);
      } finally {
        setLoadingAccountOrders(false);
      }
    };

    fetchUserOrders();
  }, [user?.email, initialOrder]);

  const fetchOrder = async (ref) => {
    if (!ref || !ref.trim()) return;
    setLoading(true);
    setNotFound(false);

    const term = ref.trim();

    try {
      // 1. If user typed an email, query orders by email
      if (term.includes('@')) {
        const emailRes = await fetch(`/api/orders?email=${encodeURIComponent(term)}`);
        if (emailRes.ok) {
          const emailJson = await emailRes.json();
          if (emailJson.success && Array.isArray(emailJson.data) && emailJson.data.length > 0) {
            setAccountOrders(emailJson.data);
            setCurrentOrder(emailJson.data[0]);
            setLoading(false);
            return;
          }
        }
      }

      // 2. Direct lookup by reference or search term
      let cleanRef = term.toUpperCase();
      if (!cleanRef.startsWith('HBN-') && !cleanRef.includes('@') && !cleanRef.includes(' ')) {
        cleanRef = 'HBN-' + cleanRef;
      }

      const res = await fetch(`/api/orders/${encodeURIComponent(cleanRef)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setCurrentOrder(json.data);
          setLoading(false);
          return;
        }
      }

      // 3. Fallback search across reference, phone, email, and trackingNumber
      const searchRes = await fetch(`/api/orders?search=${encodeURIComponent(term)}`);
      if (searchRes.ok) {
        const json = await searchRes.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setCurrentOrder(json.data[0]);
          if (json.data.length > 1) {
            setAccountOrders(json.data);
          }
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Backend order lookup notice:', e);
    }

    // Default sample if not found in database and matches sample pattern
    if (term.toUpperCase().includes('88204') || term.toUpperCase().includes('SAMPLE')) {
      setCurrentOrder({
        reference: 'HBN-88204',
        trackingNumber: 'DHL-GH-7921829',
        customerName: 'Nana Kwame Boateng',
        customerPhone: '+233 24 419 8820',
        shipping: {
          address: 'No. 14 Senchi Street, Airport Residential',
          city: 'Accra',
          country: 'Ghana'
        },
        items: [
          {
            name: 'The Vendôme Sculpted Handbag',
            color: 'Deep Burgundy',
            size: 'Medium (26 cm)',
            price: 24500,
            quantity: 1
          }
        ],
        amount: 24500,
        status: 'benchwork',
        createdAt: '2026-10-28T14:20:00Z'
      });
      setLoading(false);
      return;
    }

    setNotFound(true);
    setLoading(false);
  };

  useEffect(() => {
    if (initialOrder) {
      fetchOrder(initialOrder);
    }
  }, [initialOrder]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrder(query);
  };

  // Determine active step from status
  const getStepIndex = (status) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'benchwork': return 2;
      case 'dispatched': return 3;
      case 'delivered': return 4;
      default: return 1;
    }
  };

  const activeStep = currentOrder ? getStepIndex(currentOrder.status) : 2;

  const steps = [
    {
      title: 'Allocation Confirmed',
      desc: 'Order officially logged at Habrenoir ledger. Raw French box calfskin allocated at Accra workshop.',
      stepIndex: 0
    },
    {
      title: 'Settlement Authorized',
      desc: 'Secure Ghanaian Cedis payment verified via Paystack (3D-Secure / Mobile Money).',
      stepIndex: 1
    },
    {
      title: 'Master Artisan Benchwork',
      desc: 'Saddle stitching, wax edge burnishing, and hand-cast lost-wax Ghanaian brass lock assembly.',
      stepIndex: 2
    },
    {
      title: 'Courier Dispatch',
      desc: 'Sealed into signature presentation box with delivery waybill. Courier dispatched.',
      stepIndex: 3
    },
    {
      title: 'White-Glove Handover',
      desc: 'Direct handover by uniformed courier. Client signature and verification.',
      stepIndex: 4
    }
  ];

  return (
    <main className="w-full min-h-screen bg-[#F9F8F6] pt-24 sm:pt-32 pb-24 font-sans text-[#111111]">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8">
        
        {/* Header Breadcrumb */}
        <div className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em] text-[#857374] mb-8">
          <Link to="/" className="hover:text-[#111111]">Home</Link>
          <span>/</span>
          <span className="text-[#3D0C15] font-semibold">{t('order_tracking')}</span>
        </div>

        {/* Title */}
        <div className="border-b border-[#E8E3DC] pb-8 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#725B38] font-semibold block mb-2">
              DISPATCH & VALET COURIER
            </span>
            <h1 className="font-serif text-[32px] sm:text-[48px] text-[#111111] font-normal leading-tight">
              Live Order Tracking
            </h1>
            <p className="font-sans text-[13px] text-[#524344] mt-2 max-w-xl leading-relaxed">
              Monitor the journey of your creation from lost-wax brass benchwork to white-glove arrival.
            </p>
          </div>
          <div className="flex items-center space-x-3 bg-[#FFFFFF] border border-[#E8E3DC] p-3.5 self-start md:self-auto">
            <HabrenoirLogo color="#3D0C15" className="w-10 h-10 flex-shrink-0" />
            <div className="text-left font-sans text-[9px] uppercase tracking-wider text-[#857374]">
              <span className="block font-semibold text-[#111111]">Habrenoir Registry</span>
              <span>Authentic Provenance</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            USER ACCOUNT ORDERS SECTION
           ========================================================================= */}
        {isSignedIn && user ? (
          <div className="mb-12 p-6 sm:p-8 bg-[#FFFFFF] border border-[#E8E3DC]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E8E3DC]">
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 bg-[#3D0C15] text-[#FFFFFF] flex items-center justify-center font-serif text-[18px]">
                  {(user.fullName || 'V')[0].toUpperCase()}
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold block">
                    AUTHENTICATED CLIENT ACCOUNT
                  </span>
                  <h2 className="font-serif text-[22px] text-[#111111]">
                    {user.fullName || 'Valued Client'}
                  </h2>
                  <span className="text-[11px] text-[#524344]">{user.email}</span>
                </div>
              </div>

              <div className="text-left sm:text-right font-sans text-[11px]">
                <span className="text-[#857374] block uppercase tracking-wider">Creations in Registry:</span>
                <strong className="text-[15px] text-[#3D0C15]">
                  {loadingAccountOrders ? 'Loading...' : `${accountOrders.length} Order(s)`}
                </strong>
              </div>
            </div>

            {/* Account Orders List */}
            {loadingAccountOrders ? (
              <div className="py-8 text-center text-[12px] text-[#857374] animate-pulse">
                Accessing your registered creations...
              </div>
            ) : accountOrders.length > 0 ? (
              <div className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase tracking-widest text-[#857374] font-semibold">
                    YOUR RECENT CREATIONS & DISPATCHES:
                  </span>
                  <span className="text-[11px] text-[#725B38]">Click any creation to inspect timeline</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {accountOrders.map((ord) => {
                    const isSelected = currentOrder?.reference === ord.reference;
                    return (
                      <div
                        key={ord.reference}
                        onClick={() => {
                          setCurrentOrder(ord);
                          setQuery(ord.reference);
                          setNotFound(false);
                          setSearchParams({ order: ord.reference });
                        }}
                        className={`p-4 border transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'border-[#3D0C15] bg-[#F9F8F6] ring-1 ring-[#3D0C15]'
                            : 'border-[#E8E3DC] bg-[#FFFFFF] hover:border-[#111111]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono font-bold text-[#111111] text-[12px]">
                            {ord.reference}
                          </span>
                          <span className="px-2 py-0.5 bg-[#FFFFFF] border border-[#E8E3DC] text-[9px] uppercase font-semibold text-[#3D0C15]">
                            {ord.status || 'Pending'}
                          </span>
                        </div>

                        <div className="text-[11px] text-[#524344] mb-2 flex items-center justify-between">
                          <span>{new Date(ord.createdAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <strong className="text-[#111111]">{formatCurrency(ord.amount)}</strong>
                        </div>

                        <div className="text-[10px] text-[#857374] truncate">
                          {(ord.items || []).map(i => i.name).join(', ') || 'Luxury Goods'}
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-[#E8E3DC]/60 text-[10px] uppercase tracking-wider font-semibold flex items-center justify-between">
                          <span className={isSelected ? 'text-[#3D0C15]' : 'text-[#725B38]'}>
                            {isSelected ? '✦ Tracking Active' : 'Track This Order'}
                          </span>
                          <svg className="w-3 h-3 text-[#3D0C15]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="pt-6 text-[12px] text-[#524344] leading-relaxed">
                No past orders registered under <strong className="text-[#111111]">{user.email}</strong> yet. When you complete checkout with this email, orders will automatically appear here.
              </div>
            )}
          </div>
        ) : (
          <div className="mb-12 p-6 bg-[#FFFFFF] border border-[#E8E3DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold block">
                HAVE A CLIENT ACCOUNT?
              </span>
              <p className="text-[12px] text-[#524344]">
                Sign in to view all creations and real-time courier dispatches placed with your account without needing reference numbers.
              </p>
            </div>
            <button
              onClick={openAuthModal}
              className="px-6 py-2.5 bg-[#3D0C15] text-[#FFFFFF] text-[10px] uppercase tracking-wider font-semibold hover:bg-[#140002] transition-colors whitespace-nowrap self-start sm:self-auto"
            >
              Sign In to View Your Orders
            </button>
          </div>
        )}

        {/* Search Bar for Order Lookup (Supports Reference, Email, or Phone) */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-[10px] uppercase tracking-widest text-[#857374] font-semibold">
              LOOKUP BY REFERENCE, EMAIL, OR PHONE
            </span>
          </div>

          <form onSubmit={handleSearch} className="max-w-xl">
            <div className="flex border border-[#E8E3DC] bg-[#FFFFFF]">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Order reference (e.g. HBN-478704), email, or phone..."
                className="flex-1 p-3 sm:p-3.5 bg-transparent outline-none font-sans text-[12px] sm:text-[13px] text-[#111111] tracking-wider"
              />
              <button
                type="submit"
                className="px-4 sm:px-6 bg-[#3D0C15] text-[#FFFFFF] font-sans text-[10px] uppercase tracking-[0.22em] hover:bg-[#140002] transition-colors whitespace-nowrap"
              >
                {loading ? 'Searching...' : (
                  <>
                    <span className="hidden sm:inline">Locate Order</span>
                    <span className="sm:hidden">Track</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {notFound && (
          <div className="p-8 bg-[#FFFFFF] border border-[#E8E3DC] text-center mb-12">
            <h4 className="font-serif text-[20px] text-[#111111]">Order Not Found</h4>
            <p className="text-[12px] text-[#857374] mt-1.5 max-w-lg mx-auto">
              We could not find an order matching "{query}". Please verify your reference number or sign in with the email address used during Paystack checkout.
            </p>
          </div>
        )}

        {!currentOrder && !notFound && !loading && (
          <div className="p-12 bg-[#FFFFFF] border border-[#E8E3DC] text-center max-w-2xl mb-12">
            <div className="w-10 h-10 mx-auto mb-3 border border-[#C5A880] flex items-center justify-center text-[#3D0C15]">
              <svg className="w-5 h-5 text-[#C5A880]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h4 className="font-serif text-[22px] text-[#111111] mb-2">Track Your Bespoke Order</h4>
            <p className="font-sans text-[12px] text-[#524344] leading-relaxed max-w-md mx-auto">
              Please enter your order reference (found on your Paystack receipt or SMS notification) in the field above to view real-time progress and courier delivery details.
            </p>
          </div>
        )}

        {currentOrder && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT 7 COLS: 5-STAGE EDITORIAL TIMELINE */}
            <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E8E3DC] p-6 sm:p-10">
              <div className="flex items-center justify-between border-b border-[#E8E3DC] pb-4 mb-8">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#857374]">Order Reference</span>
                  <h3 className="font-serif text-[24px] text-[#111111] font-normal">
                    {currentOrder.reference}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-widest text-[#857374] block">Current Stage</span>
                  <span className="px-2.5 py-1 bg-[#3D0C15] text-[#FFFFFF] font-sans text-[10px] uppercase tracking-wider font-semibold">
                    {currentOrder.status || 'benchwork'}
                  </span>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="space-y-8 relative pl-6 border-l border-[#E8E3DC] ml-3">
                {steps.map((st, i) => {
                  const isDone = i <= activeStep;
                  const isCurrent = i === activeStep;

                  return (
                    <div key={i} className="relative group">
                      {/* Step Marker Dot */}
                      <div
                        className={`absolute -left-[31px] top-1 w-4 h-4 border-2 transition-colors ${
                          isDone
                            ? 'bg-[#3D0C15] border-[#3D0C15]'
                            : 'bg-[#FFFFFF] border-[#E8E3DC]'
                        } ${isCurrent ? 'ring-4 ring-[#C5A880]/30' : ''}`}
                      />

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] uppercase tracking-widest font-semibold ${isDone ? 'text-[#3D0C15]' : 'text-[#857374]'}`}>
                            Stage 0{i + 1}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 bg-[#C5A880] text-[#140002] text-[8px] uppercase font-bold tracking-widest">
                              ACTIVE ATELIER BENCH
                            </span>
                          )}
                        </div>
                        <h4 className={`font-serif text-[18px] mt-0.5 ${isDone ? 'text-[#111111]' : 'text-[#857374]'}`}>
                          {st.title}
                        </h4>
                        <p className="font-sans text-[12px] text-[#524344] leading-relaxed mt-1">
                          {st.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT 5 COLS: DISPATCH DOSSIER & ITEMS */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Dossier Card */}
              <div className="bg-[#FFFFFF] border border-[#E8E3DC] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.24em] text-[#C5A880] font-semibold block">
                    VALET DISPATCH DOSSIER
                  </span>
                  <HabrenoirLogo color="#3D0C15" className="w-5 h-5 flex-shrink-0" />
                </div>

                <div className="space-y-3 font-sans text-[11px] border-b border-[#E8E3DC] pb-4">
                  <div className="flex justify-between">
                    <span className="text-[#857374] uppercase">Recipient:</span>
                    <strong className="text-[#111111]">{currentOrder.customerName || 'Valued Client'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#857374] uppercase">Mobile Number:</span>
                    <span className="text-[#3D0C15] font-semibold">{currentOrder.customerPhone || '+233 24 419 8820'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#857374] uppercase">Destination:</span>
                    <span className="text-[#111111] text-right max-w-[200px]">
                      {currentOrder.shipping?.address || 'Airport Residential Area, Accra'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#857374] uppercase">Waybill / Courier:</span>
                    <span className="text-[#725B38] font-medium">{currentOrder.trackingNumber || 'DHL Diplomatic Valet'}</span>
                  </div>
                </div>

                {/* Items in order */}
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#857374] block mb-3 font-semibold">
                    CREATIONS ALLOCATED
                  </span>
                  <div className="space-y-3">
                    {(currentOrder.items || []).map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-[#F9F8F6] border border-[#E8E3DC]">
                        <div>
                          <strong className="font-serif text-[14px] text-[#111111] block">
                            {it.name}
                          </strong>
                          <span className="text-[10px] text-[#857374]">
                            {it.color} · {it.size} · Qty: {it.quantity || it.qty || 1}
                          </span>
                        </div>
                        <span className="font-sans text-[12px] font-semibold text-[#111111]">
                          {formatCurrency(it.price)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-4 mt-3 border-t border-[#E8E3DC] text-[12px]">
                    <span className="uppercase text-[#857374] tracking-wider">Total Settlement</span>
                    <strong className="font-serif text-[18px] text-[#3D0C15]">
                      {formatCurrency(currentOrder.amount || currentOrder.total)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Concierge Help Box */}
              <div className="bg-[#140002] text-[#FFFFFF] p-6 border border-[#3D0C15] space-y-2 text-[12px]">
                <span className="text-[10px] uppercase tracking-widest text-[#C5A880] block font-semibold">
                  NEED DISPATCH ASSISTANCE?
                </span>
                <p className="text-[#ECE7DF] font-light leading-relaxed">
                  Our Accra Flagship concierge desk is available Monday to Saturday for itinerary modifications or bespoke courier coordination.
                </p>
                <div className="pt-2">
                  <a href="tel:+233302948810" className="text-[#C5A880] underline font-medium tracking-wider">
                    Direct Concierge: +233 (0) 30 294 8810
                  </a>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </main>
  );
};
