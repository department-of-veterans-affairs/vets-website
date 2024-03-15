import fastLevenshtein from 'fast-levenshtein';

export default function sortListByFuzzyMatch(value, list, prop = 'label') {
  // console.log('value: ', value);
  // console.log('list: ', list);
  return list
    .map(option => {
      const label = option[prop].toUpperCase().replace(/[^a-zA-Z ]/g, '');
      const val = value.toUpperCase().replace(/[^a-zA-Z ]/g, '');
      // console.log('label: ', label);
      // console.log('val: ', val);
      let score = Infinity;
      if (label.length > 2 && label.includes(val)) {
        score = 0;
      }

      // if the search term is just one word, split the
      // list into words and find the best match
      if (score > 0 && !val.includes(' ')) {
        score = Math.min.apply(
          null,
          label
            .split(/[ ,]/)
            .map(word => fastLevenshtein.get(word, val))
            .filter(wordScore => wordScore < val.length),
        );
      } else if (score > 0) {
        score = fastLevenshtein.get(label, val);
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
