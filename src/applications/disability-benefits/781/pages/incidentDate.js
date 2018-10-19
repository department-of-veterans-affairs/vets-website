import React from 'react';
import { PtsdNameTitle } from '../helpers';

import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';

const ptsdDateDescription = () => (
  <div>
    <h5>Event date</h5>
    <p>
      When did the first event happen? Please note, this date doesn’t have to be
      exact, but it’ll help with our research if you provide a date within a
      2-month range.{' '}
    </p>
    <p>
      If you can’t remember the exact date, we suggest you try to recall the
      time of year or a holiday that happened around the time of the event.
    </p>
    <AdditionalInfo triggerText="More suggestions">
      <p>
        Identifying the date of the incident within a 60-day window helps us
        better research your claim. Some other ways to place the date range are
        to recall what the weather was like when the event happened – warm or
        cold – to identify the season, or to identify whether it was early or
        later in your deployment or perhaps think of a landmark or place you
        were during a particular time.
      </p>
    </AdditionalInfo>
    <br />
  </div>
);

export const uiSchema = {
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781" />
  ),
  'ui:description': ptsdDateDescription,
  ptsdPrimaryIncidentDate: {
    'ui:title': ' ',
    'ui:widget': 'date',
    'ui:errorMessages': {
      pattern: 'Please enter 4 digit year.',
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    ptsdPrimaryIncidentDate: {
      type: 'string',
      pattern: '^(.{1,10})$',
    },
    'view:ptsdDatePrimaryDescription': {
      type: 'object',
      properties: {},
    },
  },
};
