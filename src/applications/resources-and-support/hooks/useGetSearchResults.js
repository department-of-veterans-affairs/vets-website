// Node modules.
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
// Relative imports.
import recordEvent from 'platform/monitoring/record-event';

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
        .map(keyword => keyword.toLowerCase())
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

      const filteredArticles = articles.filter(article => {
        const articleTitleKeywords = article.title.toLowerCase().split(' ');

        return keywords.some(keyword => {
          return articleTitleKeywords.some(titleWord =>
            titleWord.startsWith(keyword),
          );
        });
      });

      const orderedResults = sortBy(filteredArticles, 'title');

      // Track the ordered results.
      recordEvent({
        event: 'view_search_results',
        'search-text-input': query,
        'search-selection': 'Resources and support',
        'search-results-total-count': orderedResults.length,
        'search-results-total-pages': Math.ceil(orderedResults.length / 10),
      });

      setResults(orderedResults);
    },
    [articles, setResults, query, page],
  );

  return [results];
}
