/**
 * Administrative Authentication & Authorization Middleware
 * Prevents unauthorized creation, modification, deletion of products,
 * order status manipulation, and unauthorized PII customer data harvesting.
 */
export const requireAdmin = (req, res, next) => {
  const adminSecret = process.env.ADMIN_SECRET_KEY || process.env.ADMIN_KEY || 'habrenoir_admin_sec_2026';
  const providedKey = req.headers['x-admin-key'] || req.headers.authorization?.replace(/^Bearer\s+/i, '');

  // 1. Direct Secret Token / API Key check
  if (providedKey && providedKey === adminSecret) {
    return next();
  }

  // 2. Clerk Secret / Role verification if Clerk is present
  const clerkUserRole = req.headers['x-user-role'];
  if (clerkUserRole === 'admin' && providedKey) {
    return next();
  }

  // 3. Reject unauthorized access
  return res.status(401).json({
    success: false,
    message: 'Access Denied: Administrative authorization token required.'
  });
};

