const Catch = require('../models/Catch');
const Achievements = require('../models/Achievements');

const checkAchievements = async function(user) {
    const catches = await Catch.find({}).lean();
    const achievementsList = await Achievements.find({}).lean();
    const userCatches = new Set(user.catches.map(c => ({...c})))
    for (const userCatch of userCatches){
        const matchingCatch = catches.find(catche => catche.code === userCatch.code)
        userCatch.gen = matchingCatch.gen
        userCatch.tags = matchingCatch.tags
        userCatch.types = [matchingCatch.type1, matchingCatch.type2]
    }
    let achievementsOwned = []
    let achievementNumber = 1

    // Achievement 1 : Catch a pokémon
    if (!user.achievements.includes(achievementNumber)){
        user.achievements.push(achievementNumber)
        achievementsOwned.push(achievementsList[achievementNumber -1])
    }

    achievementNumber ++

    // Achievement 2 : Catch a shiny
    if (!user.achievements.includes(achievementNumber)){
        if(user.catches.find(element => element.shiny === true)){
            user.achievements.push(achievementNumber)
            achievementsOwned.push(achievementsList[achievementNumber -1])
        }
    }

    achievementNumber ++

    // Achievement 3 : Catch a starter
    if (!user.achievements.includes(achievementNumber)){
        let isAchivementValid = false
        for (const userCatch of userCatches){
            if(userCatch.tags.includes("starter")){
                isAchivementValid = true;
                break;
            }
        }
        if(isAchivementValid){
            user.achievements.push(achievementNumber)
            achievementsOwned.push(achievementsList[achievementNumber -1])
        }
    }

    achievementNumber ++

    // Achievement 4 : Catch a shiny starter
    if (!user.achievements.includes(achievementNumber)){
        let isAchivementValid = false
        for (const userCatch of userCatches){
            if(userCatch.tags.includes("starter") && userCatch.shiny === true){
                isAchivementValid = true;
                break;
            }
        }
        if(isAchivementValid){
            user.achievements.push(achievementNumber)
            achievementsOwned.push(achievementsList[achievementNumber -1])
        }
    }

    achievementNumber ++

    // Achievement 5 : Catch a fossil
    if (!user.achievements.includes(achievementNumber)){
        let isAchivementValid = false
        for (const userCatch of userCatches){
            if(userCatch.tags.includes("fossil")){
                isAchivementValid = true;
                break;
            }
        }
        if(isAchivementValid){
            user.achievements.push(achievementNumber)
            achievementsOwned.push(achievementsList[achievementNumber -1])
        }
    }

    achievementNumber ++

    // Achievement 6 : Catch a shiny fossil
    if (!user.achievements.includes(achievementNumber)){
        let isAchivementValid = false
        for (const userCatch of userCatches){
            if(userCatch.tags.includes("fossil") && userCatch.shiny === true){
                isAchivementValid = true;
                break;
            }
        }
        if(isAchivementValid){
            user.achievements.push(achievementNumber)
            achievementsOwned.push(achievementsList[achievementNumber -1])
        }
    }
    
    achievementNumber ++

    // Achievement 7 : Catch a legendary
    if (!user.achievements.includes(achievementNumber)){
        let isAchivementValid = false
        for (const userCatch of userCatches){
            if(userCatch.tags.includes("legendary")){
                isAchivementValid = true;
                break;
            }
        }
        if(isAchivementValid){
            user.achievements.push(achievementNumber)
            achievementsOwned.push(achievementsList[achievementNumber -1])
        }
    }

    
    achievementNumber ++

    // Achievement 8 : Catch a shiny legendary
    if (!user.achievements.includes(achievementNumber)){
        let isAchivementValid = false
        for (const userCatch of userCatches){
            if(userCatch.tags.includes("legendary") && userCatch.shiny === true){
                isAchivementValid = true;
                break;
            }
        }
        if(isAchivementValid){
            user.achievements.push(achievementNumber)
            achievementsOwned.push(achievementsList[achievementNumber -1])
        }
    }

    achievementNumber ++

    // Achievement 9 : Catch a mega-evolution pokémon
    if (!user.achievements.includes(achievementNumber)){
        let isAchivementValid = false
        for (const userCatch of userCatches){
            if(userCatch.tags.includes("mega")){
                isAchivementValid = true;
                break;
            }
        }
        if(isAchivementValid){
            user.achievements.push(achievementNumber)
            achievementsOwned.push(achievementsList[achievementNumber -1])
        }
    }

    achievementNumber ++

    // Achievement 10 : Catch a shiny méga-evolution pokémon
    if (!user.achievements.includes(achievementNumber)){
        let isAchivementValid = false
        for (const userCatch of userCatches){
            if(userCatch.tags.includes("mega") && userCatch.shiny === true){
                isAchivementValid = true;
                break;
            }
        }
        if(isAchivementValid){
            user.achievements.push(achievementNumber)
            achievementsOwned.push(achievementsList[achievementNumber -1])
        }
    }
    
    achievementNumber ++

    if (!user.achievements.includes(11) || !user.achievements.includes(12) || !user.achievements.includes(13) || !user.achievements.includes(14) || !user.achievements.includes(15)){
        const counts = user.catches.reduce((acc, element) => {
            const key = `${element.code}|${element.shiny}`;
            acc.set(key, (acc.get(key) || 0) +1)
            return acc;
        }, new Map());
        const maxCount = Math.max(...counts.values())

        // Achievement 11 : Catch a same pokemon twice
        if (!user.achievements.includes(achievementNumber)){
            if(maxCount >= 2){
                user.achievements.push(achievementNumber)
                achievementsOwned.push(achievementsList[achievementNumber -1])
            }
        }

        achievementNumber ++

        // Achievement 12 : Catch a same pokemon five times
        if (!user.achievements.includes(achievementNumber)){
            if(maxCount >= 5){
                user.achievements.push(achievementNumber)
                achievementsOwned.push(achievementsList[achievementNumber -1])
            }
        }
        
        achievementNumber ++

        // Achievement 13 : Catch a same pokemon ten times
        if (!user.achievements.includes(achievementNumber)){
            if(maxCount >= 10){
                user.achievements.push(achievementNumber)
                achievementsOwned.push(achievementsList[achievementNumber -1])
            }
        }

        achievementNumber ++

        // Achievement 14 : Catch a same pokemon twenty times
        if (!user.achievements.includes(achievementNumber)){
            if(maxCount >= 20){
                user.achievements.push(achievementNumber)
                achievementsOwned.push(achievementsList[achievementNumber -1])
            }
        }

        achievementNumber ++

        // Achievement 15 : Catch a same pokemon fifty times
        if (!user.achievements.includes(achievementNumber)){
            if(maxCount >= 50){
                user.achievements.push(achievementNumber)
                achievementsOwned.push(achievementsList[achievementNumber -1])
            }
        }
    }

    achievementNumber ++

    if (!user.achievements.includes(16) || !user.achievements.includes(17)){
        const counts = user.catches.filter(element => element.shiny === true).reduce((acc, element) => {
            const key = `${element.code}`;
            acc.set(key, (acc.get(key) || 0) +1)
            return acc;
        }, new Map());
        const maxCount = Math.max(...counts.values())

        // Achievement 16 : Catch a same shiny pokemon twice
        if (!user.achievements.includes(achievementNumber)){
            if(maxCount >= 2){
                user.achievements.push(achievementNumber)
                achievementsOwned.push(achievementsList[achievementNumber -1])
            }
        }

        achievementNumber ++

        // Achievement 17 : Catch a same shiny pokemon ten times
        if (!user.achievements.includes(achievementNumber)){
            if(maxCount >= 10){
                user.achievements.push(achievementNumber)
                achievementsOwned.push(achievementsList[achievementNumber -1])
            }
        }

        achievementNumber ++
    }

    return {achievementsOwned, user}
}

module.exports = checkAchievements;