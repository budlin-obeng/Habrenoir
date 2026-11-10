import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const TRANSLATIONS = {
  en: {
    // Header & Navigation
    contact: 'Contact',
    client_services: 'Client Services',
    the_atelier: 'The Atelier',
    catalog: 'Catalog',
    bags: 'Bags & Leather',
    shoes: 'Footwear',
    ready_to_wear: 'Ready-to-Wear',
    accessories: 'Accessories',
    women: 'Women',
    men: 'Men',
    search: 'Search',
    shopping_bag: 'Shopping Bag',
    currency_label: 'GH₵ (GHS)',
    order_tracking: 'Track Order',
    salons_appointments: 'Client Concierge & WhatsApp',
    
    // Banner & Announcements
    complimentary_delivery_banner: 'Complimentary Express Delivery Across Ghana',
    founded_provenance: 'ACCRA, GHANA — LUXURY LEATHER GOODS & APPAREL',
    
    // Catalog & Filter
    filter_and_refine: 'Filter & Refine',
    clear_all_filters: 'CLEAR ALL',
    all_creations: 'All Creations',
    sort_by: 'Sort By',
    sort_featured: 'Curated Highlights',
    sort_price_low: 'Price: Low to High',
    sort_price_high: 'Price: High to Low',
    view_plinth: 'Studio View',
    view_look: 'Editorial View',
    no_products_found: 'No creations match your filter criteria.',
    reset_filters: 'Reset Filters',
    
    // Product Detail Page (PDP)
    add_to_bag: 'ADD TO SHOPPING BAG',
    added_to_bag: 'ADDED TO SHOPPING BAG',
    craftsmanship_accordion: 'Atelier Craftsmanship & Provenance',
    materials_accordion: 'Materials & Craftsmanship',
    dimensions_accordion: 'Dimensions & Proportions',
    delivery_accordion: 'Ghana Delivery & Returns',
    color_selection: 'Leather Color',
    size_selection: 'Size & Proportions',
    runway_look: 'NEW ARRIVAL',
    complimentary_packaging: 'Signature luxury presentation box and archival dust bag included.',
    
    // Cart Drawer
    bag_empty_title: 'Your shopping bag is empty',
    bag_empty_desc: 'Explore our signature creations handcrafted in our Accra and European ateliers.',
    bag_explore_cta: 'EXPLORE COLLECTIONS',
    subtotal_net: 'Subtotal (Net)',
    white_glove_courier: 'White-Glove Delivery',
    complimentary: 'COMPLIMENTARY',
    estimated_total: 'Estimated Total',
    proceed_checkout: 'SECURE PAYSTACK CHECKOUT',
    
    // Atelier & Heritage
    atelier_hero_title: 'The Continental Dialogue: Accra, Florence & Paris',
    atelier_hero_subtitle: 'Generations of European cordwaining and leathercraft united with Ghanaian lost-wax brass artistry.',
    ghanaian_brass_title: 'Lost-Wax Cast Brass',
    ghanaian_brass_desc: 'Our iconic clasps, monogram rings, and horsebit hardware are individually hand-cast by master metalsmiths in Accra and Kumasi, then hand-chiseled to micrometer tolerances.',
    leather_title: 'Full-Grain Box Calfskin',
    leather_desc: 'French river tanneries supply our Grade-1 box calfskins, vegetable tanned in organic oak extracts for six months before arriving at our master benches.',
    
    // Contact & Concierge
    contact_hero_title: 'Client Concierge & Private Showrooms',
    contact_hero_subtitle: 'Reach out to our senior advisors for styling queries, bespoke orders, or showroom collection in Accra.',
    accra_salon_name: 'Accra Flagship & Atelier',
    accra_salon_address: 'Airport Residential Area, Villa 8, Accra, Ghana',
    paris_salon_name: 'European Sourcing Office',
    paris_salon_address: '14 Place Vendôme, 75001 Paris, France',
    direct_desk: 'Accra Concierge Desk',
    whatsapp_desk: 'VIP WhatsApp Concierge',
    book_appointment_btn: 'REQUEST CONCIERGE ASSISTANCE'
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang] = useState('en');

  const t = (key) => {
    return TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{
      lang: 'en',
      setLang: () => {},
      t,
      languages: [
        { code: 'en', label: 'EN', name: 'English' }
      ]
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
