import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const ContactPage = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    salon: 'accra',
    service: 'fitting',
    date: '',
    notes: ''
  });
  const [submittedRef, setSubmittedRef] = useState(null);
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setFormError('Please provide your Full Name, Email, and Phone Number.');
      return;
    }
    setFormError(null);
    const ref = 'APT-GH-' + Math.floor(1000 + Math.random() * 9000);
    
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.service || 'Client Fitting / Assistance',
          channel: formData.salon || 'Accra Flagship',
          notes: formData.notes,
          reference: ref
        })
      });
    } catch (err) {
      console.warn('Inquiry transmitted locally:', err);
    }
    
    setSubmittedRef(ref);
  };

  return (
    <div className="pt-24 sm:pt-32 pb-24 bg-[#F9F8F6] text-[#111111]">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 font-sans text-[10px] tracking-[0.2em] uppercase text-[#857374] mb-8">
          <Link to="/" className="hover:text-[#111111]">Home</Link>
          <span>/</span>
          <span className="text-[#3D0C15] font-semibold">{t('client_services')}</span>
        </div>

        {/* Page Title */}
        <div className="border-b border-[#E8E3DC] pb-10 mb-16">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#725B38] font-semibold block mb-2">
            CLIENT CONCIERGE & LOCAL ASSISTANCE
          </span>
          <h1 className="font-serif text-[34px] sm:text-[52px] tracking-tight text-[#111111] max-w-3xl">
            {t('contact_hero_title')}
          </h1>
          <p className="font-sans text-[14px] text-[#524344] mt-3 max-w-xl leading-relaxed">
            Direct customer care, local sizing advice, and express doorstep delivery coordination for our Ghanaian clientele.
          </p>
        </div>

        {/* 3 Concierge Channels Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="bg-[#FFFFFF] border border-[#E8E3DC] p-8 space-y-4">
            <span className="font-sans text-[9px] tracking-[0.24em] uppercase text-[#C5A880] font-semibold block">
              DIRECT DESK
            </span>
            <h3 className="font-serif text-[22px] text-[#111111]">Accra Flagship Line</h3>
            <p className="font-sans text-[12px] text-[#524344] leading-relaxed">
              Monday to Saturday, 08:30 – 19:00 GMT. Direct line to our senior client advisors and bespoke coordinators.
            </p>
            <a
              href="tel:+233302948810"
              className="inline-block font-sans text-[14px] text-[#3D0C15] font-semibold tracking-wider hover:underline pt-2"
            >
              +233 (0) 30 294 8810
            </a>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E8E3DC] p-8 space-y-4">
            <span className="font-sans text-[9px] tracking-[0.24em] uppercase text-[#C5A880] font-semibold block">
              VIP MESSAGING
            </span>
            <h3 className="font-serif text-[22px] text-[#111111]">WhatsApp VIP Desk</h3>
            <p className="font-sans text-[12px] text-[#524344] leading-relaxed">
              Instant encrypted private messaging for styling queries, size reservations, and dispatch routing.
            </p>
            <a
              href="https://wa.me/233240001926"
              target="_blank"
              rel="noreferrer"
              className="inline-block font-sans text-[14px] text-[#3D0C15] font-semibold tracking-wider hover:underline pt-2"
            >
              +233 24 000 1926
            </a>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E8E3DC] p-8 space-y-4">
            <span className="font-sans text-[9px] tracking-[0.24em] uppercase text-[#C5A880] font-semibold block">
              WRITTEN CORRESPONDENCE
            </span>
            <h3 className="font-serif text-[22px] text-[#111111]">Private Email Desk</h3>
            <p className="font-sans text-[12px] text-[#524344] leading-relaxed">
              Confidential inquiries, custom bridal suites, and transatlantic diplomatic logistics.
            </p>
            <a
              href="mailto:concierge@habrenoir.luxury"
              className="inline-block font-sans text-[14px] text-[#3D0C15] font-semibold tracking-wider hover:underline pt-2"
            >
              concierge@habrenoir.luxury
            </a>
          </div>
        </div>

        {/* Client Inquiry & WhatsApp Concierge Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          <div className="lg:col-span-5 space-y-6">
            <span className="font-sans text-[10px] tracking-[0.28em] uppercase text-[#725B38] font-semibold block">
              DIRECT CLIENT ASSISTANCE
            </span>
            <h2 className="font-serif text-[30px] sm:text-[40px] text-[#111111] leading-tight">
              Connect with the Habrenoir Team
            </h2>
            <p className="font-sans text-[13px] text-[#524344] leading-relaxed">
              Have an inquiry regarding proportions, custom leather embossing, or same-day courier dispatch across Greater Accra? Reach out directly via WhatsApp or submit a formal inquiry below.
            </p>

            <div className="bg-[#FFFFFF] border border-[#E8E3DC] p-6 space-y-3">
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#3D0C15] font-semibold block">
                Flagship Showroom in Accra
              </span>
              <p className="font-sans text-[13px] text-[#111111] font-medium">
                Airport Residential Area, Villa 8, Senchi Street, Accra, Ghana
              </p>
              <p className="font-sans text-[11px] text-[#857374]">
                Direct white-glove collection and local concierge assistance.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E8E3DC] p-8 sm:p-12 shadow-none">
            {submittedRef ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-12 h-12 mx-auto border border-[#C5A880] flex items-center justify-center text-[#3D0C15]">
                  <svg className="w-6 h-6 text-[#C5A880]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-sans text-[10px] tracking-[0.26em] uppercase text-[#3D0C15] font-semibold block">
                  INQUIRY RECEIVED
                </span>
                <h3 className="font-serif text-[28px] text-[#111111]">
                  Reference #{submittedRef}
                </h3>
                <p className="font-sans text-[13px] text-[#524344] max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{formData.name}</strong>. Your inquiry has been forwarded to our Accra concierge team. A representative will contact you via WhatsApp or SMS at <strong>{formData.phone}</strong> shortly.
                </p>
                <button
                  onClick={() => setSubmittedRef(null)}
                  className="mt-6 px-8 py-3 bg-[#3D0C15] text-[#FFFFFF] font-sans text-[10px] tracking-[0.24em] uppercase"
                >
                  SEND ANOTHER INQUIRY
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {formError && (
                  <div className="p-3 bg-[#3D0C15] text-[#FFFFFF] text-[11px] font-sans tracking-wider border border-[#C5A880]">
                    {formError}
                  </div>
                )}
                <div>
                  <label className="block font-sans text-[10px] tracking-[0.18em] uppercase text-[#857374] mb-2">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Nana Kwame Mensah"
                    className="w-full bg-[#F9F8F6] border border-[#E8E3DC] px-4 py-3 font-sans text-[13px] text-[#111111] rounded-none focus:outline-none focus:border-[#3D0C15]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-sans text-[10px] tracking-[0.18em] uppercase text-[#857374] mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="client@domain.com"
                      className="w-full bg-[#F9F8F6] border border-[#E8E3DC] px-4 py-3 font-sans text-[13px] text-[#111111] rounded-none focus:outline-none focus:border-[#3D0C15]"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] tracking-[0.18em] uppercase text-[#857374] mb-2">
                      Phone Number (SMS Confirmation) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+233 24 000 0000"
                      className="w-full bg-[#F9F8F6] border border-[#E8E3DC] px-4 py-3 font-sans text-[13px] text-[#111111] rounded-none focus:outline-none focus:border-[#3D0C15]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-sans text-[10px] tracking-[0.18em] uppercase text-[#857374] mb-2">
                      Inquiry Subject
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full bg-[#F9F8F6] border border-[#E8E3DC] px-4 py-3 font-sans text-[12px] text-[#111111] rounded-none focus:outline-none focus:border-[#3D0C15]"
                    >
                      <option value="sizing">Product Sizing & Proportions</option>
                      <option value="order">Order Tracking & Delivery Status</option>
                      <option value="delivery">Accra Same-Day Delivery Inquiry</option>
                      <option value="custom">Bespoke Monogram & Lost-Wax Brass</option>
                      <option value="corporate">Corporate & VIP Gifting in Ghana</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] tracking-[0.18em] uppercase text-[#857374] mb-2">
                      Preferred Reply Channel
                    </label>
                    <select
                      value={formData.salon}
                      onChange={(e) => setFormData({ ...formData, salon: e.target.value })}
                      className="w-full bg-[#F9F8F6] border border-[#E8E3DC] px-4 py-3 font-sans text-[12px] text-[#111111] rounded-none focus:outline-none focus:border-[#3D0C15]"
                    >
                      <option value="whatsapp">WhatsApp Message (+233)</option>
                      <option value="phone">Direct Phone Call</option>
                      <option value="email">Email Response</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-[10px] tracking-[0.18em] uppercase text-[#857374] mb-2">
                    Inquiry Details or Product Reference
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Mention any specific models, European sizing, or Accra delivery preferences..."
                    className="w-full bg-[#F9F8F6] border border-[#E8E3DC] px-4 py-3 font-sans text-[13px] text-[#111111] rounded-none focus:outline-none focus:border-[#3D0C15]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#3D0C15] hover:bg-[#140002] text-[#FFFFFF] font-sans text-[11px] tracking-[0.24em] uppercase font-semibold transition-colors rounded-none"
                >
                  TRANSMIT CONCIERGE INQUIRY →
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Client FAQ Section */}
        <div className="border-t border-[#E8E3DC] pt-16">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#725B38] font-semibold block mb-2">
              CLIENT SERVICES FAQ
            </span>
            <h3 className="font-serif text-[28px] text-[#111111]">
              Frequently Addressed Inquiries
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-[#FFFFFF] border border-[#E8E3DC] p-6 space-y-2">
              <h4 className="font-serif text-[18px] text-[#3D0C15]">How does payment in Ghanaian Cedis (GH₵) work?</h4>
              <p className="font-sans text-[12px] text-[#524344] leading-relaxed">
                All transactions are settled natively in Ghanaian Cedis (GH₵) via Paystack. We support local Ghanaian Mobile Money (MTN MoMo, Telecel Cash) as well as all international Visa, Mastercard, and American Express cards with zero foreign exchange surcharges.
              </p>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E8E3DC] p-6 space-y-2">
              <h4 className="font-serif text-[18px] text-[#3D0C15]">What is the delivery coverage within Ghana?</h4>
              <p className="font-sans text-[12px] text-[#524344] leading-relaxed">
                We provide complimentary white-glove courier delivery for all orders exceeding GH₵ 12,000. Greater Accra deliveries are completed within 24 to 48 hours. Express deliveries to Kumasi, Takoradi, and international capitals are coordinated via diplomatic air courier.
              </p>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E8E3DC] p-6 space-y-2">
              <h4 className="font-serif text-[18px] text-[#3D0C15]">How do I track my order progression?</h4>
              <p className="font-sans text-[12px] text-[#524344] leading-relaxed">
                You can track your order anytime on our dedicated <Link to="/track" className="underline font-medium">Order Tracking Page</Link> using your reference number (e.g., HBN-88204) or mobile phone. You will also receive automated SMS updates at each stage.
              </p>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E8E3DC] p-6 space-y-2">
              <h4 className="font-serif text-[18px] text-[#3D0C15]">What is the returns and exchange window?</h4>
              <p className="font-sans text-[12px] text-[#524344] leading-relaxed">
                Unworn creations in pristine condition with unbroken seals may be exchanged or returned within 30 days of delivery. Our white-glove team will arrange complimentary pickup at your residence.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
