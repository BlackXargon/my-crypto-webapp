const axios = require('axios');
const express = require('express');
const cors = require('cors');
const web3 = require('./web3Setup');
const app = express();
const port = 3000;

// imports for web3 balance call?
const fs = require('fs');
const path = require('path');
const ERC20_ABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, './erc20_abi.json')));


app.use(cors());
app.use(express.json()); // Add this line

// -------------------- ENDPOINTS ------------------------------

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/fetch-blockchain-data', async (req, res) => {
  try {
    let address = req.body.address;
    
    // Resolve ENS domain if necessary
    if (address.endsWith('.eth')) {
      address = await web3.eth.ens.getAddress(address);
    }

    const balance = await web3.eth.getBalance(address);
    const balanceInEther = web3.utils.fromWei(balance, 'ether');

    res.json({ balance: balanceInEther });
  } catch (error) {
    console.error('Error fetching blockchain data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.get('/fetch-tokens', async (req, res) => {
  try {
    //const address = req.body.address; // Use the address from the request payload
    const address = req.query.address; // Get the address from the query parameter

    const etherscanApiKey = 'T92GXDQZMM5KKJYEMPGBXYJIS2Y9SI7U96';
    const response = await axios.get(`https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=${etherscanApiKey}`);

    res.send(response.data);
  } catch (error) {
    console.error('Error fetching tokens:', error);
    res.status(500).send({ error: 'Error fetching tokens' });
  }


});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
