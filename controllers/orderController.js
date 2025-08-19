// controllers/orderController.js
import Order from "../models/Order.js"; // assuming you have a Mongoose model
import nodemailer from "nodemailer";
import validator from "validator";

// Create new order
export const createOrder = async (req, res) => {
  try {
    const data = req.body;

    // Save order in MongoDB
    const order = new Order(data);
    await order.save();

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Shared HTML body
    const htmlBody = `
      <h2>New Order Details</h2>
      <h3>Provider</h3>
      <p>${data.provider}</p>

      <h3>Contact Info</h3>
      <p><strong>Business:</strong> ${data.contact?.businessName || "—"}</p>
      <p><strong>Name:</strong> ${data.contact?.title || ""} ${
      data.contact?.firstName || ""
    } ${data.contact?.lastName || ""}</p>
      <p><strong>Email:</strong> ${data.contact?.email || "—"}</p>
      <p><strong>Phone:</strong> ${data.contact?.phone || "—"}</p>

      <h3>Service Address</h3>
      <p>${data.serviceAddress?.street || ""}, ${
      data.serviceAddress?.city || ""
    }, ${data.serviceAddress?.state || ""} ${data.serviceAddress?.zip || ""}</p>

      <h3>Billing Address</h3>
      <p>${data.billingAddress?.street || ""}, ${
      data.billingAddress?.city || ""
    }, ${data.billingAddress?.state || ""} ${data.billingAddress?.zip || ""}</p>

      <h3>Authorized Contacts</h3>
      <ul>
        ${(data.authorizedContacts || [])
          .map(
            (c) =>
              `<li>${c.name || ""} - ${c.email || ""} - ${c.phone || ""}</li>`
          )
          .join("")}
      </ul>

      <h3>Communication</h3>
      <p><strong>Voice:</strong> ${data.comm?.voice ? "Yes" : "No"}</p>
      <p><strong>Directory Listing:</strong> ${
        data.comm?.directoryListing || "—"
      }</p>
      <p><strong>Industry Header:</strong> ${
        data.comm?.industryHeader || "—"
      }</p>
      <p><strong>Phone Type:</strong> ${data.comm?.phoneNumberType || "—"}</p>
      <p><strong>Extra Lines:</strong> ${data.comm?.extraPhoneLines || 0}</p>

      <h3>Internet</h3>
      <p><strong>Plan ID:</strong> ${data.internet?.planId || "—"}</p>
      <p><strong>Business WiFi:</strong> ${
        data.internet?.addBusinessWifi ? "Yes" : "No"
      }</p>
      <p><strong>Static IPs:</strong> ${data.internet?.staticIpQty || 0}</p>
      <p><strong>Wireless Backup:</strong> ${
        data.internet?.wirelessBackup ? "Yes" : "No"
      }</p>
      <p><strong>Apple TV 4K:</strong> ${
        data.internet?.appleTV4K ? "Yes" : "No"
      }</p>

      <h3>Pricing</h3>
      <p><strong>Monthly:</strong> $${data.pricing?.monthly || 0}</p>
      <p><strong>One-Time:</strong> $${data.pricing?.oneTime || 0}</p>

      <h3>Install</h3>
      <p><strong>Type:</strong> ${data.install?.type || "—"}</p>
      <p><strong>Recipient:</strong> ${data.install?.recipientFirst || ""} ${
      data.install?.recipientLast || ""
    }</p>

      <h3>Property</h3>
      <p><strong>Same as Contact:</strong> ${
        data.property?.sameAsContact ? "Yes" : "No"
      }</p>
      <p><strong>Name:</strong> ${data.property?.name || "—"}</p>
      <p><strong>Email:</strong> ${data.property?.email || "—"}</p>
      <p><strong>Phone:</strong> ${data.property?.phone || "—"}</p>
    `;

    // Email to Admin
      const adminMail = {
      from: `"ZenithLink Orders" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Order from ${data?.contact?.firstName || "Unknown"} ${data?.contact?.lastName || ""}`,
      text: `New order received from ${data.contact?.firstName || "Unknown"}.`,
      html: htmlBody,
    };

    // Email to Customer
    const userMail = {
      from: `"ZenithLink Orders" <${process.env.EMAIL_USER}>`,
      to: data.contact?.email,
      subject: "ZenithLink – Your Order Confirmation",
      text: `Hi ${data.contact?.firstName}, your order has been successfully placed. We will contact you shortly.`,
      html: `
        <h2>Thank you for your order, ${data.contact?.firstName || "Customer"}!</h2>
        <p>Your order has been successfully placed. Here are the details:</p>
        ${htmlBody}
        <p>We will contact you shortly regarding installation and next steps.</p>
      `,
    };

    // Send both emails
    await transporter.sendMail(adminMail);
    if (data.contact?.email && validator.isEmail(data.contact.email)) {
      await transporter.sendMail(userMail);
    }

    res.status(201).json({
      success: true,
      message: "Order created and emails sent",
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order or send email",
    });
  }
};

// Get all orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update order (if needed, you can add this function)
// export const updateOrder = async (req, res) => {
//   try {
//     const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!order) return res.status(404).json({ success: false, message: "Order not found" });
//     res.status(200).json({ success: true, order });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server error"
//   });
//   }
// Delete order (if needed, you can add this function)

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
