import Booking from '../models/Booking.js';
import nodemailer from 'nodemailer';

export const createBooking = async (req, res) => {
  try {
    const data = req.body;

    // Save to MongoDB
    const booking = new Booking(data);
    await booking.save();

    // Send email using nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,     // Your Gmail ID
        pass: process.env.EMAIL_PASS,     // App password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECEIVER || 'your-email@example.com',
      subject: `New Internet Booking from ${data.name}`,
      html: `
        <h2>New Booking Details</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Address:</strong> ${data.address}</p>
                <p><strong>Address:</strong> ${data.zip}</p>

        <p><strong>Date:</strong> ${data.date}</p>
        <p><strong>Provider:</strong> ${data.provider}</p>
        <p><strong>Speed:</strong> ${data.speed}</p>
        <p><strong>Price:</strong> ${data.price}</p>
        <p><strong>Notes:</strong> ${data.notes || 'None'}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Booking saved and email sent!' });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ error: 'Failed to save booking or send email.' });
  }
};
