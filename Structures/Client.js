const { Client,  } = require('discord.js');

module.exports = class MyClient extends Client {
    constructor(options) {
        super(options);
    }
    translations = {
        attractionEmbedTitle: { dutch: 'Welke attractie is afgebeeld in dit plaatje?', english: 'What attraction is shown in this image?' },
        attractionModalTitle: { dutch: 'Welke attractie denk je dat het is?', english: 'Wich attraction do you think it is?' },
        attractionInputLabel: { dutch: 'Attractie', english: 'Attraction' },
        attractionSuccessEmbedTitle: { dutch: 'Dat is inderdaad ${extraText}', english: 'That is indeed ${extraText}' },
        attractionWrongEmbedTitle: { dutch: '${extraText} is helaas niet het goede antwoord. Het juiste antwoord was ${rightInfo}', english: '${extraText} is onfortunatly not the right answer. The right answer was ${rightInfo}' },
        attractionButtonText: { dutch: 'Klik op mij om je antwoord in te voeren', english: 'Press me to enter your answer' },
        timeUp: { dutch: 'Tijd is op!', english: 'You ran out of time!' },
    }
    translate(InteractionLocale, extraText, rightInfo) {
        
        const tranlationObjectToReturn = {};
        for(const key of Object.keys(this.translations)) {
            const translation = {};
            translation[key] = this.translations[key]
            InteractionLocale === 'nl' ?translation[key] = translation[key].dutch.replace(/\$\{extraText\}/g, extraText).replace(/\$\{rightInfo\}/g, rightInfo) : translation[key] = translation[key].english.replace(/\$\{extraText\}/g, extraText).replace(/\$\{rightInfo\}/g, rightInfo);
            
            // console.log(translation[key])
            tranlationObjectToReturn[key] = translation[key]
        }
        // console.log(tranlationObjectToReturn)
        return tranlationObjectToReturn;
    }
    
}