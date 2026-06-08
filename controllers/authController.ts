import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Address } from '../models/User';
import { Cart, Wishlist } from '../models/Order';

const JWT_SECRET = process.env.JWT_SECRET || 'shopzy_super_secret_jwt_sign_key_99';

export async function handleRegister(req: Request, res: Response) {
  const { name, email, username, phone, password, confirmPassword } = req.body;

  try {
    // 1. Basic required field validation
    if (!name || !email || !username || !password || !confirmPassword) {
      return res.render('register', { error: 'All fields are required except Phone Number.', title: 'Register - Shopzy' });
    }

    // 2. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.render('register', { error: 'Please walk in with a valid email address form.', title: 'Register - Shopzy' });
    }

    // 3. Username space check / format check
    if (username.includes(' ') || username.length < 3) {
      return res.render('register', { error: 'Username must be at least 3 characters and cannot contain spaces.', title: 'Register - Shopzy' });
    }

    // 4. Password validation (at least 6 characters)
    if (password.length < 6) {
      return res.render('register', { error: 'Password must be at least 6 characters long for supreme security.', title: 'Register - Shopzy' });
    }

    // 5. Password confirmation match validation
    if (password !== confirmPassword) {
      return res.render('register', { error: 'Password and Confirm Password do not match.', title: 'Register - Shopzy' });
    }

    // 6. Duplicate Email check
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.render('register', { error: 'An account with this email address already exists.', title: 'Register - Shopzy' });
    }

    // 7. Duplicate Username check
    const existingUsername = await User.findOne({ username: username.toLowerCase() });
    if (existingUsername) {
      return res.render('register', { error: 'This username is already taken. Please dream up another.', title: 'Register - Shopzy' });
    }

    // 8. Password hashing using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    // 9. MongoDB user creation & persistence
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      username: username.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone ? phone.trim() : '',
      verificationToken,
      isVerified: true
    });

    // Initialize cart & wishlist
    await Cart.create({ user: newUser.id || newUser._id, items: [] });
    await Wishlist.create({ user: newUser.id || newUser._id, products: [] });

    // Generate JWT and log in immediately
    const token = jwt.sign({ id: newUser.id || newUser._id }, JWT_SECRET, { expiresIn: '30d' });
    if (req.session) {
      (req.session as any).token = token;
    }
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: true, 
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'none'
    });

    if (req.session) {
      req.session.save(() => {
        res.redirect('/profile?welcome=true');
      });
    } else {
      res.redirect('/profile?welcome=true');
    }
  } catch (err: any) {
    res.render('register', { error: 'Registration failed: ' + err.message, title: 'Register - Shopzy' });
  }
}

export async function handleLogin(req: Request, res: Response) {
  const { email, password, redirect } = req.body;

  try {
    if (!email || !password) {
      return res.render('login', { error: 'Both Email/Username and Password are required.', title: 'Login - Shopzy' });
    }

    // Support logging in with either Username or Email dynamically
    const isEmailInput = email.includes('@');
    const query = isEmailInput 
      ? { email: email.toLowerCase().trim() } 
      : { username: email.toLowerCase().trim() };

    const user = await User.findOne(query);
    if (!user) {
      return res.render('login', { error: 'Invalid credentials. Please verify and try again.', title: 'Login - Shopzy' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { error: 'Invalid credentials. Please verify and try again.', title: 'Login - Shopzy' });
    }

    const token = jwt.sign({ id: user.id || user._id }, JWT_SECRET, { expiresIn: '30d' });
    if (req.session) {
      (req.session as any).token = token;
    }
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: true, 
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'none'
    });

    const targetUrl = redirect ? decodeURIComponent(redirect) : '/profile';
    if (req.session) {
      req.session.save(() => {
        res.redirect(targetUrl);
      });
    } else {
      res.redirect(targetUrl);
    }
  } catch (err: any) {
    res.render('login', { error: 'Login failed: ' + err.message, title: 'Login - Shopzy' });
  }
}

export function handleLogout(req: Request, res: Response) {
  if (req.session) {
    (req.session as any).token = null;
    req.session.destroy(() => {});
  }
  res.clearCookie('token');
  res.redirect('/');
}

