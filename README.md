# Yes another Wordle/nerdle solver

I know there are tone of wordle solver. And I know why, because it is cool to code yours.

So here is mine.

## Nerdle

:warning: Breaking news, this solver works with nerdle too

## How to install it

* as requirement you need nodejs (min 13.7) and npm(min 6.14) installed
* clone this repo
* npm install

## Algo

```mermaid
graph TD;
    A["dictionary extraction"]-->B
    B["find the word that have the most letter in common with the others"]-->C;
    C[word try in wordle]-->D;
    D[remove all word that not respect the result from wordle]-->B;
```

## How to use it

In terminal run `npm run main` or `node index`

You have to follow the questions

When the algo ask for the result from wordle here is the syntax `* * * * *` where * can be :

* 0 letter is not present
* 1 letter is present but not at the right place
* 2 the letter is present and at the right place

## Statistic

basically this algo find the word in three tries

## Supported languages

two languages supported :
* english
* french

## add new language

If someone (let me hope) wants a new language please share me a representative dictionary.

### Process for adding new language

* format the dictionnary one word per line with carrier return : `\n`
* save it in resources/rawlist.csv
* run npm run new_language --first=`{language}` (linux only) (note it may take multiple hours   )

## Disclaimer

I am not responsible if this code ruins your game's experience