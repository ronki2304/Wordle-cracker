//this file is for the first analysis
// the first load is so long that the game become unplayable
// so we will load a precalculated first winning word for all length
// run with node computeFirstTry.js {lang}
function computePower(computelist) {
    let bestword = [], result = 0;


    for (let word in computelist) {
        if (word % 1000 == 0)
            console.log("line already processed : " + word);
        let wordchars = computelist[word].split('');
        let tempRes = 0;

        for (let i = 0; i < computelist.length; i++) {


            //check letter at the right place
            let dicoword = computelist[i].split('');
            for (let j = 0; j < wordchars.length; j++) {

                if (dicoword.includes(wordchars[j])) {
                    tempRes += 1;

                    //replace the letter by _ to check the next 

                    for (let a in dicoword) {
                        if (dicoword[a] == wordchars[j]) {
                            dicoword[a] = '_';
                        }
                    }

                }

            }



        }

        if (result < tempRes && !bestword.includes(computelist[word])) {
            result = tempRes;
            bestword = [];
            bestword.push(computelist[word]);

        }
        if (result == tempRes && !bestword.includes(computelist[word])) {
            bestword.push(computelist[word]);
        }

    }
    console.log("best score " + result)
    console.log("the best word to apply is " + bestword);
    return bestword
}

//cleaning phase

function clean() {
    var fs = require('fs');
    console.log("clean the dictionnary");
    
    const myArgs = process.argv.slice(2);
    if (myArgs.length === 0) {
        throw new Error('Language parameter is required');
    }
    const language = myArgs[0];
    if (typeof language !== 'string' || language.trim() === '') {
        throw new Error('Invalid language parameter');
    }

    let rawlist;
    try {
        rawlist = fs.readFileSync('resources/rawlist.csv', 'utf8').toString().split("\n");
        if (rawlist.length === 0) {
            throw new Error('rawlist.csv is empty');
        }
    } catch (err) {
        console.error('Error reading rawlist.csv:', err.message);
        process.exit(1);
    }

    var newlist = [];
    for (let index in rawlist) {
        if (!rawlist[index].includes('-') && !rawlist[index].includes('#') && !rawlist[index].includes('\''))
            newlist.push(rawlist[index].replace(" ", "").toUpperCase());
    }
    console.log(rawlist.length);
    console.log(newlist.length);
    const unique = [...new Set(newlist)];
    console.log(unique.length);
    
    try {
        fs.writeFileSync(`resources/${language}.csv`, unique.join('\n'), 'utf8');
    } catch (err) {
        console.error('Error writing language file:', err.message);
        process.exit(1);
    }
}



function computeAll() {
    console.log("start first stat phase");
    var fs = require('fs');

    const myArgs = process.argv.slice(2);
    if (myArgs.length === 0) {
        throw new Error('Language parameter is required');
    }
    const language = myArgs[0];
    if (typeof language !== 'string' || language.trim() === '') {
        throw new Error('Invalid language parameter');
    }
    console.log('myArgs: ', language);

    if (!fs.existsSync(`resources/${language}.csv`)) {
        throw new Error(`Language file for ${language} does not exist`);
    }

    let rawlist;
    try {
        rawlist = fs.readFileSync(`resources/${language}.csv`, 'utf8').toString().split("\n");
        if (rawlist.length === 0) {
            throw new Error('Language file is empty');
        }
    } catch (err) {
        console.error('Error reading language file:', err.message);
        process.exit(1);
    }

    let cmpt = 2;
    let result = [];

    while (true) {
        let filterlist = rawlist.filter(p => p.length == cmpt);

        if (filterlist.length == 0)
            break;

        result.push({ word_length: cmpt, best_word: computePower(filterlist) });
        cmpt++;
    }

    //update first shoot json file
    let firstshoot;
    try {
        const firstShootData = fs.readFileSync('resources/firstShoot.json', 'utf8');
        firstshoot = JSON.parse(firstShootData);
        if (!firstshoot) {
            throw new Error('Invalid firstShoot.json data');
        }
    } catch (err) {
        console.error('Error reading firstShoot.json:', err.message);
        process.exit(1);
    }

    firstshoot[language] = result;

    try {
        fs.writeFileSync(`resources/firstShoot.json`, JSON.stringify(firstshoot, null, 2), 'utf8');
    } catch (err) {
        console.error('Error writing firstShoot.json:', err.message);
        process.exit(1);
    }

    //update the config file to add the new available language
    let config;
    try {
        const configData = fs.readFileSync("resources/config.json", 'utf8');
        config = JSON.parse(configData);
        if (!config || !Array.isArray(config.languages)) {
            throw new Error('Invalid config.json data');
        }
    } catch (err) {
        console.error('Error reading config.json:', err.message);
        process.exit(1);
    }

    if (!config.languages.includes(language)) {
        config.languages.push(language);
        try {
            fs.writeFileSync('resources/config.json', JSON.stringify(config, null, 2), 'utf8');
        } catch (err) {
            console.error('Error writing config.json:', err.message);
            process.exit(1);
        }
    }
}

clean();
computeAll();
