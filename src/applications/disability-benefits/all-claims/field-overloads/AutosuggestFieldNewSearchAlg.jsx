import AutosuggestField from '../../../../platform/forms-system/src/js/fields/AutosuggestField';

function newSearchAlg(s1, s2) {
  console.log('unimplemented');
  // Javascript function to calculate optimal string alignment distance
  // from https://www.geeksforgeeks.org/levenshtein-distance-and-edit-distance-in-python/

  // Create a table to store the results of subproblems
  const dp = new Array(s1.length + 1)
    .fill(0)
    .map(() => new Array(s2.length + 1).fill(0));

  // Initialize the table
  for (let i = 0; i <= s1.length; i++) {
    dp[i][0] = i;
  }
  for (let j = 0; j <= s2.length; j++) {
    dp[0][j] = j;
  }

  // Populate the table using dynamic programming
  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  // Return the edit distance
  return dp[s1.length][s2.length];
}

function sortListByNewSearchAlg(value, options) {
  const prop = 'label';
  return options
    .map(option => {
      const label = option[prop].toUpperCase().replace(/[^a-zA-Z ]/g, '');
      const val = value.toUpperCase().replace(/[^a-zA-Z ]/g, '');
      let score = label.includes(val) ? 0 : Infinity;

      // if the search term is just one word, split the
      // list into words and find the best match
      if (score > 0 && !val.includes(' ')) {
        score = Math.min.apply(
          null,
          label
            .split(/[ ,]/)
            .map(word => newSearchAlg.get(word, val))
            .filter(wordScore => wordScore < val.length),
        );
      } else if (score > 0) {
        score = newSearchAlg.get(label, val);
      }

      return {
        score,
        original: option,
      };
    })
    .sort((a, b) => {
      const result = a.score - b.score;

      if (result === 0) {
        return a.original[prop].length - b.original[prop].length;
      }

      return result;
    })
    .map(sorted => sorted.original);
}

export default class AutosuggestFieldNewSearchAlg extends AutosuggestField {
  getSuggestions = (options, value) => {
    if (value) {
      const uiOptions = this.props.uiSchema['ui:options'];
      console.log('sorting list by fuzzy match for value: ', value);
      return sortListByNewSearchAlg(value, options).slice(
        0,
        uiOptions.maxOptions,
      );
    }

    return options;
  };
}
