import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export const InformalConferenceDescription = (
  <>
    <p>
      You or your accredited representative (claims agent, attorney, or Veterans
      Service Organization) can request an informal conference with the reviewer
      assigned to your Higher-Level Review. During this conference you or your
      representative will have the chance to discuss why you think the decision
      should be changed and identify factual errors.
    </p>
    <p className="vads-u-margin-bottom--3">
      If you request an informal conference, the reviewer will call you or your
      representative. You can request only one informal conference for your
      Higher-Level Review.
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

// Using CSS to use article[data-contact-choice] attribute to set visibility
const contacts = (
  <>
    <span className="contact-choice selected-rep">your representative</span>
    <span className="contact-choice selected-me">you</span>
  </>
);
export const InformalConferenceTimes = (
  <>
    <strong>We’ll call {contacts} to schedule an informal conference.</strong>
    <p>Please provide 1 or 2 preferred times for a call.</p>
  </>
);

export const informalConferenceTimeTitles = {
  first: <>Choose the best time for us to call {contacts}</>,
  second: 'Choose another time for us to call',
};

export const informalConferenceTimeAllLabels = {
  time0800to1000: '8:00 a.m. to 10:00 a.m. ET',
  time1000to1230: '10:00 a.m. to 12:30 p.m. ET',
  time1230to1400: '12:30 p.m. to 2:00 p.m. ET',
  time1400to1630: '2:00 p.m. to 4:30 p.m. ET',
};

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
      headline={`We’ll call ${isRep ? 'your representative' : 'you'} 2 times`}
      content={`Each time we call, we’ll leave a voice mail and a number for
      ${contact} to return the call. If we aren’t able to get in touch with
      ${contact} after 2 attempts, we’ll proceed with the Higher-Level Review.`}
    />
  );
};
