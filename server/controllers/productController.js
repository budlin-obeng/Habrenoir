import { dbStore } from '../services/dbStore.js';

export const getProducts = async (req, res) => {
  try {
    const { category, color, size, gender, minPrice, maxPrice, sort, search } = req.query;

    let products = await dbStore.getAllProducts();

    // Text Search
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      products = products.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.subcategory?.toLowerCase().includes(q) ||
        p.shortDescription?.toLowerCase().includes(q) ||
        p.ref?.toLowerCase().includes(q) ||
        p.colorName?.toLowerCase().includes(q)
      );
    }

    // Apply Gender Filter
    if (gender && gender !== 'all') {
      products = products.filter(p => p.gender === gender || p.gender === 'unisex');
    }

    // Apply Category Filter
    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }

    // Apply Color Filter
    if (color && color !== 'all') {
      products = products.filter(p => p.color === color || p.availableColors?.some(c => c.slug === color));
    }

    // Apply Size Filter
    if (size && size !== 'all') {
      products = products.filter(p => p.size === size);
    }

    // Apply Price Bounds
    if (minPrice) {
      products = products.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      products = products.filter(p => p.price <= Number(maxPrice));
    }

    // Apply Sorting
    if (sort === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      products.reverse();
    }

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await dbStore.getProductById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Creation not found in our archives.' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      categoryName,
      subcategory,
      gender = 'unisex',
      color,
      colorName,
      colorHex,
      image,
      availableColors,
      price,
      size,
      sizeLabel,
      dimensions,
      shortDescription,
      details,
      badge,
      stock = 5
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, and category are required to catalog a new creation.'
      });
    }

    const newProduct = await dbStore.addProduct({
      name,
      category,
      categoryName: categoryName || category.toUpperCase(),
      subcategory: subcategory || 'Leather Goods',
      gender,
      color: color || 'noir',
      colorName: colorName || 'Classic Black',
      colorHex: colorHex || '#111111',
      image: image || '/images/products/bags/vendome-black.jpg',
      availableColors: availableColors || [
        {
          slug: color || 'noir',
          name: colorName || 'Classic Black',
          hex: colorHex || '#111111',
          image: image || '/images/products/bags/vendome-black.jpg',
          caption: name
        }
      ],
      price: Number(price),
      formattedPrice: `GH₵ ${Number(price).toLocaleString()}`,
      ref: `Ref. ${Math.floor(100000 + Math.random() * 900000)}-HN`,
      size: size || 'standard',
      sizeLabel: sizeLabel || 'Standard Size',
      dimensions: dimensions || { width: 'Standard', height: 'Standard', depth: 'Standard' },
      shortDescription: shortDescription || 'Mastercrafted in the Habrenoir ateliers.',
      details: Array.isArray(details) ? details : ['Handcrafted box calfskin and lost-wax brass'],
      badge: badge || 'NEW ARRIVAL',
      stock: Number(stock)
    });

    res.status(201).json({
      success: true,
      message: 'New creation officially registered into Habrenoir catalog.',
      data: newProduct
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await dbStore.updateProduct(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Creation not found.' });
    }
    res.json({ success: true, message: 'Creation updated.', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await dbStore.deleteProduct(id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Creation not found.' });
    }
    res.json({ success: true, message: 'Creation removed from Habrenoir catalog.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFilterMetadata = async (req, res) => {
  try {
    const categories = [
      { id: 'all', label: 'All Creations' },
      { id: 'bags', label: 'Bags & Leather Goods' },
      { id: 'shoes', label: 'Footwear & Shoes' },
      { id: 'shirts', label: 'Ready-to-Wear Shirts' },
      { id: 'blazers', label: 'Tailoring & Outerwear' },
      { id: 'accessories', label: 'Belts & Accessories' }
    ];

    const colors = [
      { id: 'noir', name: 'Classic Black', hex: '#140002' },
      { id: 'bordeaux', name: 'Deep Burgundy', hex: '#3D0C15' },
      { id: 'creme', name: 'Ivory Cream', hex: '#F3EDE3' },
      { id: 'camel', name: 'Tobacco Suede', hex: '#8C582B' },
      { id: 'emerald', name: 'Emerald Green', hex: '#124C34' }
    ];

    const sizes = [
      { id: 'petite', label: 'Petite' },
      { id: 'medium', label: 'Medium' },
      { id: 'grande', label: 'Grande' },
      { id: '42', label: 'EU 42' },
      { id: '48', label: 'IT 48' },
      { id: 'M', label: 'Medium (M)' },
      { id: '90', label: '90 cm' }
    ];

    const priceBounds = {
      min: 500,
      max: 50000,
      step: 500
    };

    res.json({
      success: true,
      data: {
        categories,
        colors,
        sizes,
        priceBounds
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
