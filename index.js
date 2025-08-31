const express = require('express');
const axios = require('axios');
const app = express();

const API_KEY = 'your-api-key';
const STORE_ID = 'your-store-id';
const BTCPAY_URL = 'https://btcpay0.voltageapp.io';

app.get('/', (req, res) => {
  res.send(`
    <html><body>
      <form id="invoiceForm">
        <input type="number" id="amount" step="0.01" placeholder="CHF" required />
        <button type="submit">Pay</button>
      </form>
      <script>
        document.getElementById('invoiceForm').addEventListener('submit', function(e) {
          e.preventDefault();
          const amount = document.getElementById('amount').value;
          window.location.href = '/pay?amount=' + amount;
        });
      </script>
    </body></html>
  `);
});

app.get('/pay', async (req, res) => {
  const amount = parseFloat(req.query.amount);
  if (!amount || isNaN(amount)) return res.status(400).send('Invalid amount.');

  try {
    const invoice = await axios.post(
      \`\${BTCPAY_URL}/api/v1/stores/\${STORE_ID}/invoices\`,
      { amount, currency: 'CHF', checkout: { speedPolicy: 'HighSpeed' } },
      { headers: { Authorization: \`token \${API_KEY}\`, 'Content-Type': 'application/json' } }
    );
    res.redirect(invoice.data.checkoutLink);
  } catch (e) {
    res.status(500).send('Error creating invoice: ' + e.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port', PORT));
