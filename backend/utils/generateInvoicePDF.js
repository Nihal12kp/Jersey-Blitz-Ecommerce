import fs from "fs";
import path from "path";
import pdf from "html-pdf";
import handlebars from "handlebars";
import { fileURLToPath } from "url";

// ✅ ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename + "/utils");

export const generateInvoicePDF = async (order) => {
  try {
    const customerName =
      order.userDetails?.fullName || order.userId?.name || "Customer";
    const email = order.userId?.email || "customer@mail.com";

    // ✅ Resolve the template path safely
    const templatePath = path.resolve(
      __dirname,
      "../template/InvoiceTemplate.html"
    );
    const templateHtml = fs.readFileSync(templatePath, "utf-8");

    // ✅ Compile template with handlebars
    const template = handlebars.compile(templateHtml);

    const html = template({
      orderId: order._id,
      date: new Date(order.createdAt).toLocaleDateString(),
      customerName,
      email,
      items: order.cartItems.map((item, index) => ({
        index: index + 1,
        name: item.productId?.name || "N/A",
        sizes: Array.isArray(item.sizes) ? item.sizes.join(", ") : item.sizes || "N/A",
        quantity: item.quantity,
        price: item.productId?.new_price || 0,
        total: item.quantity * (item.productId?.new_price || 0),
      })),
      totalAmount: order.totalAmount,
    });

    const options = { format: "A4" };

    // ✅ Return PDF buffer wrapped in a Promise
    return new Promise((resolve, reject) => {
      pdf.create(html, options).toBuffer((err, buffer) => {
        if (err) {
          console.error("❌ PDF generation failed:", err.message);
          return reject(err);
        }
        resolve(buffer);
      });
    });
  } catch (error) {
    console.error("❌ Failed to generate invoice PDF:", error.message);
    throw error;
  }
};
