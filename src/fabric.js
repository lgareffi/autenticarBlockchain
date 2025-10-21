// src/fabric.js
const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

let gateway;
let contract;

const CCP_PATH   = path.join(__dirname, '..', 'connection-org1.json');
const WALLET_DIR = path.join(__dirname, '..', 'wallet');

// Rutas a tus PEM que copiaste del VM
const CERT_PATH  = path.join(__dirname, '..', 'crypto', 'users', 'user1-cert.pem');
const KEY_PATH   = path.join(__dirname, '..', 'crypto', 'users', 'user1-key.pem');

// Label con el que guardaremos/buscaremos la identidad en el wallet
const ID_LABEL = process.env.FABRIC_ID || 'User1@org1.example.com';
const MSPID    = 'Org1MSP';

async function initFabric() {
  if (contract) return { contract };

  const ccp = JSON.parse(fs.readFileSync(CCP_PATH, 'utf8'));
  const wallet = await Wallets.newFileSystemWallet(WALLET_DIR);

  // Cargar/crear identidad en el wallet si no existe
  let identity = await wallet.get(ID_LABEL);
  if (!identity) {
    const certificate = fs.readFileSync(CERT_PATH, 'utf8');
    const privateKey  = fs.readFileSync(KEY_PATH, 'utf8');
    identity = {
      credentials: { certificate, privateKey },
      mspId: MSPID,
      type: 'X.509',
    };
    await wallet.put(ID_LABEL, identity);
  }

  gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: ID_LABEL,
    discovery: { enabled: false }, // antes: { enabled: true, asLocalhost: false }
  });


  const network = await gateway.getNetwork('mychannel');
  contract = network.getContract('autenticar');
  return { contract };
}

async function shutdownFabric() {
  if (gateway) {
    gateway.disconnect();
    gateway = undefined;
    contract = undefined;
  }
}

module.exports = { initFabric, shutdownFabric };


