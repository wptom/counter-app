const express = require('express');
const router = express.Router();
const Counter = require('../models/Counter');

// Získat aktuální hodnotu počítadla
router.get('/', async (req, res) => {
  try {
    const counter = await Counter.getCounter();
    res.json({ value: counter.value });
  } catch (error) {
    res.status(500).json({ error: 'Chyba při načítání počítadla' });
  }
});

// Zvýšit počítadlo
router.post('/increment', async (req, res) => {
  try {
    const counter = await Counter.getCounter();
    counter.value += 1;
    counter.updatedAt = new Date();
    await counter.save();
    res.json({ value: counter.value });
  } catch (error) {
    res.status(500).json({ error: 'Chyba při zvyšování počítadla' });
  }
});

// Snížit počítadlo
router.post('/decrement', async (req, res) => {
  try {
    const counter = await Counter.getCounter();
    counter.value -= 1;
    counter.updatedAt = new Date();
    await counter.save();
    res.json({ value: counter.value });
  } catch (error) {
    res.status(500).json({ error: 'Chyba při snižování počítadla' });
  }
});

module.exports = router;
