const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { sendResetEmail } = require('./utlies/mailer')

const JWT_SECRET = 'Ritesh@123'

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.query().insert({ name, email, password: hashedPassword });
    res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.query().findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    console.log("token", token)
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    const user = await User.query().findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) return res.status(401).json({ error: 'Old password is incorrect' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.query().findById(user.id).patch({ password: hashed });

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.query().findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.query().findById(user.id).patch({ password: hashed });

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.query().findOne({ email });
    if (!user) return res.status(200).json({ message: 'If the email exists, a reset link has been sent' });

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    await User.query().findById(user.id).patch({ reset_token: token, reset_token_expires: expires });

    const baseUrl = process.env.APP_BASE_URL || 'http://localhost:6000';
    const link = `${baseUrl}/api/auth/reset-password/${token}`;

    await sendResetEmail(user.email, link);

    return res.json({ message: 'Password reset link sent if the email exists' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const showResetPasswordPage = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).send('Invalid link');

    const user = await User.query().findOne({ reset_token: token });
    if (!user || !user.reset_token_expires || new Date(user.reset_token_expires) < new Date()) {
      return res.status(400).send('Reset link is invalid or has expired');
    }

    const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Reset Password</title>
<style>body{font-family:Arial, sans-serif;padding:24px;max-width:480px;margin:auto}input,button{padding:10px;margin:6px 0;width:100%} .hidden{display:none} .success{color:green;margin-top:12px}</style>
</head><body>
<h2>Reset Password</h2>
<form method="POST" action="/api/auth/reset-password">
<input type="hidden" name="token" value="${token}" />
<label>New Password</label>
<input type="password" name="newPassword" required />
<label>Confirm Password</label>
<input type="password" name="confirmPassword" required />
<button type="submit">Submit</button>
</form>
</body></html>`;

    res.set('Content-Type', 'text/html');
    return res.send(html);
  } catch (err) {
    return res.status(500).send('Server error');
  }
};

const resetPassword = async (req, res) => {
  try {
    const token = req.body.token || req.query.token;
    const { newPassword, confirmPassword } = req.body;

    if (!token) return res.status(400).send('Invalid request');
    if (!newPassword || !confirmPassword) return res.status(400).send('Missing fields');
    if (newPassword !== confirmPassword) return res.status(400).send('Passwords do not match');

    const user = await User.query().findOne({ reset_token: token });
    if (!user || !user.reset_token_expires || new Date(user.reset_token_expires) < new Date()) {
      return res.status(400).send('Reset link is invalid or has expired');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.query().findById(user.id).patch({ password: hashed, reset_token: null, reset_token_expires: null });

    const successHtml = `<!doctype html>
<html><head><meta charset="utf-8"><title>Password Reset Success</title>
<style>body{font-family:Arial, sans-serif;padding:24px;max-width:480px;margin:auto}.success{color:green}</style>
</head><body>
<h2 class="success">Your password has been reset successfully.</h2>
<p>You can now close this page and login with your new password.</p>
</body></html>`;

    res.set('Content-Type', 'text/html');
    return res.send(successHtml);
  } catch (err) {
    return res.status(500).send('Server error');
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.query().findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  signup,
  login,
  changePassword,
  forgotPassword,
  requestPasswordReset,
  showResetPasswordPage,
  resetPassword,
  getProfile,
};