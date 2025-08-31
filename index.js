const express = require('express');
const axios = require('axios');
const app = express();

const API_KEY = 'c71926f4e1b1fe41b9cece1bba4c399870f2341e';
const STORE_ID = '8VzLhvYhypE3K2HdJTchT8Va3rdhfJFsChSvcgMj3ohc';
const BTCPAY_URL = 'https://btcpay0.voltageapp.io';

app.get('/pay', async (req, res) => {
  const amount = parseFloat(req.query.amount);
  if (!amount || isNaN(amount)) {
    return res.status(400).send('Montant invalide (ex: /pay?amount=19.99)');
  }

  try {
    const response = await axios.post(
      `${BTCPAY_URL}/api/v1/stores/${STORE_ID}/invoices`,
      {
        amount: amount,
        currency: 'USD',
        checkout: { speedPolicy: 'HighSpeed' }
      },
      {
        headers: {
          Authorization: `token ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const invoiceUrl = response.data.checkoutLink;
    res.redirect(invoiceUrl);
  } catch (err) {
    const errorMessage = err.response?.data || err.message;
    console.error('Erreur création facture :', errorMessage);
    res.status(500).send('Erreur BTCPay : ' + JSON.stringify(errorMessage));
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en ligne sur le port ${PORT}`);
});
