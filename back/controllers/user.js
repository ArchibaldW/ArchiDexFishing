const Catch = require('../models/Catch');
const User = require('../models/User');

exports.getUserCatches = async (req, res) => {
  try {
    const user = await User.findOne({_id: req.user.username});
    res.json(user.catches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.getUserStatistics = async (req, res) => {
  try {
    const user = await User.findOne({_id: req.user.username});

    
    res.json(user.catches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.addUserCatch = async (req, res) => {
  try {
    const { pseudo, catch: catchData } = req.body;
    const user = await User.findOne({pseudo});

    if(!user) {
      const newUser = new User({
        _id: pseudo,
        pseudo: pseudo,
        catches: [catchData]
      })
    } else {
      user.catches.push(catchData)
    }

    await user.save()
    res.status(201).json()
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
}