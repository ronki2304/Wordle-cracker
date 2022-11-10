//missing one part describe the right word and the list filtered
//filter the dic list with the filter mask based on the last word
function filterList(language, total, start,computelist, filter, LastWord) {
    if (!computelist){
        var fs = require('fs');
        rawlist = fs.readFileSync(`./resources/${language}.csv`).toString().split("\n");
                
        computelist = rawlist.filter(p => p.length == total && (p.startsWith(start) || !start))
        return computelist
    }
    
    
    
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
    console.log(filteredlist.length + " words still remain eligibles");
    return filteredlist;

}





// determine which is the word that have most correspondance
function ChooseBestWord(wordlist) {
    //load ressource file
   
   
    let bestword = [], result = 0;

    

  
        computelist=wordlist
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

            if (result < tempRes) {
                result = tempRes;
                bestword = [];
                bestword.push(computelist[word]);

            }

        }
    



    //let's try to find the most relevant word in the list proposed just below
    let datas={}
    return bestword
    
}

module.exports = { filterList, ChooseBestWord }