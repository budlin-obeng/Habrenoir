import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { HabrenoirLogo } from './HabrenoirLogo';

export const CartDrawer = () => {
  const {
    items,
    count,
    subtotal,
    total,
    formatCurrency,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
    initializePaystackCheckout,
    isCheckingOut
  } = useCart();

  const { user } = useAuth();

  // Multi-step checkout state: 'items' or 'details'
  const [step, setStep] = useState('items');

  const [customerDetails, setCustomerDetails] = useState({
    name: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    address: 'Airport Residential Area, Villa 8',
    city: 'Accra',
    country: 'Ghana',
    deliveryNotes: '',
    giftPackaging: true
  });

  const [detailsError, setDetailsError] = useState(null);

  if (!isDrawerOpen) return null;

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    if (!customerDetails.name.trim() || !customerDetails.phone.trim()) {
      setDetailsError('Please provide your Full Name and Mobile Phone Number.');
      return;
    }
    setDetailsError(null);
    initializePaystackCheckout(customerDetails);
  };

  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#111111]/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => {
          setStep('items');
          closeDrawer();
        }}
        aria-hidden="true"
      />

      {/* Cart Drawer */}
      <aside className="relative w-full max-w-full sm:max-w-md bg-[#F9F8F6] border-l border-[#E8E3DC] h-full flex flex-col justify-between z-10 shadow-none rounded-none animate-fade-in">
        {/* Header */}
        <div className="h-20 px-6 border-b border-[#E8E3DC] flex items-center justify-between bg-[#F9F8F6]">
          <div className="flex items-center space-x-2">
            <span className="font-serif text-[20px] uppercase tracking-[0.14em] text-[#111111]">
              {step === 'items' ? 'Shopping Bag' : 'Delivery & Paystack Checkout'}
            </span>
            <span className="font-sans text-[12px] text-[#725B38] tracking-widest font-medium">
              ({count})
            </span>
          </div>
          <button
            onClick={() => {
              setStep('items');
              closeDrawer();
            }}
            className="w-10 h-10 flex items-center justify-center text-[#111111] hover:text-[#3D0C15] transition-colors rounded-none"
            aria-label="Close Shopping Bag"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Complimentary Delivery Banner */}
        <div className="px-6 py-2.5 bg-[#ECE7DF] border-b border-[#E8E3DC] flex items-center justify-between text-[#524344]">
          <div className="flex items-center space-x-2">
            <svg className="w-3.5 h-3.5 text-[#C5A880]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <span className="font-sans text-[9px] tracking-[0.2em] uppercase font-semibold">
              Complimentary Doorstep Delivery
            </span>
          </div>
          <span className="font-sans text-[9px] tracking-widest uppercase text-[#725B38]">
            Greater Accra & Nationwide Ghana
          </span>
        </div>

        {/* STEP 1: LINE ITEMS VIEW */}
        {step === 'items' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <HabrenoirLogo color="#3D0C15" className="w-10 h-10 mb-3" />
                <h5 className="font-serif text-[18px] text-[#111111] uppercase tracking-wide">
                  Your shopping bag is empty
                </h5>
                <p className="font-sans text-[13px] text-[#767676] mt-1.5 max-w-[260px] leading-relaxed">
                  Explore our signature creations handcrafted across our Accra and European ateliers.
                </p>
                <button
                  onClick={closeDrawer}
                  className="mt-6 px-6 py-3 bg-[#3D0C15] text-[#FFFFFF] font-sans text-[10px] uppercase tracking-[0.24em] rounded-none hover:bg-[#140002] transition-colors"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              items.map((item, idx) => (
                <div
                  key={`${item.id}-${item.color}-${item.size}-${idx}`}
                  className="p-4 bg-[#FFFFFF] border border-[#E8E3DC] flex space-x-4 relative group"
                >
                  <div className="w-20 h-24 bg-[#F9F8F6] border border-[#E8E3DC] flex-shrink-0 flex items-center justify-center p-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start pr-6">
                        <h4 className="font-sans text-[13px] text-[#111111] leading-tight font-normal">
                          {item.name}
                        </h4>
                      </div>
                      <span className="font-sans text-[10px] text-[#857374] tracking-wider block mt-1">
                        {item.ref}
                      </span>
                      <div className="flex items-center space-x-2 mt-1">
                        <span
                          className="w-2 h-2 inline-block border border-[#857374]/30"
                          style={{ backgroundColor: item.colorHex || '#111111' }}
                        />
                        <span className="font-sans text-[10px] text-[#524344]">
                          {item.color} · {item.size}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#F4F1EC]">
                      <div className="flex items-center border border-[#E8E3DC]">
                        <button
                          onClick={() => updateQuantity(item.id, item.color, item.size, -1)}
                          className="w-6 h-6 flex items-center justify-center text-[#111111] hover:bg-[#F9F8F6]"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-sans text-[11px] text-[#111111]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.color, item.size, 1)}
                          className="w-6 h-6 flex items-center justify-center text-[#111111] hover:bg-[#F9F8F6]"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-sans text-[13px] font-semibold text-[#111111]">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id, item.color, item.size)}
                    className="absolute top-3 right-3 text-[#857374] hover:text-[#3D0C15] p-1"
                    aria-label="Remove item"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* STEP 2: LUXURY COURIER & CLIENT DETAILS VIEW */}
        {step === 'details' && (
          <form onSubmit={handleDetailsSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
            {detailsError && (
              <div className="p-3 bg-[#3D0C15] text-[#FFFFFF] text-[11px] font-sans tracking-wider border border-[#C5A880]">
                {detailsError}
              </div>
            )}
            <div className="bg-[#FFFFFF] border border-[#E8E3DC] p-4 space-y-3 font-sans text-[11px]">
              <span className="font-sans text-[9px] uppercase tracking-[0.22em] text-[#C5A880] font-semibold block">
                CLIENT CONCIERGE INFORMATION
              </span>

              <div>
                <label className="block text-[#857374] uppercase tracking-wider mb-1">
                  Full Name & Salutation *
                </label>
                <input
                  type="text"
                  required
                  value={customerDetails.name}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                  placeholder="e.g. Nana Kwame Boateng"
                  className="w-full p-2.5 bg-[#F9F8F6] border border-[#E8E3DC] outline-none font-sans text-[12px] text-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[#857374] uppercase tracking-wider mb-1">
                  Contact Phone Number (Ghana / MoMo / SMS) *
                </label>
                <input
                  type="tel"
                  required
                  value={customerDetails.phone}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                  placeholder="e.g. +233 24 419 8820"
                  className="w-full p-2.5 bg-[#F9F8F6] border border-[#E8E3DC] outline-none font-sans text-[12px] text-[#111111]"
                />
                <span className="text-[9px] text-[#857374] mt-0.5 block">
                  Arkesel SMS confirmation & courier updates will be sent here.
                </span>
              </div>

              <div>
                <label className="block text-[#857374] uppercase tracking-wider mb-1">
                  Email Address (for Paystack Digital Receipt)
                </label>
                <input
                  type="email"
                  value={customerDetails.email}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                  placeholder="e.g. client@habrenoir.luxury"
                  className="w-full p-2.5 bg-[#F9F8F6] border border-[#E8E3DC] outline-none font-sans text-[12px] text-[#111111]"
                />
              </div>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E8E3DC] p-4 space-y-3 font-sans text-[11px]">
              <span className="font-sans text-[9px] uppercase tracking-[0.22em] text-[#C5A880] font-semibold block">
                DELIVERY DESTINATION IN GHANA
              </span>

              <div>
                <label className="block text-[#857374] uppercase tracking-wider mb-1">
                  Delivery Region in Ghana *
                </label>
                <select
                  value={customerDetails.city}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, city: e.target.value })}
                  className="w-full p-2.5 bg-[#F9F8F6] border border-[#E8E3DC] outline-none font-sans text-[12px] text-[#111111]"
                >
                  <option value="Accra (Greater Accra - East Legon / Airport / Cantonments)">Greater Accra: East Legon, Airport, Cantonments, Osu (Same-Day)</option>
                  <option value="Accra (Greater Accra - Spintex / Tema / Dzorwulu)">Greater Accra: Spintex, Tema, Dzorwulu, Labone (Same-Day)</option>
                  <option value="Kumasi (Ashanti Region)">Ashanti Region: Kumasi (Ahodwo, Nhyiaeso, Asokwa - 24h)</option>
                  <option value="Takoradi (Western Region)">Western Region: Takoradi / Sekondi (24-48h)</option>
                  <option value="Cape Coast (Central Region)">Central Region: Cape Coast (24-48h)</option>
                  <option value="Koforidua (Eastern Region)">Eastern Region: Koforidua (24-48h)</option>
                  <option value="Tamale (Northern Region)">Northern Region: Tamale (48h)</option>
                  <option value="Other Ghana Destination">Other Ghana Destination (Courier Delivery)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#857374] uppercase tracking-wider mb-1">
                  Street Address / Landmark / Estate *
                </label>
                <input
                  type="text"
                  required
                  value={customerDetails.address}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })}
                  placeholder="e.g. No. 14 Senchi St, near Koala, Airport Residential"
                  className="w-full p-2.5 bg-[#F9F8F6] border border-[#E8E3DC] outline-none font-sans text-[12px] text-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[#857374] uppercase tracking-wider mb-1">
                  Special Delivery Instructions / Call on Arrival
                </label>
                <textarea
                  rows="2"
                  value={customerDetails.deliveryNotes}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, deliveryNotes: e.target.value })}
                  placeholder="e.g. Call before dispatch, gate code, or gift note."
                  className="w-full p-2 bg-[#F9F8F6] border border-[#E8E3DC] outline-none font-sans text-[11px] text-[#111111]"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep('items')}
              className="text-[#857374] hover:text-[#111111] font-sans text-[10px] uppercase tracking-widest"
            >
              ← Back to Shopping Bag Items
            </button>
          </form>
        )}

        {/* Footer Summary & Action */}
        {items.length > 0 && (
          <div className="p-6 bg-[#FFFFFF] border-t border-[#E8E3DC] space-y-4">
            <div className="space-y-1.5 font-sans text-[11px]">
              <div className="flex justify-between text-[#857374]">
                <span className="uppercase tracking-wider">Subtotal (Net)</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#857374]">
                <span className="uppercase tracking-wider">White-Glove Courier</span>
                <span className="text-[#3D0C15] font-medium tracking-widest">COMPLIMENTARY</span>
              </div>
              <div className="flex justify-between font-serif text-[18px] text-[#111111] pt-2 border-t border-[#E8E3DC]">
                <span className="font-normal uppercase tracking-wider">Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {step === 'items' ? (
              <button
                onClick={() => setStep('details')}
                className="w-full py-4 bg-[#3D0C15] text-[#FFFFFF] font-sans text-[11px] tracking-[0.24em] uppercase hover:bg-[#140002] transition-colors border border-[#3D0C15] font-medium"
              >
                Proceed to Courier Details →
              </button>
            ) : (
              <button
                onClick={handleDetailsSubmit}
                disabled={isCheckingOut}
                className="w-full py-4 bg-[#3D0C15] text-[#FFFFFF] font-sans text-[11px] tracking-[0.24em] uppercase hover:bg-[#140002] transition-colors border border-[#3D0C15] font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <span>Connecting to Paystack & Arkesel...</span>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 text-[#C5A880]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Confirm & Pay via Paystack</span>
                  </>
                )}
              </button>
            )}

            <div className="flex items-center justify-center space-x-3 text-[10px] text-[#857374] tracking-wider pt-1 font-sans uppercase">
              <span>Paystack 3D-Secure</span>
              <span>·</span>
              <span>Ghana Mobile Money</span>
              <span>·</span>
              <span>Arkesel SMS</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
