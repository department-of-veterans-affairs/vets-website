import React, { useEffect, useState } from 'react';
import * as Sentry from '@sentry/browser';
import SearchFilter from '../components/SearchFilter';

const baseUrl = document.location.origin;

export default function App() {
  const [allOffices, setAllOffices] = useState([]);

  useEffect(() => {
    const getJson = async () => {
      try {
        // This is injected here: src/site/stages/build/plugins/create-office-directory-data.js
        const response = await fetch(
          `${baseUrl}/office-directory/offices.json`,
        );
        const json = await response.json();
        setAllOffices(json);
      } catch (error) {
        Sentry.withScope(scope => {
          scope.setExtra('error', error);
          Sentry.captureMessage('Office Directory - failed to load dataset');
        });
      }
    };

    getJson();
  }, []);

  return (
    <div className="vads-l-grid-container vads-u-padding-x--1p5 vads-u-padding-bottom--4">
      <h1 className="vads-u-margin-bottom--0">All VA offices</h1>

      <SearchFilter offices={allOffices} />

      <va-back-to-top />
    </div>
  );
}
