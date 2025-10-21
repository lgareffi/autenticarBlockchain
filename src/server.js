// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initFabric, shutdownFabric } = require('./fabric');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('AutentiCar backend ✅');
});

app.post('/record', async (req, res) => {
  try {
    const { vehicleId, eventHash } = req.body || {};
    if (!vehicleId || !eventHash) {
      return res.status(400).json({ error: 'vehicleId y eventHash son obligatorios' });
    }
    const { contract } = await initFabric();

    const tx = contract.createTransaction('recordEvent')
      .setEndorsingOrganizations('Org1MSP', 'Org2MSP'); // <- pedir ambas

    const result = await tx.submit(vehicleId, eventHash); // la función acepta 2 args
    return res.json({ ok: true, payload: JSON.parse(result.toString()) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/events/:vehicleId', async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { contract } = await initFabric();
    const result = await contract.evaluateTransaction('getEvents', vehicleId);
    return res.json(JSON.parse(result.toString()));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/exists', async (req, res) => {
  try {
    const { vehicleId, eventHash } = req.query;
    if (!vehicleId || !eventHash) {
      return res.status(400).json({ error: 'vehicleId y eventHash son obligatorios' });
    }
    const { contract } = await initFabric();
    const result = await contract.evaluateTransaction('exists', vehicleId, eventHash);
    return res.json({ exists: result.toString() === 'true' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend escuchando en http://localhost:${port}`);
});

process.on('SIGINT', async () => {
  await shutdownFabric();
  process.exit(0);
});
