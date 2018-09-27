import React from 'react';
import {
  ptsdNameTitle,
} from '../helpers';
// import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';

const ptsdDateDescription = () => {
  return (
    <div>
      <h5>Incident details</h5>
      <p>
        Now we'll ask about the even or events that caused your $PTSDclassification PTSD. If there is more than one even you want to tell us about, we'll ask questions about each event separately.
      </p>
      <p>
        When did the first event happen? Please note, this date doesn't have to be exact, but it'll help with our research if you provide a date within a 2-month range.
      </p>
      <p>
        If you can't remember the exact date, we suggest you try to recall the time of year or a holiday that happened around the time of the event.
      </p>
    </div>
  );
};


export const uiSchema = {
  'ui:title': ptsdNameTitle,
  'view:ptsdIncidentDate': {
    'ui:description': ptsdDateDescription,
    'ui:title': ptsdDateDescription,
    'ui:widget': 'date',
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:ptsdIncidentDate': {
      type: 'string'
    },
  }
};
