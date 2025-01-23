import nodeLcs from 'node-lcs';

// Define Constants
const MAX_OPTIONS = 20;
const THRESHOLD = 0.625;
const REGEX_SPLIT = /[\s-,()]+/;
const COMMON_WORDS = [
  'left',
  'right',
  'bilateral',
  'in',
  'of',
  'or',
  'the',
  'my',
];

// Wrapper to use for testing
const lcsWrapper = {
  nodeLcsFunction: (str1, str2) => {
    return nodeLcs(str1, str2).length;
  },
};

/**
 * Removes common words from the input string to avoid matching on words
 * that are in many suggestions
 * @param {string} inputStr - string provided by user
 * @returns {string} string with removed common words
 */
function stripCommonWords(inputStr) {
  const regMatch = new RegExp(`\\b(${COMMON_WORDS.join('|')})\\b`, 'gi');
  return inputStr
    .replace(regMatch, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Finds the similarity score by finding the scores between each word in the input
 * string and disability suggestion and then sums the LCS scores
 * @param {string} inputWord - user input string
 * @param {string} disabilityWord - disability suggestion string
 * @param {string} splitReg - regular expression to split the string
 * @returns {int} the similarity score between words
 */
function lcsScoreByWordSum(inputWord, disabilityWord, splitReg = REGEX_SPLIT) {
  const tempScoreList = [];
  const splitInput = stripCommonWords(inputWord.toLowerCase()).split(splitReg);
  const disWordSplit = stripCommonWords(disabilityWord.toLowerCase()).split(
    splitReg,
  );
  for (let i = 0; i < splitInput.length; i += 1) {
    disWordSplit.forEach(
      t =>
        lcsWrapper.nodeLcsFunction(t, splitInput[i]) >= 3
          ? tempScoreList.push(lcsWrapper.nodeLcsFunction(t, splitInput[i]))
          : null,
    );
  }
  return tempScoreList.reduce((acc, current) => acc + current, 0);
}

// Adds lcsScoreByWordSum to the lcsWrapper object
lcsWrapper.lcsByWord = (str1, str2) => {
  return lcsScoreByWordSum(str1, str2);
};
/**
 * Counts the number of overlapping words between the user input and the dropdown terms
 * @param {string} userInput
 * @param {string} dropdownTerm
 * @param {string} splitreg - regular expression to split the string
 * @returns {int}
 */
function countOverlapWords(userInput, dropdownTerm, splitreg = REGEX_SPLIT) {
  const splitInput = stripCommonWords(userInput).split(splitreg);
  const splitOption = stripCommonWords(dropdownTerm).split(splitreg);
  const tempOverlapList = [];
  for (let i = 0; i < splitInput.length; i += 1) {
    for (let j = 0; j < splitOption.length; j += 1) {
      if (splitOption[j].includes(splitInput[i])) {
        tempOverlapList.push(splitInput[i]);
      }
    }
  }
  const tempUniqueList = Array.from(new Set(tempOverlapList));
  return tempUniqueList.length;
}

/**
 * Filters the disability labels by longest common substring (LCS) for single word inputs
 * or LCS by word if multiple word input
 * @param {string} userInput - user input string
 * @param {Array} disabilityLabels - full list of suggested disability conditions
 * @param {float} threshold - score threshold defined as LCS score / userInput string length
 * @param {string} splitreg - regular expression to split the string
 * @returns list of recommended disability conditions
 */

function lcsSingleVsMulti(
  userInput,
  disabilityLabels,
  threshold = THRESHOLD,
  splitreg = REGEX_SPLIT,
) {
  return disabilityLabels
    .map(option => {
      const label = option.toUpperCase();
      const val = userInput.toUpperCase().replace(/[^a-zA-Z ]/g, '');
      let simScore = 0;
      if (val.split(splitreg).length < 2) {
        simScore = lcsWrapper.nodeLcsFunction(
          stripCommonWords(val),
          stripCommonWords(label),
        );
        // simScore = 0;
      } else {
        simScore = lcsWrapper.lcsByWord(
          stripCommonWords(val),
          stripCommonWords(label),
        );
      }
      return {
        score: simScore,
        original: option,
      };
    })
    .filter(a => a.score / userInput.length >= threshold)
    .sort((a, b) => {
      return b.score - a.score;
    })
    .slice(0, MAX_OPTIONS);
}
/**
 * Returns search results using the countOverlap search method
 * @param {string} userInput
 * @param {Array} disabilityLabels list of disability terms
 * @param {string} splitreg regular expression to split the string
 * @returns {Array} Array of objects containing the score and original word
 */
function substringSearchCountOverlap(
  userInput,
  disabilityLabels,
  splitreg = REGEX_SPLIT,
) {
  const scoreFilter = stripCommonWords(userInput)
    .toUpperCase()
    .replace(/[^a-zA-Z ]/g, '')
    .split(splitreg).length;
  return disabilityLabels
    .map(option => {
      const label = option.toUpperCase().replace(/[^a-zA-Z ]/g, '');
      const val = userInput.toUpperCase().replace(/[^a-zA-Z ]/g, '');
      const score = countOverlapWords(
        stripCommonWords(val),
        stripCommonWords(label),
      );
      return {
        score,
        original: option,
      };
    })
    .filter(a => a.score >= scoreFilter)
    .sort((a, b) => {
      return b.score - a.score;
    })
    .slice(0, 20);
}

/**
 * Creates list of the suggested disabilitys by combining the words that start with user input,
 * substring count method, and LCS for single word inputs and LCS by word for multi word inputs
 * @param {string} userInput
 * @param {Array} disabilityLabels array of suggested conditions
 * @param {float} threshold default value set to THRESHOLD constant
 * @returns array of suggestions to populate dropdown options
 */

export function fullStringSimilaritySearch(
  userInput,
  disabilityLabels,
  threshold = THRESHOLD,
) {
  const startsWith = disabilityLabels.filter(s =>
    s.toLowerCase().startsWith(userInput.toLowerCase()),
  );
  const substringCountResults = substringSearchCountOverlap(
    userInput,
    disabilityLabels,
  );
  const lcsSingleVsMultiResults = lcsSingleVsMulti(
    userInput,
    disabilityLabels,
    threshold,
  );
  const combinedList = [...substringCountResults, ...lcsSingleVsMultiResults];
  let distinctTerms = [];
  combinedList.forEach(
    x => !distinctTerms.includes(x.original) && distinctTerms.push(x.original),
  );
  distinctTerms = Array.from(new Set([...startsWith, ...distinctTerms]));
  return distinctTerms.slice(0, MAX_OPTIONS);
}

export const exportForTesting = {
  lcsWrapper,
  THRESHOLD,
  stripCommonWords,
  lcsScoreByWordSum,
  countOverlapWords,
  substringSearchCountOverlap,
  lcsSingleVsMulti,
};
