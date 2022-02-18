//target create the nerdle dictionnary
// operande : 0 1 2 3 4 5 6 7 8 9
// operators : + - * / =
// limit size 8 characters
//so the max size of one operands is 4
//max operands 3
const fs = require('fs');
let operande1, operande2, operande3
let rawlist = [];


for (operande1 = 1; operande1 < 1000; operande1++) {
    for (operande2 = 1; operande2 < 1000; operande2++) {
        let result = '';

        result = result.concat(operande1, '+', operande2, '=', operande1 + operande2);
        if (result.length == 8)
            rawlist.push(result); result = '';
        result = result.concat(operande1, '-', operande2, '=', operande1 - operande2);
        if (result.length == 8 && operande1 - operande2 >= 0)
            rawlist.push(result); result = '';
        result = result.concat(operande1, '*', operande2, '=', operande1 * operande2);
        if (result.length == 8)
            rawlist.push(result); result = '';
        result = result.concat(operande1, '/', operande2, '=', operande1 / operande2);
        if (result.length == 8 && operande1 / operande2 == Math.floor(operande1 / operande2))
            rawlist.push(result); result = '';
    }
}
for (operande1 = 1; operande1 <= 100; operande1++) {
    for (operande2 = 1; operande2 <= 100; operande2++) {
        for (operande3 = 1; operande3 <= 100; operande3++) {
            let result = '';

            result = result.concat(operande1, '+', operande2, '+', operande3, '=', operande1 + operande2 + operande3);
            if (result.length == 8)
                rawlist.push(result); result = '';

            result = result.concat(operande1, '+', operande2, '-', operande3, '=', operande1 + operande2 - operande3);
            if (result.length == 8 && operande1 + operande2 - operande3>=0)
                rawlist.push(result); result = '';

            result = result.concat(operande1, '+', operande2, '*', operande3, '=', operande1 + operande2 * operande3);
            if (result.length == 8)
                rawlist.push(result); result = '';
            
            result = result.concat(operande1, '+', operande2, '/', operande3, '=', operande1 + operande2 / operande3);
            if (result.length == 8 && operande1 + operande2 / operande3 == Math.floor(operande1 + operande2 / operande3))
                rawlist.push(result); result = '';

         
         
          
                result = result.concat(operande1, '-', operande2, '+', operande3, '=', operande1 - operande2 + operande3);
                if (result.length == 8 && operande1 - operande2 + operande3>=0)
                    rawlist.push(result); result = '';
                result = result.concat(operande1, '-', operande2, '-', operande3, '=', operande1 - operande2 - operande3);
                if (result.length == 8&& operande1 - operande2 - operande3>=0)
                    rawlist.push(result); result = '';
                
                
                    result = result.concat(operande1, '-', operande2, '*', operande3, '=', operande1 - operande2 * operande3);
                if (result.length == 8 && operande1 - operande2 * operande3>=0)
                    rawlist.push(result); result = '';
                result = result.concat(operande1, '-', operande2, '/', operande3, '=', operande1 - operande2 / operande3);
                if (result.length == 8 && operande2 / operande3 == Math.floor(operande2 / operande3) && operande1 - operande2 / operande3 >=0)
                    rawlist.push(result); result = '';
            




            result = result.concat(operande1, '*', operande2, '+', operande3, '=', operande1 * operande2 + operande3);
            if (result.length == 8)
                rawlist.push(result); result = '';

            result = result.concat(operande1, '*', operande2, '-', operande3, '=', operande1 * operande2 - operande3);
            if (result.length == 8 && operande1 * operande2 - operande3>=0)
                rawlist.push(result); result = '';

            result = result.concat(operande1, '*', operande2, '*', operande3, '=', operande1 * operande2 * operande3);
            if (result.length == 8)
                rawlist.push(result); result = '';
            if (operande3 == 0)
                continue;
            result = result.concat(operande1, '*', operande2, '/', operande3, '=', operande1 * operande2 / operande3);
            if (result.length == 8 && operande1 * operande2 / operande3 == Math.floor(operande1 * operande2 / operande3))
                rawlist.push(result); result = '';


          


            result = result.concat(operande1, '/', operande2, '+', operande3, '=', operande1 / operande2 + operande3);
            if (result.length == 8 && operande1 / operande2 == Math.floor(operande1 / operande2))
                rawlist.push(result); result = '';

            result = result.concat(operande1, '/', operande2, '-', operande3, '=', operande1 / operande2 - operande3);
            if (result.length == 8 && operande1 / operande2 == Math.floor(operande1 / operande2) && operande1 / operande2 - operande3>=0)
                rawlist.push(result); result = '';

            result = result.concat(operande1, '/', operande2, '*', operande3, '=', operande1 / operande2 * operande3);
            if (result.length == 8 && operande1 / operande2 == Math.floor(operande1 / operande2))
                rawlist.push(result); result = '';
            result = result.concat(operande1, '/', operande2, '/', operande3, '=', operande1 / operande2 / operande3);
            if (result.length == 8 && operande1 / operande2 / operande3 == Math.floor(operande1 / operande2 / operande3))
                rawlist.push(result); result = '';
        }
    }
}
fs.writeFileSync(`resources/nerdle.csv`, rawlist.join('\n'));