export async function updateProfile(req: any, res: Response) {
  const { name, phone } = req.body;

  try {
    await User.findByIdAndUpdate(req.user.id || req.user._id, { name, phone });
    res.redirect('/profile?success=true');
  } catch (err: any) {
    res.redirect('/profile?error=' + encodeURIComponent(err.message));
  }
}

export async function updatePassword(req: any, res: Response) {
  const { currentPassword, newPassword } = req.body;

  try {
    if (!currentPassword || !newPassword) {
      return res.redirect('/profile?error=' + encodeURIComponent('Both Current Password and New Password are required.'));
    }

    if (newPassword.length < 6) {
      return res.redirect('/profile?error=' + encodeURIComponent('New Password must be at least 6 characters long.'));
    }

    const user = await User.findById(req.user.id || req.user._id);
    if (!user) {
      return res.redirect('/profile?error=' + encodeURIComponent('User session not found.'));
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.redirect('/profile?error=' + encodeURIComponent('Incorrect existing password. Please try again.'));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(user.id || user._id, { password: hashedPassword });

    res.redirect('/profile?success=true');
  } catch (err: any) {
    res.redirect('/profile?error=' + encodeURIComponent(err.message));
  }
}

export async function handleForgot(req: Request, res: Response) {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('forgot-password', { error: 'No user found with that email address.', title: 'Forgot Password - Shopzy' });
    }

    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const expire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await User.findByIdAndUpdate(user.id || user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpire: expire
    });

    res.render('forgot-password', {
      success: `Reset pin sent successfully! For mock environment, use PIN: ${resetToken}`,
      email,
      title: 'Forgot Password - Shopzy'
    });
  } catch (err: any) {
    res.render('forgot-password', { error: 'Forgot password operation failed: ' + err.message, title: 'Forgot Password - Shopzy' });
  }
}

export async function handleReset(req: Request, res: Response) {
  const { email, pin, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.resetPasswordToken !== pin || new Date(user.resetPasswordExpire) < new Date()) {
      return res.render('forgot-password', { error: 'Invalid or expired reset PIN.', email, title: 'Forgot Password - Shopzy' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(user.id || user._id, {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpire: undefined
    });

    res.render('login', { success: 'Your password has been reset successfully. Please login below.', title: 'Login - Shopzy' });
  } catch (err: any) {
    res.render('forgot-password', { error: 'Reset failed: ' + err.message, email, title: 'Forgot Password - Shopzy' });
  }
}

// User Addresses Manager
export async function addAddress(req: any, res: Response) {
  const { fullName, addressLine1, addressLine2, city, state, postalCode, phone, isDefault } = req.body;

  try {
    const userId = String(req.user.id || req.user._id);
    
    if (isDefault === 'true' || isDefault === true) {
      // De-default current default addresses
      const current = await Address.find({ user: userId });
      for (const addr of current) {
        if (addr.isDefault) {
          await Address.findByIdAndUpdate(addr._id || addr.id, { isDefault: false });
        }
      }
    }

    await Address.create({
      user: userId,
      fullName,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      phone,
      isDefault: isDefault === 'true' || isDefault === true
    });

    // Smart redirect back to checkout if referring page is checkout
    const referer = req.get('referer') || '';
    if (referer.includes('/checkout')) {
      return res.redirect('/checkout?address_success=true');
    }
    res.redirect('/profile?address_success=true');
  } catch (err: any) {
    const referer = req.get('referer') || '';
    if (referer.includes('/checkout')) {
      return res.redirect('/checkout?address_error=' + encodeURIComponent(err.message));
    }
    res.redirect('/profile?address_error=' + encodeURIComponent(err.message));
  }
}

export async function deleteAddress(req: any, res: Response) {
  const { addressId } = req.params;
  try {
    const target = await Address.findById(addressId);
    if (target && String(target.user) === String(req.user.id || req.user._id)) {
      await Address.findByIdAndDelete(addressId);
    }
    
    const referer = req.get('referer') || '';
    if (referer.includes('/checkout')) {
      return res.redirect('/checkout?address_deleted=true');
    }
    res.redirect('/profile?address_deleted=true');
  } catch (err: any) {
    const referer = req.get('referer') || '';
    if (referer.includes('/checkout')) {
      return res.redirect('/checkout?address_error=' + encodeURIComponent(err.message));
    }
    res.redirect('/profile?address_error=' + encodeURIComponent(err.message));
  }
}
