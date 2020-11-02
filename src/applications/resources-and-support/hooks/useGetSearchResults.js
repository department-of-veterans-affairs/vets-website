import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';

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
          if (keyword.length > 3 && keyword.endsWith('s')) {
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

      setResults(orderedResults);
    },
    [articles, setResults, query, page],
  );

  return [results];
}
