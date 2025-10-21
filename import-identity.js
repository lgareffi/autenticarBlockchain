// import-identity.js
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

(async () => {
  const walletPath = path.join(__dirname, 'wallet');
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  const userId = 'User1@org1.example.com'; // debe coincidir con lo que usa tu fabric.js
  const mspId = 'Org1MSP';

  const certPath = path.join(__dirname, 'crypto', 'users', 'user1-cert.pem');
  const keyPath  = path.join(__dirname, 'crypto', 'users', 'user1-key.pem');

  // Si ya existe, no vuelve a importarla
  const existing = await wallet.get(userId);
  if (existing) {
    console.log(`ℹ️ La identidad ${userId} ya existe en ${walletPath}. No se hace nada.`);
    return;
  }

  const certificate = fs.readFileSync(certPath, 'utf8');
  const privateKey = fs.readFileSync(keyPath, 'utf8');

  await wallet.put(userId, {
    credentials: { certificate, privateKey },
    mspId,
    type: 'X.509'
  });

  console.log(`✅ Importada identidad ${userId} en ${walletPath}`);
})();
