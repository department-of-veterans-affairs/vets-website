import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export const InformalConferenceDescription = (
  <>
    <p>
      You or your accredited representative (claims agent, attorney, or Veterans
      Service Organization) may request an informal conference with the reviewer
      assigned to your Higher-Level Review request.
    </p>
    <br />
    <p>
      If you request an informal conference, the reviewer will call you or your
      representative. During this call you or your representative will have the
      chance to discuss why you think the decision should be changed and
      identify factual errors.
    </p>
    <br />
    <p>
      You can request only one informal conference for each Higher-Level Review
      request.
    </p>
  </>
);

export const InformalConferenceChoiceTitle =
  'Would you like to request an informal conference?';

export const informalConferenceLabels = {
  no: 'No, I do not want an informal conference',
  me: 'Yes, call me',
  rep: 'Yes, call my representative',
};

export const ContactYouDescription = (
  <>
    We will contact you directly to schedule an informal conference with the
    higher-level reviewer assigned to complete the review of your issue.
  </>
);

export const ContactRepresentativeDescription = (
  <>
    We will contact your representative to schedule an informal conference with
    the higher-level reviewer assigned to complete the review of your issue.
    <br />
    <br />
    <p>Please provide your representative’s contact information.</p>
  </>
);

export const RepresentativeNameTitle = 'Representative’s name';

export const RepresentativePhoneTitle = 'Representative’s phone number';

export const InformalConferenceTimes = ({ isRep }) => (
  <p>
    Please choose up to two time periods{' '}
    {isRep ? 'your representative is' : 'you’re'} available to receive a phone
    call.
  </p>
);

export const InformalConferenceTimeLabels = key => {
  const label = {
    time0800to1000: '8:00 a.m. - 10:00 a.m. ET',
    time1000to1200: '10:00 a.m. - 12:00 p.m. ET',
    time1230to1400: '12:30 p.m. - 2:00 p.m. ET',
    time1400to1630: '2:00 p.m. - 4:30 p.m. ET',
  }[key];
  return { 'ui:title': label };
};

export const AttemptsInfoAlert = ({ isRep }) => (
  <AlertBox
    status="info"
    headline={`We’ll make two attempts to call you${
      isRep ? 'r representative' : ''
    }`}
    content={`A senior reviewer will try to call ${
      isRep ? 'your representative' : 'you'
    } by phone twice. If no one answers, we’ll leave a voice mail.`}
  />
);
