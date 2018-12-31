import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';

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
    <p>
      Please tell us when this event happened. If the event happened over a
      period of time, please tell us around when it started.
    </p>
    {eventHelpText}
  </div>
);

export const SecondaryDateDescription = ({ index }) => {
  const isFirstIncident = index === 0;
  return (
    <div>
      <h5>Event date</h5>
      {isFirstIncident && (
        <p>
          Now we’ll ask about the first event that caused your PTSD. If there is
          more than one event or situation you want to tell us about, we’ll ask
          questions about each one separately.
        </p>
      )}
      <p>
        Please tell us when this event or situation happened. If it happened
        over a period of time, please tell us around when it started. (If you’re
        having trouble remembering the exact date you can provide a month and
        year. You’ll have a chance to provide more information later.)
      </p>
      {eventHelpText}
    </div>
  );
};
