import nodemailer from "nodemailer";
import { generateInvoicePDF } from "./generateInvoicePDF.js";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

// ✅ Fix for ES Modules (__dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename + "/utils");
console.log("EMAIL:", process.env.SMTP_EMAIL);
console.log("PASS:", process.env.SMTP_PASSWORD);

// ✅ Mail transporter config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // <-- Add this to bypass self-signed cert error not recommened for production
  },
});

export const sendOrderConfirmation = async (email, order) => {
  
  try {
    if (!order || !order.userDetails || !order.userDetails.fullName) {
      throw new Error("Invalid order object provided to email sender.");
    }

    // ✅ Generate PDF buffer
    const buffer = await generateInvoicePDF(order);

    // ✅ Compile email HTML template
    const templatePath = path.resolve(
      __dirname,
      "../template/mailTemplate.html"
    );
    const source = fs.readFileSync(templatePath, "utf-8");
    const template = handlebars.compile(source);
    const html = template({
      fullName: order.userDetails.fullName,
      orderId: order._id.toString(),
    });

    // ✅ Email options
    const mailOptions = {
      from: `"Jersey Blitz" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Your Order Confirmation - Jersey Blitz",
      html,
      attachments: [
        {
          filename: `invoice_${order._id}.pdf`,
          content: buffer,
          contentType: "application/pdf",
        },
      ],
    };

    // ✅ Send email
    await transporter.sendMail(mailOptions);
    console.log("✅ Order confirmation email sent to:", email);
  } catch (error) {
    console.error("❌ Failed to send order confirmation email:", error.message);
    throw error;
  }
};
