/**
 * Lightweight Zero-Dependency In-Memory Rate Limiter
 * Protects endpoints against brute-force, toll fraud, and automated DoS attacks.
 */
export const createRateLimiter = ({
  windowMs = 60 * 1000, // 1 minute
  max = 30,             // Max requests per window
  message = 'Too many requests from this IP, please try again shortly.'
} = {}) => {
  const hits = new Map();

  // Periodic cleanup of stale entries every 2 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of hits.entries()) {
      if (now > record.resetTime) {
        hits.delete(ip);
      }
    }
  }, 2 * 60 * 1000).unref();

  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();

    let record = hits.get(ip);
    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + windowMs };
      hits.set(ip, record);
    } else {
      record.count += 1;
    }

    const remaining = Math.max(0, max - record.count);
    res.setHeader('RateLimit-Limit', max);
    res.setHeader('RateLimit-Remaining', remaining);
    res.setHeader('RateLimit-Reset', Math.ceil(record.resetTime / 1000));

    if (record.count > max) {
      return res.status(429).json({
        success: false,
        message,
        retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000)
      });
    }

    next();
  };
};

// Specialized limiters for critical paths
export const checkoutLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 15,                  // Max 15 checkout initializations per 10 mins
  message: 'Checkout rate limit exceeded. Please wait a few moments before trying again.'
});

export const inquiryLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                  // Max 10 inquiries per 15 mins
  message: 'Inquiry submission limit reached. Please contact concierge via WhatsApp for urgent assistance.'
});

export const apiGeneralLimiter = createRateLimiter({
  windowMs: 60 * 1000,      // 1 minute
  max: 120,                 // Max 120 requests per minute
  message: 'API rate limit exceeded. Please throttle requests.'
});

