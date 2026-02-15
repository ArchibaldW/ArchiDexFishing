const Catch = require('../models/Catch');

const checkAchievements = async function(user) {
    const catches = await Catch.find({}).lean();
    const userCatches = new Set(user.catches.map(c => ({...c})))
    for (const userCatch of userCatches){
        const matchingCatch = catches.find(catche => catche.code === userCatch.code)
        userCatch.gen = matchingCatch.gen
        userCatch.tags = matchingCatch.tags
        userCatch.types = [matchingCatch.type1, matchingCatch.type2]
    }
    let achievements = []

    // Achievement 1 : Catch a pokémon
    if (!user.achievements.includes(1)){
        user.achievements.push(1)
        achievements.push({number : 1, name : "Il faut un début à tout" , description: "Capturer son premier pokémon"})
    }

    // Achievement 2 : Catch a shiny
    if (!user.achievements.includes(2)){
        if(user.catches.find(element => element.shiny === true)){
            user.achievements.push(2)
            achievements.push({number : 2, name : "Il a une couleur chelou non?" , description: "Capturer son premier shiny"})
        }
    }


    // Achievement 3 : Catch a starter
    if (!user.achievements.includes(3)){
        let isAchivementValid = false
        for (const userCatch of userCatches){
            if(userCatch.tags.includes("starter")){
                isAchivementValid = true;
                break;
            }
        }
        if(isAchivementValid){
            user.achievements.push(3)
            achievements.push({number : 3, name : "C'était lui mon premier partenaire" , description: "Capturer son premier starter"})
        }
    }

    // Achievement 4 : Catch a shiny starter
    if (!user.achievements.includes(4)){
        let isAchivementValid = false
        for (const userCatch of userCatches){
            if(userCatch.tags.includes("starter") && userCatch.shiny === true){
                isAchivementValid = true;
                break;
            }
        }
        if(isAchivementValid){
            user.achievements.push(4)
            achievements.push({number : 4, name : "Un succès après 150h de reset" , description: "Capturer son premier starter shiny"})
        }
    }


    // Achievement 5 : Catch a fossil
    if (!user.achievements.includes(5)){
        let isAchivementValid = false
        for (const userCatch of userCatches){
            if(userCatch.tags.includes("fossil")){
                isAchivementValid = true;
                break;
            }
        }
        if(isAchivementValid){
            user.achievements.push(5)
            achievements.push({number : 5, name : "Jvoulais être archiste moi, pas paléontologue" , description: "Capturer son premier fossile"})
        }
    }

    // Achievement 6 : Catch a shiny fossil
    if (!user.achievements.includes(6)){
        let isAchivementValid = false
        for (const userCatch of userCatches){
            if(userCatch.tags.includes("fossil") && userCatch.shiny === true){
                isAchivementValid = true;
                break;
            }
        }
        if(isAchivementValid){
            user.achievements.push(6)
            achievements.push({number : 6, name : "Avec ça, jvais monter en grade à l'APF" , description: "Capturer son premier fossile shiny"})
        }
    }
    

    // Achievement 7 : Catch a legendary
    if (!user.achievements.includes(7)){
        let isAchivementValid = false
        for (const userCatch of userCatches){
            if(userCatch.tags.includes("legendary")){
                isAchivementValid = true;
                break;
            }
        }
        if(isAchivementValid){
            user.achievements.push(7)
            achievements.push({number : 7, name : "Une pépite rare rien qu'à moi" , description: "Capturer son premier légendaire"})
        }
    }

    // Achievement 8 : Catch a shiny legendary
    if (!user.achievements.includes(8)){
        let isAchivementValid = false
        for (const userCatch of userCatches){
            if(userCatch.tags.includes("legendary") && userCatch.shiny === true){
                isAchivementValid = true;
                break;
            }
        }
        if(isAchivementValid){
            user.achievements.push(8)
            achievements.push({number : 8, name : "Encore plus rare que la rareté, le saint graal des pokézouz" , description: "Capturer son premier légendaire shiny"})
        }
    }


    // Achievement 9 : Catch a mega-evolution pokémon
    if (!user.achievements.includes(9)){
        let isAchivementValid = false
        for (const userCatch of userCatches){
            if(userCatch.tags.includes("mega")){
                isAchivementValid = true;
                break;
            }
        }
        if(isAchivementValid){
            user.achievements.push(9)
            achievements.push({number : 9, name : "La puissance à l'état brut" , description: "Capturer son premier pokémon méga-evolué"})
        }
    }

    // Achievement 10 : Catch a shiny méga-evolution pokémon
    if (!user.achievements.includes(10)){
        let isAchivementValid = false
        for (const userCatch of userCatches){
            if(userCatch.tags.includes("mega") && userCatch.shiny === true){
                isAchivementValid = true;
                break;
            }
        }
        if(isAchivementValid){
            user.achievements.push(10)
            achievements.push({number : 10, name : "Puissant oui, mais avec un ptit truc en plus" , description: "Capturer son premier pokémon méga-evolué shiny"})
        }
    }


    
    if (!user.achievements.includes(11) || !user.achievements.includes(12) || !user.achievements.includes(13) || !user.achievements.includes(14) || !user.achievements.includes(15)){
        const counts = user.catches.reduce((acc, element) => {
            const key = `${element.code}|${element.shiny}`;
            acc.set(key, (acc.get(key) || 0) +1)
            return acc;
        }, new Map());
        const maxCount = Math.max(...counts.values())

        // Achievement 11 : Catch a same pokemon twice
        if (!user.achievements.includes(11)){
            if(maxCount >= 2){
                user.achievements.push(11)
                achievements.push({number : 11, name : "Je t'ai déjà pas vu par ici toi?" , description: "Capturer un pokémon en double"})
            }
        }

        // Achievement 12 : Catch a same pokemon five times
        if (!user.achievements.includes(12)){
            if(maxCount >= 5){
                user.achievements.push(12)
                achievements.push({number : 12, name : "Une certaine réminiscence entêtante" , description: "Capturer un pokémon en cinq exemplaires"})
            }
        }

        // Achievement 13 : Catch a same pokemon ten times
        if (!user.achievements.includes(13)){
            if(maxCount >= 10){
                user.achievements.push(13)
                achievements.push({number : 13, name : "Ce pokémon qui croit être mon pote" , description: "Capturer un pokémon en dix exemplaires"})
            }
        }

        // Achievement 14 : Catch a same pokemon twenty times
        if (!user.achievements.includes(14)){
            if(maxCount >= 20){
                user.achievements.push(14)
                achievements.push({number : 14, name : "Lui, lui, encore lui et toujours lui" , description: "Capturer un pokémon en vingt exemplaires"})
            }
        }

        // Achievement 15 : Catch a same pokemon fifty times
        if (!user.achievements.includes(15)){
            if(maxCount >= 50){
                user.achievements.push(15)
                achievements.push({number : 15, name : "Un parasite tel qu'on en voit rarement" , description: "Capturer un pokémon en cinquante exemplaires"})
            }
        }
    }

    if (!user.achievements.includes(16) || !user.achievements.includes(17)){
        const counts = user.catches.filter(element => element.shiny === true).reduce((acc, element) => {
            const key = `${element.code}`;
            acc.set(key, (acc.get(key) || 0) +1)
            return acc;
        }, new Map());
        const maxCount = Math.max(...counts.values())

        // Achievement 16 : Catch a same shiny pokemon twice
        if (!user.achievements.includes(16)){
            if(maxCount >= 2){
                user.achievements.push(16)
                achievements.push({number : 16, name : "Une doublette dont on se passerait bien" , description: "Capturer un pokémon shiny en double"})
            }
        }

        // Achievement 17 : Catch a same shiny pokemon ten times
        if (!user.achievements.includes(17)){
            if(maxCount >= 10){
                user.achievements.push(17)
                achievements.push({number : 17, name : "Une certaine idée la poisse" , description: "Capturer un pokémon shiny en dix exemplaires"})
            }
        }
    }

    return {achievements, user}
}

module.exports = checkAchievements;