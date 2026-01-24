const Catch = require('../models/Catch');
const User = require('../models/User');

exports.getUserPokedex = async (req, res) => {
  try {
    const user = await User.findOne({_id: req.user.username});
    if (!user){
      return res.status(404).json({error : "Vous n'avez encore rien pêché"})
    }

    const catches = await Catch.find({}).lean();

    const normalSet = new Set(user.catches.filter(c => !c.shiny).map(c => c.code));
    const shinySet = new Set(user.catches.filter(c => c.shiny).map(c => c.code));

    const pokedex = catches.map(
      p => (
        {
          ...p,
          caughtNormal: normalSet.has(p.code),
          caughtShiny: shinySet.has(p.code)
        }
      )
    );

    return res.status(200).json(pokedex);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

exports.getUserStatistics = async (req, res) => {
  try {
    const user = await User.findOne({_id: req.user.username});
    if (!user){
      return res.status(404).json({error : "Vous n'avez encore rien pêché"})
    }

    const catches = await Catch.find({}).lean();
    const normalSet = new Set(user.catches.filter(c => !c.shiny).map(c => c.code));
    const shinySet = new Set(user.catches.filter(c => c.shiny).map(c => c.code));

    const statsGlobal = {
      total : catches.length,
      caughtNormal : normalSet.size,
      caughtShiny : shinySet.size
    };

    // Generations
    const generations = [...new Set(catches.map(c => c.gen))].sort((a, b) => a - b);

    const genMaps = catches.reduce((acc, pokemon) => {
        if (!acc[pokemon.gen]) {
            acc[pokemon.gen] = new Set();
        }
        acc[pokemon.gen].add(pokemon.code);
        return acc;
    }, {});

    const statsByGen = generations.map(gen => {
        const genSet = genMaps[gen];
        
        return {
            gen,
            total: genSet.size,
            caughtNormal: [...normalSet].filter(code => genSet.has(code)).length,
            caughtShiny: [...shinySet].filter(code => genSet.has(code)).length
        };
    });


    // Types
    const types = [...new Set(
      catches.flatMap(c => [c.type1, c.type2].filter(Boolean))
    )].sort();

    const typeMaps = catches.reduce((acc, pokemon) => {
        const types = [pokemon.type1, pokemon.type2].filter(Boolean);
        
        types.forEach(type => {
            if (!acc[type]) acc[type] = new Set();
            acc[type].add(pokemon.code);
        });
        
        return acc;
    }, {});

    const statsByType = types.map(type => {
        const typeSet = typeMaps[type];
        
        return {
            type,
            total: typeSet.size,
            caughtNormal: [...normalSet].filter(code => typeSet.has(code)).length,
            caughtShiny: [...shinySet].filter(code => typeSet.has(code)).length
        };
    });


    // Tags
    const tags = [...new Set(
      catches.flatMap(c => c.tags || [])
    )].sort();

    const tagMaps = catches.reduce((acc, p) => {
        if (Array.isArray(p.tags)) {
            p.tags.forEach(tag => {
                if (!acc[tag]) acc[tag] = new Set();
                acc[tag].add(p.code);
            });
        }
        return acc;
    }, {});
    
    const statsByTags = tags.map(tag => {
        const tagSet = tagMaps[tag];
            
        return {
            tag,
            total: tagSet.size,
            caughtNormal: [...normalSet].filter(code => tagSet.has(code)).length,
            caughtShiny: [...shinySet].filter(code => tagSet.has(code)).length
        };
    });

    return res.status(200).json({
      global : statsGlobal,
      generations : statsByGen,
      types : statsByType,
      tags : statsByTags
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

exports.addUserCatch = async (req, res) => {
  try {
    const { pseudo, catch: catchData } = req.body;
    let user = await User.findOne({_id : pseudo});

    if(!user) {
      user = new User({
        _id: pseudo,
        catches: [catchData]
      })
    } else {
      user.catches.push(catchData)
    }

    await user.save()
    return res.status(201).json()
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}