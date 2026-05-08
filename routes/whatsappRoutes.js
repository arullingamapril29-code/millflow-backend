const express = require('express');
const router = express.Router();
const twilio = require('twilio');

// Twilio credentials (get from https://twilio.com)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// POST /api/whatsapp/send-invoice
router.post('/send-invoice', async (req, res) => {
  try {
    const { to, invoice } = req.body;  // to = customer WhatsApp number (with country code)
    
    // Format message
    const itemsList = invoice.items?.map(item => 
      `${item.name} x${item.qty} = ₹${item.qty * item.price}`
    ).join('\n');
    
    const messageBody = `
🏭 MILLFLOW FACTORY INVOICE
━━━━━━━━━━━━━━━━━━━━
Invoice ID: #${invoice._id?.slice(-6)}
Customer: ${invoice.customerName}
Date: ${new Date(invoice.date).toLocaleDateString()}

Items:
${itemsList}
━━━━━━━━━━━━━━━━━━━━
Grand Total: ₹${invoice.total}
━━━━━━━━━━━━━━━━━━━━
Thank you for your business!
    `.trim();

    // Send WhatsApp message via Twilio
    const message = await client.messages.create({
      body: messageBody,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`, // e.g., whatsapp:+14155238886
      to: `whatsapp:${to}`
    });

    res.json({ success: true, message: 'Invoice sent via WhatsApp', sid: message.sid });
  } catch (error) {
    console.error('WhatsApp send error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;