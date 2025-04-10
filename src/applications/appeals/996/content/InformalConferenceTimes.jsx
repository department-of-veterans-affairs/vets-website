import React from 'react';

export const InformalConferenceTimesTitle = (
  <h3 className="vads-u-margin-top--0">Best time for us to call you</h3>
);

export const InformalConferenceTimesTitleRep = (
  <h3 className="vads-u-margin-top--0">
    Best time for us to call your accredited representative
  </h3>
);

export const InformalConferenceTimesDescription = (
  <>
    <p className="vads-u-margin-top--0">
      We may call you to schedule the informal conference. We want to know the
      best time to call you.
    </p>
    <p>
      <strong>We’ll make two attempts to contact you.</strong> If no one
      answers, we’ll leave a voicemail and a number for you to call us back. If
      we can’t leave a message or make contact with you after 2 attempts, we’ll
      review and decide your case without an informal conference.
    </p>
  </>
);

export const InformalConferenceTimesDescriptionRep = (
  <>
    <p className="vads-u-margin-top--0">
      We may call your accredited representative to schedule the informal
      conference. We want to know the best time to call your accredited
      representative.
    </p>
    <p>
      <strong>
        We’ll make two attempts to contact your accredited representative.
      </strong>{' '}
      If no one answers, we’ll leave a voice mail and a number for your
      accredited representative to call us back. If we can’t leave a message or
      make contact with them after 2 attempts, we’ll review and decide your case
      without an informal conference.
    </p>
  </>
);

export const informalConferenceTimeSelectTitle =
  'What’s the best time for us to call you?';
export const informalConferenceTimeSelectTitleRep =
  'What’s the best time to call your accredited representative?';

export const informalConferenceTimeSelectHint =
  'Your time zone is based on the mailing address you provide in this request.';

export const informalConferenceTimeReviewField = ({ children }) => (
  <div className="review-row">
    <dt>{informalConferenceTimeSelectTitle}</dt>
    <dd>{children}</dd>
  </div>
);

export const informalConferenceTimeRepReviewField = ({ children }) => (
  <div className="review-row">
    <dt>{informalConferenceTimeSelectTitleRep}</dt>
    <dd>{children}</dd>
  </div>
);
