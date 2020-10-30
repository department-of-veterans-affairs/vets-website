import { useEffect, useState } from 'react';
import * as Sentry from '@sentry/browser';

export default function useArticleData() {
  const [articles, setArticles] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(
    () => {
      const getJson = async () => {
        try {
          const response = await fetch('/resources/search/articles.json');
          const json = await response.json();

          setArticles(json);
        } catch (error) {
          Sentry.withScope(scope => {
            scope.setExtra('error', error);
            Sentry.captureMessage(
              'Resources and support - failed to load dataset',
            );
          });
          setErrorMessage(
            'We’re sorry. Something went wrong on our end. Please try again later.',
          );
        }
      };

      getJson();
    },
    [setArticles, setErrorMessage],
  );

  return [articles, errorMessage];
}
