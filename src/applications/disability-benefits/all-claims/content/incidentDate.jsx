import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';

export const ptsdDateDescription = (
  <div>
    <h5>Event date</h5>
    <p>
      When did the event happen? (Please note, this date doesn’t have to be
      exact, but it’ll help with our research if you can provide a date within a
      2-month range of the event. If you can’t remember the exact date, we
      suggest you try to recall the time of year or a holiday that happened
      around the time of the event.)
    </p>
    <p>
      If the event happened over an extended period of time, provide the
      approximate date the event started. You will have an opportunity to
      provide more information later.
    </p>
    <AdditionalInfo triggerText="Suggestions for remembering a date">
      <p>
        If you’re having trouble remembering the date of the event you can try
        remembering the time of year — was it cold or hot? — or whether the
        event happened early or late in your military service, or if there was a
        particular landmark you remember.{' '}
      </p>
      <p>
        Providing a date within 60 days of the event will help us better
        research your claim. If all you can remember is the month and year, then
        just put that.
      </p>
    </AdditionalInfo>
  </div>
);
