import { useEffect, useState } from 'react';
import * as Sentry from '@sentry/browser';

// We use CMS demo environments to publish articles in bulk.
// This means that at this time, we can't use the environment.BASE_URL,
// because the CMS demo env uses domains not defined there, and we need
// this search app to align with the demo.
const baseUrl = document.location.origin;

export default function useArticleData() {
  const [articles, setArticles] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const getJson = async () => {
      try {
        // This is injected here: src/site/stages/build/plugins/create-resources-and-support-section.js
        const response = await fetch(
          `${baseUrl}/resources/search/articles.json`,
        );
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
  }, [setArticles, setErrorMessage]);

  return [articles, errorMessage];
}
