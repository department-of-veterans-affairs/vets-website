// Node modules.
import { useEffect, useState } from 'react';
import { orderBy } from 'lodash';
// Relative imports.
import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';
import { SEARCH_IGNORE_LIST } from '../constants';

export default function useGetSearchResults(articles, query, page) {
  const [results, setResults] = useState([]);

  // Refresh the results list when the query is submitted or the page is changed.
  useEffect(
    () => {
      if (!articles || !query) {
        return;
      }

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
        const articleTitleKeywords = article.title.toLowerCase().split(' ');

        return keywords.some(keyword => {
          return articleTitleKeywords.some(titleWord =>
            titleWord.startsWith(keyword),
          );
        });
      });

      let orderedResults = [];

      // Keep legacy sorting on production.
      if (environment.isProduction()) {
        orderedResults = orderBy(filteredArticles, 'title');

        // Experiment with new sorting on non-prod envs.
      } else {
        filteredArticles = filteredArticles?.map(article => ({
          ...article,

          // Number of times a keyword is found in the article's title.
          keywordsCountsTitle: keywords?.reduce(
            (keywordInstances, keyword) =>
              keywordInstances +
              article.title.toLowerCase()?.split(keyword)?.length -
              1,
            0,
          ),

          // Number of times a keyword is found in the article's description.
          keywordsCountsDescription: keywords?.reduce(
            (keywordInstances, keyword) =>
              keywordInstances +
              article.description.toLowerCase()?.split(keyword)?.length -
              1,
            0,
          ),
        }));

        // Sort first by query word instances found in title descending
        // Sort ties then by query word instances found in description descending
        // Sort ties then by alphabetical descending
        orderedResults = orderBy(
          filteredArticles,
          ['keywordsCountsTitle', 'keywordsCountsDescription', 'title'],
          ['desc', 'desc', 'asc'],
        );
      }

      // Track R&S search results.
      recordEvent({
        event: 'view_search_results',
        'search-page-path': document.location.pathname,
        'search-query': query,
        'search-results-total-count': orderedResults.length,
        'search-results-total-pages': Math.ceil(orderedResults.length / 10),
        'search-selection': 'Resources and support',
        'search-typeahead-enabled': false,
        'type-ahead-option-keyword-selected': undefined,
        'type-ahead-option-position': undefined,
        'type-ahead-options-list': undefined,
      });

      setResults(orderedResults);
    },
    [articles, setResults, query, page],
  );

  return [results];
}
