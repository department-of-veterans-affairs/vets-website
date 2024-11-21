import { useEffect, useState } from 'react';
import { orderBy } from 'lodash';
import recordEvent from 'platform/monitoring/record-event';
import { SEARCH_IGNORE_LIST } from '../constants';

export const countKeywordsFound = (searchableString = '', keyword = '') => {
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

export const countWholePhraseMatchesFound = (
  searchableString = '',
  keyword = '',
) => searchableString.toLowerCase()?.split(keyword.toLowerCase())?.length - 1;

export const createKeywordsArray = query => {
  return query
    .split(' ')
    .filter(word => !!word)
    .map(keyword => keyword.toLowerCase())
    .filter(word => !SEARCH_IGNORE_LIST.includes(word))
    .map(keyword => {
      if (keyword.length > 6 && keyword.endsWith('ies')) {
        // Unpluralize the word, so that a search for "disabilities"
        // will still yield articles titled "disability"
        return keyword.slice(0, keyword.length - 3);
      }
      if (keyword.length > 3 && keyword.endsWith('s')) {
        // Unpluralize the word, so that a search for "claims"
        // will still yield articles titled "claim or appeal status"
        return keyword.slice(0, keyword.length - 1);
      }
      return keyword;
    });
};

export const filterArticles = (articles, keywords) => {
  return articles.filter(article => {
    const articleTitleWords = article.title.toLowerCase().split(' ');

    return keywords.some(keyword => {
      return articleTitleWords.some(titleWord => titleWord.startsWith(keyword));
    });
  });
};

export const getKeywordCounts = (keywords, article) => {
  // Number of times a keyword is found in the article's title.
  const keywordsCountsTitle = keywords?.reduce(
    (keywordInstances, keyword) =>
      keywordInstances + countKeywordsFound(article.title, keyword),
    0,
  );

  // Number of times a keyword is found in the article's introText.
  const keywordsCountsIntroText = keywords?.reduce(
    (keywordInstances, keyword) =>
      keywordInstances + countKeywordsFound(article.introText, keyword),
    0,
  );

  // Number of times a keyword is found in the article's searchableContent.
  const keywordsCountsContent = keywords?.reduce(
    (keywordInstances, keyword) =>
      keywordInstances + countKeywordsFound(article.searchableContent, keyword),
    0,
  );

  return {
    keywordsCountsTitle,
    keywordsCountsIntroText,
    keywordsCountsContent,

    // Number of times a keyword is found in both the article's introText and searchableContent.
    keywordsCountsIntroTextAndContent:
      keywordsCountsIntroText + keywordsCountsContent,
  };
};

export const getWholePhraseMatches = (query, article) => {
  // Number of times the full query is found in the article's title.
  const wholePhraseMatchCountsTitle = countWholePhraseMatchesFound(
    article.title,
    query,
  );

  // Number of times the full query is found in the article's introText.
  const wholePhraseMatchCountsIntroText = countWholePhraseMatchesFound(
    article.introText,
    query,
  );

  // Number of times the full query is found in the article's searchableContent.
  const wholePhraseMatchCountsContent = countWholePhraseMatchesFound(
    article.searchableContent,
    query,
  );

  return {
    wholePhraseMatchCountsTitle,
    wholePhraseMatchCountsIntroText,
    wholePhraseMatchCountsContent,

    // Number of times the full query is found in the article's title, introText, searchableContent combined.
    wholePhraseMatchCountsTotal:
      wholePhraseMatchCountsTitle +
      wholePhraseMatchCountsIntroText +
      wholePhraseMatchCountsContent,
  };
};

export const getOrderedResults = filteredArticles => {
  // Sort first by the number of exact query matches (ignoring casing) in the title, introText, and searchableContent descending
  // Sort ties by query word instances found in title descending
  // Sort ties then by query word instances found in introText and searchableContent descending
  // Sort ties then by alphabetical descending
  return orderBy(
    filteredArticles,
    [
      'wholePhraseMatchCountsTotal',
      'keywordsCountsTitle',
      'keywordsCountsIntroTextAndContent',
      'title',
    ],
    ['desc', 'desc', 'desc', 'asc'],
  );
};

export const createOrderedResults = (articles, query) => {
  const keywords = createKeywordsArray(query);
  let filteredArticles = filterArticles(articles, keywords);

  filteredArticles = filteredArticles?.map(article => {
    const keywordCounts = getKeywordCounts(keywords, article);
    const wholePhraseMatches = getWholePhraseMatches(query, article);

    return {
      ...article,
      ...keywordCounts,
      ...wholePhraseMatches,
    };
  });

  return getOrderedResults(filteredArticles);
};

export default function useGetSearchResults(articles, query, page) {
  const [results, setResults] = useState([]);

  // Refresh the results list when the query is submitted or the page is changed.
  useEffect(
    () => {
      if (!articles || !query) {
        return;
      }

      const orderedResults = createOrderedResults(articles, query);

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
