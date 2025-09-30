const Catch = require('../models/Catch');
const User = require('../models/User');

exports.getUserCatches = async (req, res) => {
  try {
    const user = await User.findOne({pseudo: req.params.pseudo});
    res.json(user.catches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.addUserCatch = async (req, res) => {
  try {
    const newCatch = req.body;
    console.log(newCatch)
    const user = await User.findOne({pseudo: newCatch.pseudo});
    if(!user) {
      const newUser = new User({
        pseudo: newCatch.pseudo,
        catches: [newCatch.catch]
      })
      console.log(newUser)
      await newUser.save()
      console.log('test')
      res.status(201).json()
    } else {
      user.catches.push(newCatch.catch)
      await user.save()
      res.status(201).json()
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
}