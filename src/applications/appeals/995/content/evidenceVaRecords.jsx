// import React from 'react';

// import { formatDateRange } from '../utils/dates';

export const content = {
  title: 'Which VA facility treated you?',
  description: 'We’ll request your VA medical records from this facility',
  locationAndName:
    'Name of VA medical center, VA treatment facility, or Federal department or agency',
  conditions:
    'Choose the conditions you received treatment for at this facility',
  dateStart: 'First treatment date (you can estimate)',
  dateEnd: 'Last treatment date (you can estimate)',
  addAnother: 'Add another location',
  modalTitle: 'Do you want to keep this location?',
  modalDescription: ' Your current information has been auto-saved.',
  modalYes: 'Yes',
  modalNo: 'No, remove this location',
};

/*
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
*/
