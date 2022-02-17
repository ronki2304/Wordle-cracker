//this file is for the first analysis
// the first load is so long that the game become unplayable
// so we will load a precalculated first winning word for all length
// run with node computeFirstTry.js {lang}
function computePower(computelist) {
    let bestword = [], result = 0;


    for (let word in computelist) {
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
    console.log("dictionnary reduced to " + result)
    console.log("the best word to apply is " + bestword);
    return bestword
}

var fs = require('fs');

const myArgs = process.argv.slice(2);

const language = myArgs[0];
console.log('myArgs: ', language);

if(!fs.existsSync(`resources/${language}.csv`))
    return;

rawlist = fs.readFileSync(`resources/${language}.csv`).toString().split("\n");

let cmpt=2;
let result=[];

while (true)
{
    let filterlist = rawlist.filter(p => p.length == cmpt);
    
    if (filterlist.length==0)
        break;
    
    result.push({word_length:cmpt, best_word:computePower(filterlist)})    
    cmpt++;
}


fs.writeFileSync(`resources/${language}_firstshot.json`,JSON.stringify(result));