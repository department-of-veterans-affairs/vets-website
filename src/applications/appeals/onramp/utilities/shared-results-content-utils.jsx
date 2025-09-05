/**
 * Content is defined with SNAKE_CASE prefixes by type, e.g.:
 * TITLE_SC = The title for the SC card
 * CARD_CONTENT_GF_SC = An array of possible content items for the SC card
 * CARD_REVIEW_SC = A bulleted item for the SC card
 * PAGE_CONTENT_RESULTS_1_2C = An array of possible content items for the Results 1.2C page
 *
 * Once it is determined that something should be displayed (ex. CARD_SC),
 * we can swap the prefix to get the matching content to evaluate for display.
 * @param {String} string - The string to swap prefixes with (e.g. CARD_SC)
 * @param {String} from - The prefix to swap from (e.g. CARD)
 * @param {String} to - The Prefix to swap to (e.g. TITLE)
 * @returns {String}
 */
export const swapPrefix = (string, from, to, keepUnderscore = true) => {
  if (!string.includes(from)) return '';

  if (!keepUnderscore) {
    return string.replace(`${from}_`, to);
  }

  return string.replace(from, to);
};

// export const getResultsDynamicContent = (page, formResponses) => {
// const
// };
