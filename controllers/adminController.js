import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';

export const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ email, password: hashedPassword });

    res.status(201).json({ message: 'Admin created', admin: { email: admin.email } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
