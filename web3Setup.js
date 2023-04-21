const Web3 = require('web3');

const INFURA_API_KEY = '0e73f815ab254177b0fe2016ecb83bc9'; // Replace with your actual Infura API key (Project ID)
const infuraUrl = `https://mainnet.infura.io/v3/${INFURA_API_KEY}`;

const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));

module.exports = web3;
