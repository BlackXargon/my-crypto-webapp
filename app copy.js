const axios = require('axios');
const express = require('express');
const cors = require('cors'); // Add this line
const web3 = require('./web3Setup');
const app = express();
const port = 3000;

app.use(cors()); // Add this line

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/fetch-blockchain-data', async (req, res) => {
  try {
    // Resolve the ENS domain name to an Ethereum address
    const address = await web3.eth.ens.getAddress('blackxargon.eth');

    // Fetch the balance for the resolved Ethereum address
    const balance = await web3.eth.getBalance(address);
    const balanceInEther = web3.utils.fromWei(balance, 'ether');

    res.json({ balance: balanceInEther });
  } catch (error) {
    console.error('Error fetching blockchain data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.get('/fetch-tokens', async (req, res) => {
  try {
    const ensDomain = 'blackxargon.eth';
    const address = await web3.eth.ens.getAddress(ensDomain);

    const etherscanApiKey = 'T92GXDQZMM5KKJYEMPGBXYJIS2Y9SI7U96';
    const response = await axios.get(`https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=${etherscanApiKey}`);

    res.send(response.data);
  } catch (error) {
    console.error('Error fetching tokens:', error);
    res.status(500).send({ error: 'Error fetching tokens' });
  }
});



