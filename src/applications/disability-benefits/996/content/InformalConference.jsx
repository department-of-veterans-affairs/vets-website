import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export const InformalConferenceDescription = (
  <>
    <p>
      An informal conference is a phone call between you or your accredited
      representative (claims agent, attorney, or Veterans Service Organization)
      and the reviewer to discuss why you think the decision should be changed
      and identify factual errors.
    </p>
    <p className="vads-u-margin-bottom--3">
      If you request an informal conference, the reviewer will call you or your
      representative. You can request only one informal conference for each
      Higher-Level Review request.
    </p>
  </>
);

export const InformalConferenceTitle =
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

export const InformalConferenceTimes = ({ isRep }) => {
  const contact = isRep ? ' your representative' : ' you';
  return (
    <strong>
      We’ll call {contact} first to schedule the informal conference. Please
      choose up to two time periods when it’s best to call {contact}.
    </strong>
  );
};

export const informalConferenceTimeAllLabels = {
  time0800to1000: '8:00 a.m. to 10:00 a.m. ET',
  time1000to1230: '10:00 a.m. to 12:30 p.m. ET',
  time1230to1400: '12:30 p.m. to 2:00 p.m. ET',
  time1400to1630: '2:00 p.m. to 4:30 p.m. ET',
};

// These labels are hidden on the review page
export const InformalConferenceTimeLabels = key => (
  <span className="time-title">{informalConferenceTimeAllLabels[key]}</span>
);

export const InformalConferenceAvailability = contact => (
  <span className="time-contact">
    {contact === 'me' ? 'My' : 'Representative’s'} availability for scheduling
  </span>
);

export const AttemptsInfoAlert = ({ isRep }) => {
  const contact = isRep ? 'them' : 'you';
  return (
    <AlertBox
      status="info"
      headline={`We’ll make two attempts to call ${
        isRep ? 'your representative' : 'you'
      }`}
      content={`If no one answers, we’ll leave a voice mail and a number for
       ${contact} to return the call. If we aren’t able to leave a voice mail or
       get in touch with ${contact} after two attempts, we’ll proceed with the
       Higher-Level Review.`}
    />
  );
};
