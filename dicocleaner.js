var fs = require('fs');
console.log("clean the dictionnary")
var rawlist = fs.readFileSync('resources/rawlist.csv').toString().split("\n");

const myArgs = process.argv.slice(2);

const language = myArgs[0];

var newlist=[];
for (let index in rawlist)
{
    if (!rawlist[index].includes('-') && !rawlist[index].includes('#') && !rawlist[index].includes('\''))
        newlist.push(rawlist[index].replace(" ","").toUpperCase());
}
console.log(rawlist.length)
console.log(newlist.length)
const unique = [ ...new Set(newlist)]
console.log(unique.length)
fs.writeFileSync(`resources/${language}.csv`,unique.join('\n'));