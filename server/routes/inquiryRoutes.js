import express from 'express';
import { dbStore } from '../services/dbStore.js';
import { requireAdmin } from '../middleware/auth.js';
import { inquiryLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// GET all customer inquiries (Protected: Admin only to protect customer contact PII)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const inquiries = await dbStore.getAllInquiries();
    res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST new inquiry (Rate-limited to prevent form spam & database flooding)
router.post('/', inquiryLimiter, async (req, res) => {
  try {
    const { name, email, phone, subject, channel, notes, reference } = req.body;
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone number are required to submit an inquiry.'
      });
    }

    const inquiry = await dbStore.saveInquiry({
      name,
      email,
      phone,
      subject,
      channel,
      notes,
      reference
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry registered with Habrenoir Concierge.',
      data: inquiry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update inquiry status (Protected: Admin only)
router.put('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await dbStore.updateInquiryStatus(id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    }
    res.json({ success: true, message: 'Inquiry status updated.', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

