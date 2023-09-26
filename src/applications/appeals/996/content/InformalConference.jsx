import React from 'react';

export const InformalConferenceDescription = (
  <>
    <h3>Do you want to request an informal conference?</h3>
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
  'Do you want to request an informal conference?';

export const informalConferenceLabels = {
  no: 'No, I do not want an informal conference',
  me: 'Yes, call me to schedule an informal conference',
  rep: 'Yes, call my representative',
};

export const ContactRepresentativeTitle = (
  <h3 className="vads-u-margin-top--0">
    Your representative’s contact information
  </h3>
);

export const RepresentativeNameTitle = 'Representative’s name';
export const RepresentativeFirstNameTitle = 'Representative’s first name';
export const RepresentativeLastNameTitle = 'Representative’s last name';

export const RepresentativePhoneTitle = 'Representative’s phone number';
export const RepresentativePhoneExtensionTitle =
  'Representative’s phone extension';

export const RepresentativeEmailTitle = 'Representative’s email address';

export const InformalConferenceTimesTitle = (
  <h3 className="vads-u-margin-top--0">
    What’s the best time for us to call you?
  </h3>
);
export const InformalConferenceTimesTitleRep = (
  <h3 className="vads-u-margin-top--0">
    What’s the best time for us to call your representative?
  </h3>
);

export const InformalConferenceTimesDescription = (
  <>
    <p className="vads-u-margin-top--0">
      First we’ll call you to schedule the informal conference. Please indicate
      your availability by providing a preferred time for a call.
    </p>
    <p>
      <strong>We’ll make two attempts to call you.</strong> If no one answers,
      we’ll leave a voice mail and a number for you to return the call. If we
      aren’t able to get in touch with you after 2 attempts, we’ll proceed with
      the Higher-Level Review.
    </p>
  </>
);

export const InformalConferenceTimesDescriptionRep = (
  <>
    <p className="vads-u-margin-top--0">
      First we’ll call your representative to schedule the informal conference.
      Please indicate their availability by providing a preferred time for a
      call.
    </p>
    <p>
      <strong>We’ll make two attempts to call your representative.</strong> If
      no one answers, we’ll leave a voice mail and a number for your
      representative to return the call. If we aren’t able to get in touch with
      your representative after 2 attempts, we’ll proceed with the Higher-Level
      Review.
    </p>
  </>
);

export const informalConferenceTimeSelectTitle =
  'Choose the best time for us to call you';
export const informalConferenceTimeSelectTitleRep =
  'Choose the best time for us to call your representative';

export const RepresentativeReviewWidget = ({ name, value }) => (
  <span className="dd-privacy-hidden" data-dd-action-name={name || ''}>
    {value || null}
  </span>
);
