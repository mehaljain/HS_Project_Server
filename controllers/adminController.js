const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  console.log('[/api/admin/login] body:', req.body);
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    const normalizedEmail = String(email).toLowerCase().trim();
    const admin = await Admin.findOne({ email: normalizedEmail });
    console.log('Found admin:', !!admin, admin ? admin.email : null);

    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log('bcrypt compare result:', isMatch);

    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    if (!process.env.JWT_SECRET) {
      console.error('Missing JWT_SECRET!');
      return res.status(500).json({ message: 'Server config error' });
    }

    const token = jwt.sign({ id: admin._id, role: admin.role || 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token, admin: { id: admin._id, email: admin.email }, isAdmin: true });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Register new admin
exports.register = async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password required' });
  }
  try {
    const normalizedEmail = String(email).toLowerCase().trim();
    const existingAdmin = await Admin.findOne({ email: normalizedEmail });
    if (existingAdmin) {
      return res.status(409).json({ message: 'Admin with this email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email: normalizedEmail, password: hashedPassword });
    await newAdmin.save();
    return res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};