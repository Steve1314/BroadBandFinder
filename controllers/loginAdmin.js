import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
  { id: admin._id, isAdmin: true }, // store role
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);

res.status(200).json({
  token,
  admin: { email: admin.email, isAdmin: true }
});

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
