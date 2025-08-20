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
  <div style="font-family: Arial, sans-serif;  padding:30px;">
    <table style="max-width:700px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #f1d4d4;">
      <tr>
        <td style="background:#e63946; color:#fff; padding:20px; text-align:center; font-size:22px; font-weight:bold;">
          ZenithLink – New Order Details
        </td>
      </tr>
      <tr>
        <td style="padding:25px;">
          <h2 style="margin:0 0 15px; color:#b71c1c; font-size:20px;">Order Summary</h2>

          <table style="width:100%; border-collapse:collapse;">
            <tr>
              <td style="padding:8px; border-bottom:1px solid #eee; width:200px;"><strong>Provider</strong></td>
              <td style="padding:8px; border-bottom:1px solid #eee;">${data.provider || "—"}</td>
            </tr>
          </table>

          <h3 style="margin:20px 0 10px; color:#e63946; font-size:16px;">Contact Info</h3>
          <table style="width:100%; border-collapse:collapse;">
            <tr><td style="padding:6px; width:200px;"><strong>Business</strong></td><td>${data.contact?.businessName || "—"}</td></tr>
            <tr><td style="padding:6px;"><strong>Name</strong></td><td>${data.contact?.title || ""} ${data.contact?.firstName || ""} ${data.contact?.lastName || ""}</td></tr>
            <tr><td style="padding:6px;"><strong>Email</strong></td><td>${data.contact?.email || "—"}</td></tr>
            <tr><td style="padding:6px;"><strong>Phone</strong></td><td>${data.contact?.phone || "—"}</td></tr>
          </table>

          <h3 style="margin:20px 0 10px; color:#e63946; font-size:16px;">Service Address</h3>
          <p style="margin:0; padding:6px; background:#fff5f5; border:1px solid #f1d4d4; border-radius:4px;">
            ${data.serviceAddress?.street || ""}, ${data.serviceAddress?.city || ""}, ${data.serviceAddress?.state || ""} ${data.serviceAddress?.zip || ""}
          </p>

          <h3 style="margin:20px 0 10px; color:#e63946; font-size:16px;">Billing Address</h3>
          <p style="margin:0; padding:6px; background:#fff5f5; border:1px solid #f1d4d4; border-radius:4px;">
            ${data.billingAddress?.street || ""}, ${data.billingAddress?.city || ""}, ${data.billingAddress?.state || ""} ${data.billingAddress?.zip || ""}
          </p>

          <h3 style="margin:20px 0 10px; color:#e63946; font-size:16px;">Authorized Contacts</h3>
          <ul style="margin:0; padding-left:20px; color:#444;">
            ${(data.authorizedContacts || [])
              .map(
                (c) =>
                  `<li style="margin-bottom:5px;">${c.name || ""} - ${c.email || ""} - ${c.phone || ""}</li>`
              )
              .join("")}
          </ul>

          <h3 style="margin:20px 0 10px; color:#e63946; font-size:16px;">Communication</h3>
          <table style="width:100%; border-collapse:collapse;">
            <tr><td style="padding:6px; width:200px;"><strong>Voice</strong></td><td>${data.comm?.voice ? "Yes" : "No"}</td></tr>
            <tr><td style="padding:6px;"><strong>Directory Listing</strong></td><td>${data.comm?.directoryListing || "—"}</td></tr>
            <tr><td style="padding:6px;"><strong>Industry Header</strong></td><td>${data.comm?.industryHeader || "—"}</td></tr>
            <tr><td style="padding:6px;"><strong>Phone Type</strong></td><td>${data.comm?.phoneNumberType || "—"}</td></tr>
            <tr><td style="padding:6px;"><strong>Extra Lines</strong></td><td>${data.comm?.extraPhoneLines || 0}</td></tr>
          </table>

          <h3 style="margin:20px 0 10px; color:#e63946; font-size:16px;">Internet</h3>
          <table style="width:100%; border-collapse:collapse;">
            <tr><td style="padding:6px; width:200px;"><strong>Plan ID</strong></td><td>${data.internet?.planId || "—"}</td></tr>
            <tr><td style="padding:6px;"><strong>Business WiFi</strong></td><td>${data.internet?.addBusinessWifi ? "Yes" : "No"}</td></tr>
            <tr><td style="padding:6px;"><strong>Static IPs</strong></td><td>${data.internet?.staticIpQty || 0}</td></tr>
            <tr><td style="padding:6px;"><strong>Wireless Backup</strong></td><td>${data.internet?.wirelessBackup ? "Yes" : "No"}</td></tr>
            <tr><td style="padding:6px;"><strong>Apple TV 4K</strong></td><td>${data.internet?.appleTV4K ? "Yes" : "No"}</td></tr>
          </table>

          <h3 style="margin:20px 0 10px; color:#e63946; font-size:16px;">Pricing</h3>
          <table style="width:100%; border-collapse:collapse;">
            <tr><td style="padding:6px; width:200px;"><strong>Monthly</strong></td><td>$${(data.pricing?.monthly || 0).toFixed(2)}</td></tr>
            <tr><td style="padding:6px;"><strong>One-Time</strong></td><td>$${(data.pricing?.oneTime || 0).toFixed(2)}</td></tr>
          </table>

          <h3 style="margin:20px 0 10px; color:#e63946; font-size:16px;">Install</h3>
          <table style="width:100%; border-collapse:collapse;">
            <tr><td style="padding:6px; width:200px;"><strong>Type</strong></td><td>${data.install?.type || "—"}</td></tr>
            <tr><td style="padding:6px;"><strong>Recipient</strong></td><td>${data.install?.recipientFirst || ""} ${data.install?.recipientLast || ""}</td></tr>
          </table>

          <h3 style="margin:20px 0 10px; color:#e63946; font-size:16px;">Property</h3>
          <table style="width:100%; border-collapse:collapse;">
            <tr><td style="padding:6px; width:200px;"><strong>Same as Contact</strong></td><td>${data.property?.sameAsContact ? "Yes" : "No"}</td></tr>
            <tr><td style="padding:6px;"><strong>Name</strong></td><td>${data.property?.name || "—"}</td></tr>
            <tr><td style="padding:6px;"><strong>Email</strong></td><td>${data.property?.email || "—"}</td></tr>
            <tr><td style="padding:6px;"><strong>Phone</strong></td><td>${data.property?.phone || "—"}</td></tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="background:#fde8e8; text-align:center; padding:15px; font-size:12px; color:#666;">
          © ${new Date().getFullYear()} ZenithLink. All rights reserved.
        </td>
      </tr>
    </table>
  </div>
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
