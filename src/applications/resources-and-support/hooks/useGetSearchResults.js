// Node modules.
import { useEffect, useState } from 'react';
import { orderBy } from 'lodash';
// Relative imports.
import recordEvent from 'platform/monitoring/record-event';
import { SEARCH_IGNORE_LIST } from '../constants';

const countKeywordsFound = (searchableString = '', keyword = '') => {
  let keywordsFound = 0;

  // Change the searchable string into a list of words.
  const searchableWords = searchableString.toLowerCase()?.split(' ');

  // Iterate over each word and see if we have any keywords that match it.
  // eslint-disable-next-line no-unused-expressions
  searchableWords?.forEach(word => {
    if (keyword === word) {
      keywordsFound += 1;
    }
  });

  // Return the total number of keywords found.
  return keywordsFound;
};

const countWholePhraseMatchesFound = (searchableString = '', keyword = '') =>
  searchableString.toLowerCase()?.split(keyword.toLowerCase())?.length - 1;

export default function useGetSearchResults(articles, query, page) {
  const [results, setResults] = useState([]);

  // Refresh the results list when the query is submitted or the page is changed.
  useEffect(
    () => {
      if (!articles || !query) {
        return;
      }

      // Begin filtering logic.
      // =====
      const keywords = query
        .split(' ')
        .filter(word => !!word)
        .map(keyword => keyword.toLowerCase())
        .filter(word => !SEARCH_IGNORE_LIST.includes(word))
        .map(keyword => {
          if (keyword.length > 6 && keyword.endsWith('ies')) {
            // Unpluralize the word, so that a search for "disabilities"
            // will still yield articles titled "disability"
            return keyword.slice(0, keyword.length - 3);
          } else if (keyword.length > 3 && keyword.endsWith('s')) {
            // Unpluralize the word, so that a search for "claims"
            // will still yield articles titled "claim or appeal status"
            return keyword.slice(0, keyword.length - 1);
          }
          return keyword;
        });

      let filteredArticles = articles.filter(article => {
        const articleTitleWords = article.title.toLowerCase().split(' ');

        return keywords.some(keyword => {
          return articleTitleWords.some(titleWord =>
            titleWord.startsWith(keyword),
          );
        });
      });
      // =====
      // End of filtering logic.

      // Begin ordering logic.
      // =====
      let orderedResults = [];

      filteredArticles = filteredArticles?.map(article => {
        // Derive keywords counts.
        const keywordsCountsTitle = keywords?.reduce(
          (keywordInstances, keyword) =>
            keywordInstances + countKeywordsFound(article.title, keyword),
          0,
        );
        const keywordsCountsIntroText = keywords?.reduce(
          (keywordInstances, keyword) =>
            keywordInstances + countKeywordsFound(article.introText, keyword),
          0,
        );
        const keywordsCountsContent = keywords?.reduce(
          (keywordInstances, keyword) =>
            keywordInstances +
            countKeywordsFound(article.searchableContent, keyword),
          0,
        );

        // Derive whole phrase match counts.
        const wholePhraseMatchCountsTitle = countWholePhraseMatchesFound(
          article.title,
          query,
        );
        const wholePhraseMatchCountsIntroText = countWholePhraseMatchesFound(
          article.introText,
          query,
        );
        const wholePhraseMatchCountsContent = countWholePhraseMatchesFound(
          article.searchableContent,
          query,
        );

        return {
          ...article,

          // Number of times a keyword is found in the article's title.
          keywordsCountsTitle,

          // Number of times a keyword is found in the article's introText.
          keywordsCountsIntroText,

          // Number of times a keyword is found in the article's searchableContent.
          keywordsCountsContent,

          // Number of times a keyword is found in both the article's introText and searchableContent.
          keywordsCountsIntroTextAndContent:
            keywordsCountsIntroText + keywordsCountsContent,

          // Number of times the full query is found in the article's title.
          wholePhraseMatchCountsTitle,

          // Number of times the full query is found in the article's introText.
          wholePhraseMatchCountsIntroText,

          // Number of times the full query is found in the article's searchableContent.
          wholePhraseMatchCountsContent,

          // Number of times the full query is found in the article's title, introText, searchableContent combined.
          wholePhraseMatchCountsTotal:
            wholePhraseMatchCountsTitle +
            wholePhraseMatchCountsIntroText +
            wholePhraseMatchCountsContent,
        };
      });

      // Sort first by the number of exact query matches (ignoring casing) in the title, introText, and searchableContent descending
      // Sort ties by query word instances found in title descending
      // Sort ties then by query word instances found in introText and searchableContent descending
      // Sort ties then by alphabetical descending
      orderedResults = orderBy(
        filteredArticles,
        [
          'wholePhraseMatchCountsTotal',
          'keywordsCountsTitle',
          'keywordsCountsIntroTextAndContent',
          'title',
        ],
        ['desc', 'desc', 'desc', 'asc'],
      );
      // =====
      // End of ordering logic.

      // Track R&S search results.
      recordEvent({
        event: 'view_search_results',
        'search-page-path': document.location.pathname,
        'search-query': query,
        'search-results-total-count': orderedResults.length,
        'search-results-total-pages': Math.ceil(orderedResults.length / 10),
        'search-selection': 'Resources and support',
        'search-typeahead-enabled': false,
        'search-location': 'Resources And Support',
        'sitewide-search-app-used': false, // this is not the sitewide search app
        'type-ahead-option-keyword-selected': undefined,
        'type-ahead-option-position': undefined,
        'type-ahead-options-list': undefined,
        'type-ahead-options-count': undefined,
      });

      setResults(orderedResults);
    },
    [articles, setResults, query, page],
  );

  return [results];
}
