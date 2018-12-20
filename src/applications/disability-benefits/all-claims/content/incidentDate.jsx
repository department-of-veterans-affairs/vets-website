import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';

import { getPtsdClassification } from './ptsdClassification';

const sharedDescription = (
  <p>
    Please tell us when this event happened. If the event happened over a period
    of time, please tell us around when the event started.
  </p>
);

const eventHelpText = (
  <AdditionalInfo triggerText="What if I can’t remember the date?">
    <p>
      If you’re having trouble remembering the exact date try remembering the
      time of year or whether the event happened early or late in your military
      service.
    </p>
    <p>
      Providing a date within 60 days of the event will help us better research
      your claim.
    </p>
  </AdditionalInfo>
);

export const ptsdDateDescription = (
  <div>
    <h5>Approximate event date</h5>
    {sharedDescription}
    {eventHelpText}
  </div>
);

export const SecondaryDateDescription = ({ formData, index }) => {
  const { incidentText } = getPtsdClassification(formData, '781a');
  const isFirstIncident = index === 0;
  return (
    <div>
      <h5>Event date</h5>
      {isFirstIncident && (
        <p>
          Now we’ll ask about the first event that caused your {incidentText}.
          If there is more than one event or situation you want to tell us
          about, we’ll ask questions about each one separately.
        </p>
      )}
      {sharedDescription}
      {eventHelpText}
    </div>
  );
};
