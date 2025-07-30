
import express from 'express';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

const router = express.Router();

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  date: { type: Date, default: Date.now },
});
const Contact = mongoose.model('Contact', contactSchema);

router.post('/contact', async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.Gmail,
        pass: process.env.Password,
      },
    });

    const mailOptions = {
      from: `"${req.body.name}" <${req.body.email}>`,
      to: process.env.Gmail,
      subject: `New Contact Form Message: ${req.body.subject}`,
      html: `
        <h3>New Message from Website Contact Form</h3>
        <p><b>Name:</b> ${req.body.name}</p>
        <p><b>Email:</b> ${req.body.email}</p>
        <p><b>Phone:</b> ${req.body.phone}</p>
        <hr/>
        <p><b>Message:</b></p>
        <p>${req.body.message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('SERVER ERROR:', error);
    res.status(500).json({ message: error.message || 'Failed to send message. Please try again later.' });
  }
});

export default router;