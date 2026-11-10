import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    categoryName: { type: String },
    subcategory: { type: String },
    gender: { type: String, default: 'unisex' },
    color: { type: String, required: true },
    colorName: { type: String },
    colorHex: { type: String },
    image: { type: String },
    availableColors: [
      {
        name: String,
        hex: String,
        slug: String,
        image: String,
        caption: String
      }
    ],
    size: { type: String, required: true },
    sizeLabel: { type: String },
    dimensions: {
      width: String,
      height: String,
      depth: String,
      strapDrop: String
    },
    price: { type: Number, required: true },
    formattedPrice: { type: String },
    ref: { type: String, required: true },
    badge: { type: String },
    curatedLook: { type: String },
    stock: { type: Number, default: 3 },
    leadTime: { type: String },
    shortDescription: { type: String },
    editorialQuote: { type: String },
    artisanCredit: { type: String },
    images: [
      {
        url: String,
        caption: String,
        viewLabel: String
      }
    ],
    details: [String],
    packaging: [String],
    finishes: [String],
    crossSells: [
      {
        id: String,
        name: String,
        category: String,
        price: Number,
        formattedPrice: String,
        image: String
      }
    ]
  },
  {
    timestamps: true,
    strict: false // Prevent mongoose from stripping newly added fields
  }
);

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
