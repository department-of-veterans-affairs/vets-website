import React from 'react';

export const InformalConferenceDescription = (
  <>
    <h3>Option to request an informal conference</h3>
    <p>
      You or your accredited representative have the option to request an
      informal conference. If you request an informal conference, we’ll conduct
      only one informal conference for this Higher-Level Review.
    </p>
    <va-additional-info trigger="What happens during an informal conference">
      <div>
        <p className="vads-u-margin-top--0">
          An informal conference is a call with the higher-level reviewer for
          your case. If you choose to have an informal conference, the reviewer
          will call to schedule a time to discuss your case with you.
        </p>
        <p className="vads-u-margin-bottom--0">
          During the call, you or your accredited representative can identify
          errors and discuss why you think the decision should change. You can’t
          submit new evidence.
        </p>
      </div>
    </va-additional-info>
  </>
);

export const InformalConferenceTitle =
  'Do you want to request an informal conference?';

export const informalConferenceHint =
  'I understand that if I request an informal conference, I can’t discuss or introduce new evidence that wasn’t part of my file at the time of the decision at issue.';

export const informalConferenceLabels = {
  no: 'No, I don’t want an informal conference',
  me: 'Yes, call me',
  rep: 'Yes, call my accredited representative',
};

export const informalConferenceDescriptions = {
  no:
    'I understand that if I don’t request an informal conference, VA will proceed to make a decision on my Higher-Level Review.',
  me:
    'VA may contact me by mail, telephone, email, or by other means to schedule my conference.',
  rep:
    'VA may contact my accredited representative by mail, telephone, email, or by other means to schedule my conference. You must have an accredited representative who you appointed to speak to us on your behalf. If you haven’t already appointed an accredited representative, you’ll need to follow our instructions to find, contact, and appoint an accredited representative.',
};

export const ContactRepresentativeTitle = (
  <h3 className="vads-u-margin-top--0">
    Your representative’s contact information
  </h3>
);

export const ContactRepresentativeDescription = (
  <p className="vads-u-margin-top--0">
    We’ll contact your accredited representative to schedule an informal
    conference
  </p>
);

export const RepresentativeNameTitle = 'Representative’s name';
export const RepresentativeFirstNameTitle = 'Representative’s first name';
export const RepresentativeLastNameTitle = 'Representative’s last name';

export const RepresentativePhoneTitle = 'Representative’s phone number';
export const RepresentativePhoneExtensionTitle =
  'Representative’s phone extension';

export const RepresentativeEmailTitle = 'Representative’s email address';

export const InformalConferenceTimesTitle = (
  <h3 className="vads-u-margin-top--0">Best time for us to call you</h3>
);

export const InformalConferenceTimesTitleRep = (
  <h3 className="vads-u-margin-top--0">
    Best time for us to call your representative
  </h3>
);

export const InformalConferenceTimesDescription = (
  <>
    <p className="vads-u-margin-top--0">
      We’ll call you to schedule the informal conference. We want to know the
      best time to call you.
    </p>
    <p>
      <strong>We’ll make two attempts to call you.</strong> If no one answers,
      we’ll leave a voicemail and a number for you to call us back. If we can’t
      leave a message or make contact with you after 2 attempts, we’ll review
      and decide your case without an informal conference.
    </p>
  </>
);

export const InformalConferenceTimesDescriptionRep = (
  <>
    <p className="vads-u-margin-top--0">
      We’ll call your representative to schedule the informal conference. We
      want to know the best time to call your accredited representative.
    </p>
    <p>
      <strong>We’ll make two attempts to call your representative.</strong> If
      no one answers, we’ll leave a voice mail and a number for your accredited
      representative to call us back. If we can’t leave a message or make
      contact with them after 2 attempts, we’ll review and decide your case
      without an informal conference.
    </p>
  </>
);

export const informalConferenceTimeSelectTitle =
  'What’s the best time for us to call you?';
export const informalConferenceTimeSelectTitleRep =
  'What’s the best time for us to call your representative';

export const informalConferenceTimeSelectHint =
  'Your time zone is based on the mailing address you provide in this request.';

export const RepresentativeReviewWidget = ({ name, value }) => (
  <span className="dd-privacy-hidden" data-dd-action-name={name || ''}>
    {value || null}
  </span>
);
