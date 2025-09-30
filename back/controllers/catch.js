const Catch = require('../models/Catch');

exports.getCatches = async (req, res) => {
  try {
    const catches = await Catch.find({});
    res.json(catches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}