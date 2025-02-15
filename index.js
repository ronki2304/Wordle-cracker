const readline = require('readline');
let loop = 0 //count how many time to find the word and store it in config

// determine which is the word that have most correspondance
function computePower(computelist, secondturn=false) {
    let bestword = [], result = 0;


    for (let word in computelist) {
        let wordchars = computelist[word].split('');
        let tempRes = 0;

        //compute the score of all word in the list against all word in the list
        //the higher wins
        for (let i = 0; i < computelist.length; i++) {
            let dicoword = computelist[i].split('');
            for (let j = 0; j < wordchars.length; j++) {
                if (dicoword.includes(wordchars[j])) {
                    tempRes += 1;

                    //replace the letter by _ to get multiple same letter

                    for (let a in dicoword) {
                        if (dicoword[a] == wordchars[j]) {
                            dicoword[a] = '_';
                        }
                    }
                }
            }
        }

        if (result == tempRes) {
            bestword.push(computelist[word]);
        }

        if (result < tempRes ) {
            result = tempRes;
            bestword = [];
            bestword.push(computelist[word]);

        }
       

    }
    
    

    //let's try to find the most relevant word in the list proposed just below
    if (bestword.length>1 && !secondturn)
    {
        computePower(bestword,true);
    }
    else{
        console.log("here is the list of best words to apply " + bestword);
    }
}

//filter the dic list with the filter mask based on the last word
function filterList(computelist, filter, LastWord) {
    let filteredlist = [];
    let filters = filter.split(' ');
    CharLastWord = LastWord.split('');

    for (let i = 0; i < computelist.length; i++) {
        let activeWord = computelist[i].split('');
        let maskword = LastWord.split('');


        let add = true; //at the end if = equal true then add the word to the filtered list

        //first check all 2 are ok

        for (let j = 0; j < filters.length; j++) {
            if (filters[j] == 2 && activeWord[j] == maskword[j]) {
                activeWord[j] = '_';
                maskword[j] = '_';
            }
            if (filters[j] == 2 && activeWord[j] != maskword[j]) {
                add = false;
                break;
            }
        }
        //if all 2 are not compliant then go next word
        if (!add)
            continue;

        //if all ok now filter words with letter not at the right place
        for (let j = 0; j < filters.length; j++) {
            if (filters[j] == 1) {
                if (activeWord.includes(maskword[j])) {
                    if (maskword[j] == activeWord[j]) {
                        add = false;
                        break;
                    }
                    for (let k = 0; k < activeWord.length; k++) {
                        if (activeWord[k] == maskword[j]) {
                            activeWord[k] = '_';
                            maskword[j] = '_';
                            break;
                        }
                    }
                }
                else {
                    add = false;
                    break;
                }
            }
        }
        //if all 1 are not compliant then go next word
        if (!add)
            continue;

        //now exclude all letter not present
        for (let j = 0; j < filters.length; j++) {
            if (filters[j] == 0 && activeWord.includes(maskword[j])) {
                add = false;
                break;
            }
        }
        //then add the word to the new list
        if (add)
            filteredlist.push(computelist[i]);


    }
    console.log(filteredlist.length+" words still remain eligibles");
    return filteredlist;

}
//first check the best word in the list

//load ressource file
var fs = require('fs');

//determine available language
const config = JSON.parse(fs.readFileSync("resources/config.json"));

let wordlist = [], answers = { result: '0' }, rawlist
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
//which languages
const questionLanguage = () => {
    return new Promise((resolve, reject) => {
        rl.question(`Which languages do you want ? [${config.languages}] `, (answer) => {
            answers.language = answer.toLowerCase();
            resolve()
        })
    })
}
// how many letter in the word question
const questionLetter = () => {
    return new Promise((resolve, reject) => {
        rl.question('What is the word length? ', (answer) => {
            answers.total = answer;
            resolve()
        })
    })
}
// what is the first letter
const questionStart = () => {
    return new Promise((resolve, reject) => {
        rl.question('Do you know the first letter (leave blank if not)? ', (answer) => {
            if (answer)
                answers.start = answer.toUpperCase();
            resolve()
        })
    })
}


// what is the word question
const questionWord = () => {
    return new Promise((resolve, reject) => {
        rl.question('What is the word selected? ', (answer) => {

            answers.word = answer.toUpperCase();
            resolve()
        })
    })
}
//what is the result
const questionResult = () => {
    return new Promise((resolve, reject) => {
        rl.question('What is the result? ', (answer) => {
            answers.result = answer;
            resolve()
        })
    })
}

rl.on('close', function () {
    if (loop==0)
        console.log("See you later");
    else {
        if (wordlist.length != 0){
            console.log('\nI won !!! the word is ' + answers.word);

            //saving stat
            let stat 
            //if the file exist use it or create it
            if (fs.existsSync('resources/stat.json'))
                stat=JSON.parse(fs.readFileSync('resources/stat.json'))
            else
                stat={}
                
            if (!stat[answers.language])
                stat[answers.language]={}
            
            if (!stat[answers.language][answers.total])
                stat[answers.language][answers.total] = []

                stat[answers.language][answers.total].push(loop);
            
            fs.writeFileSync('resources/stat.json',JSON.stringify(stat))
        }
        else
            console.log("sorry there is a mistake in your answers or the word is not in my dictionnary")
        
        
        
    }
    process.exit(0);
});
//
const algo = async () => {
    console.log("let's start");
    do {
        await questionLanguage();
    }
    while (!fs.existsSync(`resources/${answers.language}.csv`))

    rawlist = fs.readFileSync(`resources/${answers.language}.csv`).toString().split("\n");
    await questionLetter();
    await questionStart();
    wordlist = rawlist.filter(p => p.length == answers.total && (p.startsWith(answers.start) || !answers.start))


    while ((answers.result.includes('1') || answers.result.includes('0')) && wordlist.length > 0) {

        if (loop==0 && !answers.start) {
            firstTime = false;
            let first = JSON.parse(fs.readFileSync(`resources/firstShoot.json`))[answers.language];
            console.log(`the best word to apply is ${first.filter(p => p.word_length == answers.total)[0].best_word}`)
        }
        else {
            console.log('loading');
            computePower(wordlist);
        }

        do { await questionWord(); }
        while (answers.word.includes(' ')) //lot of time i mixed the answer to this one and the next one
        do {
            await questionResult();
        }
        while (!answers.result.includes(' ')) //just to check you answer with the pattern

        wordlist = filterList(wordlist, answers.result, answers.word);

loop++;
    }


    rl.close()
}


algo();
//algo
//premierement trouvé le mot qui a le meilleur score dans toute la liste (logiquement c'est tjsle meme)
// recupérer le resultat de wordle
// filtrer la premiere liste pour n'avoir que les mots qui correspondent au resultat de wordle
//recommencer l'etape 1

// valeur pour l'entrée
// 0 pas présent
// 1 mal placé
// 2 bien placé