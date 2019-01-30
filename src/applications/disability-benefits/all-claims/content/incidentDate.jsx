import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

const eventHelpText = (
  <AdditionalInfo triggerText="What if I can’t remember the date?">
    <p>
      Providing an estimated date within a couple of months of the event will
      help us research your claim.
    </p>
    <p>
      If you’re having trouble remembering the exact date, try remembering the
      time of year or whether the event happened early or late in your military
      service.
    </p>
  </AdditionalInfo>
);

export const ptsdDateDescription = (
  <div>
    <h5>Estimated event date</h5>
    <p>
      Please tell us when this event or situation happened. If it happened over
      a period of time, please tell us when it started.
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
