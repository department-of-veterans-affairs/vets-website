import React, { useEffect, useState, useCallback } from 'react';
import * as Sentry from '@sentry/browser';

const topOffices = [
  '44932',
  '44795',
  '45123',
  '45065',
  '45394',
  '45022',
  '44827',
  '45180',
  '45008',
  '45262',
  '45067',
  '45215',
  '45043',
  '45032',
  '45037',
  '44903',
  '44845',
  '45130',
];

const baseUrl = document.location.origin;

export default function App() {
  const [allOffices, setAllOffices] = useState([]);
  const [displayOffices, setDisplayOffices] = useState([]);
  const [filterTopOffices, setFilterTopOffices] = useState(false);

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

  useEffect(
    () => {
      if (filterTopOffices) {
        setDisplayOffices(
          allOffices.filter(office => topOffices.includes(office.entityId)),
        );
      } else {
        setDisplayOffices(allOffices);
      }
    },
    [allOffices, filterTopOffices],
  );

  const toggleFilterTopOffices = useCallback(() => {
    setFilterTopOffices(prevValue => !prevValue);
  }, []);

  return (
    <div className="vads-l-grid-container vads-u-padding-x--1p5 vads-u-padding-bottom--4">
      <h1 className="vads-u-margin-bottom--0">All VA offices</h1>

      <input
        type="checkbox"
        id="filter-top-offices"
        name="filter-top-offices"
        checked={filterTopOffices}
        onChange={toggleFilterTopOffices}
      />
      <label htmlFor="filter-top-offices">Filter: Top Offices</label>

      <ul>
        {displayOffices.map(office => (
          <li key={office.entityId}>{office.title}</li>
        ))}
      </ul>
    </div>
  );
}
