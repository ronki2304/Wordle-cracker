/**
 * Wordle Cracker Server
 * @module server
 */

const fs = require('fs');
const readline = require('readline');
const solver = require('./routes/solver');

/**
 * Loads and validates configuration from config.json
 * @returns {Object} - Validated configuration object
 * @throws {Error} - If configuration is invalid or missing required properties
 */
function loadConfiguration() {
    try {
        const configData = fs.readFileSync('../resources/config.json', 'utf8');
        const config = JSON.parse(configData);
        if (!config) {
            throw new Error('Invalid configuration file - empty or malformed');
        }
        if (!config.ui || !config.ui.title || !config.ui.prompt || !config.ui.result) {
            throw new Error('Invalid configuration file - missing required UI properties');
        }
        return config;
    } catch (err) {
        console.error('Error loading configuration:', err.message);
        process.exit(1);
    }
}

// Load configuration
const config = loadConfiguration();

// Initialize readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Display initial UI
console.log(config.ui.title);
console.log(config.ui.prompt);

/**
 * Handles user input and processes word suggestions
 * @param {string} input - User input containing comma-separated words
 */
function handleUserInput(input) {
    try {
        if (!input || typeof input !== 'string' || input.trim() === '') {
            throw new Error('Invalid input - please provide comma-separated words');
        }
        
        const words = input.split(',').map(word => word.trim()).filter(word => word.length > 0);
        if (words.length === 0) {
            throw new Error('No valid words provided');
        }

        const bestWord = solver.ChooseBestWord(words);
        if (!bestWord) {
            throw new Error('No best word could be determined');
        }
        
        console.log(`${config.ui.result} ${bestWord}`);
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        rl.close();
    }
}

// Set up input handler
rl.on('line', handleUserInput);
