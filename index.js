const readline = require('readline');
const config = require('./resources/config.json');
let loop = 0 //count how many time to find the word and store it in config

// determine which is the word that have most correspondance
function computePower(computelist, secondturn=false) {
    // Create a frequency map for each position in the words
    const letterFrequency = Array.from({length: computelist[0].length}, () => ({}));
    
    // First pass: build frequency map
    for (const word of computelist) {
        for (let i = 0; i < word.length; i++) {
            const letter = word[i];
            letterFrequency[i][letter] = (letterFrequency[i][letter] || 0) + 1;
        }
    }

    // Second pass: score each word based on frequency
    const wordScores = new Map();
    let maxScore = 0;
    let bestWords = [];

    for (const word of computelist) {
        let score = 0;
        const usedLetters = new Set();
        
        for (let i = 0; i < word.length; i++) {
            const letter = word[i];
            if (!usedLetters.has(letter)) {
                score += letterFrequency[i][letter] || 0;
                usedLetters.add(letter);
            }
        }

        wordScores.set(word, score);
        
        if (score > maxScore) {
            maxScore = score;
            bestWords = [word];
        } else if (score === maxScore) {
            bestWords.push(word);
        }
    }

    //let's try to find the most relevant word in the list proposed just below
    if (bestWords.length > 1 && !secondturn) {
        computePower(bestWords, true);
    }
    else {
        console.log("here is the list of best words to apply " + bestWords.join(', '));
    }
}

//filter the dic list with the filter mask based on the last word
function filterList(computelist, filter, LastWord) {
    const filters = filter.split(' ');
    const lastWordLetters = LastWord.split('');
    const filteredlist = [];

    // Precompute letter positions for quick lookup
    const requiredLetters = new Set();
    const excludedLetters = new Set();
    const positionRequirements = new Map();

    for (let i = 0; i < filters.length; i++) {
        const filterVal = filters[i];
        const letter = lastWordLetters[i];
        
        if (filterVal === '2') {
            positionRequirements.set(i, letter);
            requiredLetters.add(letter);
        } else if (filterVal === '1') {
            requiredLetters.add(letter);
        } else if (filterVal === '0') {
            excludedLetters.add(letter);
        }
    }

    // Filter words in single pass
    for (const word of computelist) {
        const wordLetters = word.split('');
        let isValid = true;

        // Check position requirements first
        for (const [index, requiredLetter] of positionRequirements) {
            if (wordLetters[index] !== requiredLetter) {
                isValid = false;
                break;
            }
        }

        if (!isValid) continue;

        // Check required letters
        for (const letter of requiredLetters) {
            if (!wordLetters.includes(letter)) {
                isValid = false;
                break;
            }
        }

        if (!isValid) continue;

        // Check excluded letters
        for (const letter of excludedLetters) {
            if (wordLetters.includes(letter)) {
                isValid = false;
                break;
            }
        }

        if (isValid) {
            filteredlist.push(word);
        }
    }
    console.log(filteredlist.length+" words still remain eligibles");
    return filteredlist;
}

//load ressource file
var fs = require('fs');

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

const algo = async () => {
    console.log(config.ui.title);
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
            console.log(`${config.ui.result} ${first.filter(p => p.word_length == answers.total)[0].best_word}`)
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
