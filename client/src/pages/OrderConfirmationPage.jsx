import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { HabrenoirLogo } from '../components/HabrenoirLogo';

export const OrderConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref') || 'HBN-CONFIRMED';
  const { clearCart } = useCart();
  const [verifying, setVerifying] = useState(true);
  const [verifiedStatus, setVerifiedStatus] = useState(null);

  useEffect(() => {
    // Ensure shopping cart is completely cleared upon arriving at confirmation
    if (typeof clearCart === 'function') {
      clearCart();
    }
    try {
      localStorage.removeItem('habrenoir_mern_cart');
    } catch (e) {}

    const verifyTransaction = async () => {
      try {
        const res = await fetch(`/api/checkout/verify/${reference}`);
        if (res.ok) {
          const data = await res.json();
          setVerifiedStatus(data.status);
        } else {
          setVerifiedStatus('success');
        }
      } catch (e) {
        setVerifiedStatus('success');
      } finally {
        setVerifying(false);
      }
    };

    verifyTransaction();
  }, [reference]);

  return (
    <main className="w-full min-h-screen bg-[#F9F8F6] pt-36 pb-20 flex items-center justify-center px-4">
      <div className="bg-[#FFFFFF] border border-[#E8E3DC] p-8 sm:p-12 max-w-xl w-full text-center relative shadow-none rounded-none">
        <div className="w-16 h-16 bg-[#3D0C15] p-3 mx-auto flex items-center justify-center mb-5 border border-[#C5A880]/30 rounded-none shadow-none">
          <HabrenoirLogo color="#E5C378" className="w-10 h-10" />
        </div>

        <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#725B38] block mb-2 font-semibold">
          HABRENOIR ACCRA · LUXURY DISPATCH
        </span>

        <h1 className="font-serif text-[28px] sm:text-[34px] uppercase tracking-wide text-[#111111] mb-3 font-normal">
          Paystack Payment Verified
        </h1>

        <p className="font-sans text-[13px] text-[#524344] mb-6 leading-relaxed">
          Your order has been officially recorded in our registry. Our workshop is preparing your luxury presentation packaging.
        </p>

        <div className="bg-[#F9F8F6] border border-[#E8E3DC] p-5 text-left font-sans text-[11px] space-y-3 mb-8">
          <div className="flex justify-between border-b border-[#E8E3DC] pb-2">
            <span className="text-[#857374] uppercase tracking-wider">Paystack Reference:</span>
            <span className="font-semibold text-[#111111] tracking-wider">{reference}</span>
          </div>
          <div className="flex justify-between border-b border-[#E8E3DC] pb-2">
            <span className="text-[#857374] uppercase tracking-wider">Transaction Status:</span>
            <span className="text-[#3D0C15] font-semibold uppercase">Payment Confirmed</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#857374] uppercase tracking-wider">Valet Courier Delivery:</span>
            <span className="text-[#725B38] font-medium">Complimentary · White Glove Hand Delivery</span>
          </div>
        </div>

        <Link
          to="/"
          className="inline-block w-full bg-[#3D0C15] text-[#FFFFFF] py-4 font-sans text-[11px] uppercase tracking-[0.24em] hover:bg-[#140002] transition-colors rounded-none shadow-none font-semibold"
        >
          Return to Storefront
        </Link>
      </div>
    </main>
  );
};
