let GLOBAL_TOGGLE_STRIP_COMMON_WORDS = false;
var splitreg = /[\s-,\(\)]+/;


function nodeLcs(str1, str2) {
    if (!str1 || !str2) {
        return {
            length: 0,
            sequence: '',
            offset: 0
        }
    }

    var sequence = ''
    var str1Length = str1.length
    var str2Length = str2.length
    var num = new Array(str1Length)
    var maxlen = 0
    var lastSubsBegin = 0

    for (var i = 0; i < str1Length; i++) {
        var subArray = new Array(str2Length)
        for (var j = 0; j < str2Length; j++) { subArray[j] = 0 }
        num[i] = subArray
    }
    var thisSubsBegin = null
    for (i = 0; i < str1Length; i++) {
        for (j = 0; j < str2Length; j++) {
            if (str1[i] !== str2[j]) { num[i][j] = 0 } else {
                if ((i === 0) || (j === 0)) { num[i][j] = 1 } else { num[i][j] = 1 + num[i - 1][j - 1] }

                if (num[i][j] > maxlen) {
                    maxlen = num[i][j]
                    thisSubsBegin = i - num[i][j] + 1
                    if (lastSubsBegin === thisSubsBegin) { // if the current LCS is the same as the last time this block ran
                        sequence += str1[i]
                    } else { // this block resets the string builder if a different LCS is found
                        lastSubsBegin = thisSubsBegin
                        sequence = '' // clear it
                        sequence += str1.substr(lastSubsBegin, (i + 1) - lastSubsBegin)
                    }
                }
            }
        }
    }
    return {
        length: maxlen,
        sequence: sequence,
        offset: thisSubsBegin
    }
}

function lcsSingleVsMulti(input, list, threshold) {
    var results = list
        .map((option) => {
            let label = option.toUpperCase()
            //.replace(/[^a-zA-Z ]/g, "");
            let val = input.toUpperCase().replace(/[^a-zA-Z ]/g, "");
            //let score = label.includes(val) ? 0 : Infinity;
            let score
            if (isOneWord(val)) {
                score = nodeLcs(val, label).length
                if (GLOBAL_TOGGLE_STRIP_COMMON_WORDS) {
                    score = nodeLcs(stripCommonWords(val), stripCommonWords(label)).length
                }
            } else {
                score = lcsScoreByWordSum(val, label)
                if (GLOBAL_TOGGLE_STRIP_COMMON_WORDS) {
                    score = lcsScoreByWordSum(stripCommonWords(val), stripCommonWords(label));
                }
            }
            return {
                score,
                original: option
            };
        }).filter(a => a.score / input.length >= threshold)
        .sort((a, b) => {
            return b.score - a.score;
            // if (result === 0) {
            //   return a.original.length - b.original.length;
            // }
        })
        //.map((sorted) => sorted.original)
        .slice(0, 20);
    return results
    //var base_conditions = findBaseConditions(results, arrWords)
    //return createSortedList(base_conditions, results)
}

function lcsScoreByWordSum(inputWord, disabilityWord) {
    let tempScoreList = []
    let splitInput = inputWord.split(splitreg)
    let disWordSplit = disabilityWord.split(splitreg)
    for (let subWord in splitInput) {
        disWordSplit.forEach(t => (nodeLcs(t, splitInput[subWord]).length >= 3 ? tempScoreList.push(nodeLcs(t, splitInput[subWord]).length) : null))
    }
    let score = tempScoreList.reduce((acc, current) => acc + current, 0)
    return score
}

function isOneWord(inputWord) {
    return inputWord.split(splitreg).length < 2
}

function countOverlapWords(input, dropdownTerm) {
    let splitInput = input.split(splitreg)
    let splitOption = dropdownTerm.split(splitreg)
    let countOverlap = 0
    let tempOverlapList = []
    for (let word in splitInput) {
        for (let term in splitOption) {
            if (splitOption[term].includes(splitInput[word])) {
                tempOverlapList.push(splitInput[word])
            }
        }
    };
    let tempUniqueList = Array.from(new Set(tempOverlapList))
    countOverlap = tempUniqueList.length
    return countOverlap
}

function substringSearchCountOverlap(input, list) {
    let scoreFilter = input.toUpperCase().replace(/[^a-zA-Z ]/g, "").split(splitreg).length;
    var results = list
        .map((option) => {
            let label = option.toUpperCase().replace(/[^a-zA-Z ]/g, "");
            let val = input.toUpperCase().replace(/[^a-zA-Z ]/g, "");
            //let score = label.includes(val) ? 0 : Infinity;
            let score = countOverlapWords(val, label)
            if (GLOBAL_TOGGLE_STRIP_COMMON_WORDS) {
                score = countOverlapWords(stripCommonWords(val), stripCommonWords(label));
            }
            return {
                score,
                original: option
            };
        }).filter(a => a.score >= scoreFilter)
        .sort((a, b) => {
            return b.score - a.score;
            // if (result === 0) {
            //   return a.original.length - b.original.length;
            // }
        })
        //.map((a) => a.original)
        .slice(0, 20);
    //var base_conditions = findBaseConditions(results, arrWords)
    //return createSortedList(base_conditions, results)
    return results
}

export function substringCountLCS(input, list, threshold) {
    let substringCountResults = substringSearchCountOverlap(input, list)
    let lcsSingleVsMultiResults = lcsSingleVsMulti(input, list, threshold)
    // let combinedList = [...substringCountResults, {original: '***lcs starting***'}, ...lcsSingleVsMultiResults]
    let combinedList = [...substringCountResults, ...lcsSingleVsMultiResults]
    let distinctTerms = []
    combinedList.forEach(x => !distinctTerms.includes(x.original) && distinctTerms.push(x.original))
    console.log('searching')
    console.log('distinctTerms: ', distinctTerms);
    return distinctTerms
}
const COMMON_WORDS = [
    'left',
    'right',
    'bilateral',
    'in',
    'of',
    'or',
    'the',
    'my'
];

function stripCommonWords(inputStr) {
    let regMatch = new RegExp('\\b(' + COMMON_WORDS.join('|') + ')\\b', 'gi')
    let ret = inputStr.replace(regMatch, '').replace(/\s+/g, ' ').trim()
    return ret
}
