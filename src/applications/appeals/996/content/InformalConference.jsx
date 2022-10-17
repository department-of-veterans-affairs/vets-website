import React from 'react';

export const InformalConferenceDescription = (
  <>
    <p>
      An informal conference is a phone call between you or your accredited
      representative (claims agent, attorney, or Veterans Service Organization)
      and the reviewer to discuss why you think the decision should be changed
      and identify factual errors.
    </p>
    <p id="choose-conference-notice" className="vads-u-margin-bottom--3">
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

export const ContactRepresentativeTitle =
  'Provide your representative’s contact information.';

export const RepresentativeNameTitle = 'Representative’s name';
export const RepresentativeFirstNameTitle = 'Representative’s first name';
export const RepresentativeLastNameTitle = 'Representative’s last name';

export const RepresentativePhoneTitle = 'Representative’s phone number';
export const RepresentativePhoneExtensionTitle =
  'Representative’s phone extension';

export const RepresentativeEmailTitle = 'Representative’s email address';

// Using CSS to use article[data-contact-choice] attribute to set visibility
const contacts = (
  <>
    <span className="contact-choice selected-rep">your representative</span>
    <span className="contact-choice selected-me">you</span>
  </>
);

export const InformalConferenceTimesTitle = (
  <>
    <span className="contact-choice selected-rep vads-u-font-size--sm">
      Please indicate your representative’s availability
    </span>
    <span className="contact-choice selected-me vads-u-font-size--sm">
      Please indicate your availability
    </span>
  </>
);

export const InformalConferenceTimesDescriptionV2 = (
  <>
    <p>
      First we’ll call {contacts} to schedule the informal conference. Please
      indicate <span className="contact-choice selected-me">your</span>
      <span className="contact-choice selected-rep">their</span> availability by
      providing a preferred time for a call.
    </p>
    <p>
      <strong>We’ll make two attempts to call {contacts}.</strong> If no one
      answers, we’ll leave a voice mail and a number for {contacts} to return
      the call. If we aren’t able to get in touch with {contacts} after 2
      attempts, we’ll proceed with the Higher-Level Review.
    </p>
  </>
);

export const informalConferenceTimeSelectTitles = {
  first: <>Choose the best time for us to call {contacts}</>,
  second: 'Choose another time for us to call',
};
