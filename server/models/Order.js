import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true },
    paystackReference: { type: String },
    customerEmail: { type: String, required: true },
    customerName: { type: String },
    items: [
      {
        id: String,
        name: String,
        color: String,
        size: String,
        price: Number,
        quantity: Number,
        image: String,
        ref: String
      }
    ],
    amount: { type: Number, required: true },
    currency: { type: String, default: 'EUR' },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'abandoned'],
      default: 'pending'
    },
    shipping: {
      type: { type: String, default: 'White Glove Valet Delivery' },
      address: String,
      city: String,
      country: String,
      postalCode: String,
      notes: String
    },
    paymentGateway: { type: String, default: 'Paystack' },
    paystackTransactionId: { type: String },
    paidAt: { type: Date }
  },
  {
    timestamps: true
  }
);

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
