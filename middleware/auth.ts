import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Cart } from '../models/Order';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

const JWT_SECRET = process.env.JWT_SECRET || 'shopzy_super_secret_jwt_sign_key_99';

// Middleware to secure routes (API & Views)
export async function protect(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  let token = req.cookies.token || (req.session as any)?.token || req.query.token;

  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    if (req.originalUrl.startsWith('/api/')) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this resource.' });
    }
    return res.redirect('/login?redirect=' + encodeURIComponent(req.originalUrl));
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      res.clearCookie('token');
      if (req.originalUrl.startsWith('/api/')) {
        return res.status(401).json({ success: false, message: 'User not found.' });
      }
      return res.redirect('/login');
    }

    req.user = user;
    next();
  } catch (error) {
    res.clearCookie('token');
    if (req.originalUrl.startsWith('/api/')) {
      return res.status(401).json({ success: false, message: 'Invalid or expired authentication session.' });
    }
    return res.redirect('/login');
  }
}

// Middleware to enforce Admin actions
export function authorizeAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(403).json({ success: false, message: 'Access denied: Administrators only.' });
  }
  return res.render('error', { title: 'Access Denied', message: 'You are not authorized to view this page.' });
}

// Global session middleware to read cookie login states for EJS headers
export async function loadUserSession(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  res.locals.user = null;
  res.locals.cartCount = 0;
  res.locals.query = req.query; // Expose queries for active sidebar states
  res.locals.path = req.path;

  const token = req.cookies.token || (req.session as any)?.token || req.query.token;
  if (token) {
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
        res.locals.user = user;
        
        // Fetch cart quantity dynamically for the top header badge
        const cart = await Cart.findOne({ user: user.id || user._id });
        if (cart && cart.items) {
          const totalQty = cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
          res.locals.cartCount = totalQty;
        }
      }
    } catch {
      // Slurp error and skip
    }
  }
  next();
}
