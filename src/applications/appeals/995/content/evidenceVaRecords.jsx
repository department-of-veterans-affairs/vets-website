import React from 'react';

import { formatDateRange } from '../utils/dates';

export const content = {
  page:
    'First we’ll ask you about your VA medical records for your claimed disability.',
  intro: (
    <>
      <h3>VA medical records</h3>
      <p>Please tell us which VA treated you for your disability.</p>
    </>
  ),
  locations: 'Locations',
  locationAndName:
    'Name of VA medical center, VA treatment facility, or Federal department or agency',
  dates: 'Date(s) of record',
  dateStart: 'Start date',
  dateEnd: 'End date',
};

export const locationView = props => {
  const { formData } = props;
  const { locationAndName, evidenceDates } = formData;
  const name = locationAndName || 'Unknown location';
  const dates =
    evidenceDates?.map(dateRange => {
      const range = formatDateRange(dateRange);
      return range ? <li key={range}>{range}</li> : null;
    }) || null;

  return (
    <div key={`${name}`}>
      <h3 className="vads-u-font-size--h5 vads-u-margin-top--0">{name}</h3>
      <ul>{dates}</ul>
    </div>
  );
};

export const datesView = ({ formData }) => formatDateRange(formData);
