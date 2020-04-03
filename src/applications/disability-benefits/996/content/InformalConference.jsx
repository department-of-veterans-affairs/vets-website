import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export const InformalConferenceDescription = (
  <>
    <p>
      An informal conference is a phone call between you or your accredited
      representative (claims agent, attorney, or Veterans Service Organization)
      and the reviewer to discuss why you think the decision should be changed
      and identify factual erorrs.
    </p>
    <br />
    <p className="vads-u-margin-bottom--3">
      If you request an informal conference, the reviewer will call you or your
      representative. You can request only one informal conference for each
      Higher-Level Review request.
    </p>
  </>
);

export const InformalConferenceChoiceTitle =
  'Would you like to request an informal conference?';

export const informalConferenceLabels = {
  no: 'No, I do not want an informal conference',
  me: 'Yes, call me to schedule an informal conference',
  rep: 'Yes, call my representative',
};

export const ContactRepresentativeDescription = (
  <p>Please provide your representative’s contact information.</p>
);

export const RepresentativeNameTitle = 'Representative’s name';

export const RepresentativePhoneTitle = 'Representative’s phone number';

export const InformalConferenceTimes = ({ isRep }) => (
  <strong>
    First, we’ll call
    {isRep ? ' your representative' : ' you'} to schedule the informal
    conference. Fill in the details below to indicate up to two time periods
    during the day when {isRep ? 'your representative is' : 'you’re'} available
    to receive that initial phone call.
  </strong>
);

export const informalConferenceTimeAllLabels = {
  time0800to1000: '8:00 a.m. to 10:00 a.m. ET',
  time1000to1200: '10:00 a.m. to 12:00 p.m. ET',
  time1230to1400: '12:30 p.m. to 2:00 p.m. ET',
  time1400to1630: '2:00 p.m. to 4:30 p.m. ET',
};

// These labels are hidden on the review page
export const InformalConferenceTimeLabels = key => (
  <span className="time-title" role="presentation">
    {informalConferenceTimeAllLabels[key]}
  </span>
);

export const InformalConferenceAvailability = contact => (
  <span className="time-contact" role="presentation">
    {contact === 'me' ? 'My' : 'Representative’s'} availability for scheduling
  </span>
);

export const AttemptsInfoAlert = ({ isRep }) => {
  const contact = isRep ? 'your representative' : 'you';
  return (
    <AlertBox
      status="info"
      headline={`We’ll make two attempts to contact ${contact}`}
      content={`VA personnel will try to call ${contact} by phone two
        times. If no one answers, we’ll leave a voice mail and a callback
        number. If we are unable to leave a message or get in touch with
        ${contact} after two attempts, we’ll proceed with our review and
        issue a decision.`}
    />
  );
};
