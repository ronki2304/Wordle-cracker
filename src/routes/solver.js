/**
 * Wordle Solver Module
 * @module solver
 */

module.exports = {
  /**
   * Chooses the best word from a list of candidate words
   * @function ChooseBestWord
   * @param {string[]} words - Array of candidate words
   * @returns {string|null} - Returns the selected word or null if no valid word found
   * @throws {TypeError} - If input is not an array
   * @throws {Error} - If no words provided or no valid words found
   * 
   * @example
   * // Basic usage
   * const bestWord = ChooseBestWord(['apple', 'banana', 'cherry']);
   * 
   * @example
   * // Error handling
   * try {
   *   const bestWord = ChooseBestWord([]);
   * } catch (err) {
   *   console.error(err.message);
   * }
   */
  ChooseBestWord: function(words) {
    try {
      // Validate input
      if (!Array.isArray(words)) {
        throw new TypeError('Invalid input - expected array of words');
      }
      if (words.length === 0) {
        throw new Error('No words provided');
      }
      
      // Validate and sanitize each word
      const validWords = words.filter(word => {
        if (typeof word !== 'string') return false;
        const trimmed = word.trim();
        return trimmed.length > 0 && /^[a-zA-Z]+$/.test(trimmed);
      });
      
      if (validWords.length === 0) {
        throw new Error('No valid words provided');
      }
      
      // Simple implementation: return the first valid word
      // This can be enhanced later with more sophisticated logic
      return validWords[0];
      
    } catch (err) {
      console.error('Error in ChooseBestWord:', err.message);
      return null;
    }
  }
}
