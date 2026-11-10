import React from 'react';
import { useCart } from '../context/CartContext';
import { HabrenoirLogo } from './HabrenoirLogo';

export const OrderConfirmationModal = () => {
  const { completedOrder, closeOrderModal, formatCurrency } = useCart();

  if (!completedOrder) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#F9F8F6] border border-[#E8E3DC] p-8 max-w-lg w-full text-center relative shadow-none rounded-none animate-fade-in">
        <div className="w-16 h-16 bg-[#3D0C15] p-3 mx-auto flex items-center justify-center mb-4 border border-[#C5A880]/40 rounded-none shadow-none">
          <HabrenoirLogo color="#E5C378" className="w-10 h-10" />
        </div>
        <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#725B38] block mb-1 font-semibold">
          HABRENOIR ACCRA · LUXURY DISPATCH
        </span>
        <h3 className="font-serif text-[26px] uppercase tracking-wide text-[#111111] mb-2 font-normal">
          Paystack Payment Confirmed
        </h3>
        <p className="font-sans text-[13px] text-[#524344] mb-5 leading-relaxed">
          Your order is now recorded in our client registry for bespoke luxury packaging and dispatch.
        </p>

        <div className="bg-[#FFFFFF] border border-[#E8E3DC] p-4 text-left font-sans text-[11px] space-y-2.5 mb-6">
          <div className="flex justify-between border-b border-[#E8E3DC]/60 pb-1.5">
            <span className="text-[#857374] uppercase tracking-wider">Order Reference:</span>
            <span className="font-semibold text-[#111111] tracking-wider">{completedOrder.reference}</span>
          </div>
          <div className="flex justify-between border-b border-[#E8E3DC]/60 pb-1.5">
            <span className="text-[#857374] uppercase tracking-wider">Payment Gateway:</span>
            <span className="text-[#3D0C15] font-semibold tracking-wider">Paystack Certified</span>
          </div>
          <div className="flex justify-between border-b border-[#E8E3DC]/60 pb-1.5">
            <span className="text-[#857374] uppercase tracking-wider">Total Amount:</span>
            <span className="text-[#111111] font-semibold">{formatCurrency(completedOrder.amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#857374] uppercase tracking-wider">Delivery Protocol:</span>
            <span className="text-[#725B38] font-medium">White Glove · Dedicated Valet Courier</span>
          </div>
        </div>

        <button
          onClick={closeOrderModal}
          className="w-full bg-[#3D0C15] text-[#FFFFFF] py-4 font-sans text-[11px] uppercase tracking-[0.24em] hover:bg-[#140002] transition-colors rounded-none shadow-none font-semibold"
        >
          Return to Storefront
        </button>
      </div>
    </div>
  );
};
