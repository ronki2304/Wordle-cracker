var fs = require('fs');
var rawlist = fs.readFileSync('resources/rawlist.csv').toString().split("\n");

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
fs.writeFileSync('resources/english.csv',unique.join('\n'));