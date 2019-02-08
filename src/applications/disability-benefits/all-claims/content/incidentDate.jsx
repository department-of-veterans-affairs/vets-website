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
      Please tell us when this event happened. If it happened over a period of
      time, please tell us when it started.
    </p>
    {eventHelpText}
  </div>
);
