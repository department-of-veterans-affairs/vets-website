import React from 'react';

import { Toggler } from 'platform/utilities/feature-toggles';

export const InformalConferenceTimesTitle = (
  <h3 className="vads-u-margin-top--0">Best time for us to call you</h3>
);

export const InformalConferenceTimesTitleRep = (
  <h3 className="vads-u-margin-top--0">
    <Toggler toggleName={Toggler.TOGGLE_NAMES.hlrUpdatedContent}>
      <Toggler.Enabled>
        Best time for us to call your accredited representative
      </Toggler.Enabled>
      <Toggler.Disabled>
        What’s the best time for us to call your representative?
      </Toggler.Disabled>
    </Toggler>
  </h3>
);

export const InformalConferenceTimesDescription = (
  <Toggler toggleName={Toggler.TOGGLE_NAMES.hlrUpdatedContent}>
    <Toggler.Enabled>
      <p className="vads-u-margin-top--0">
        We’ll call you to schedule the informal conference. We want to know the
        best time to call you.
      </p>
      <p>
        <strong>We’ll make two attempts to contact you.</strong> If no one
        answers, we’ll leave a voicemail and a number for you to call us back.
        If we can’t leave a message or make contact with you after 2 attempts,
        we’ll review and decide your case without an informal conference.
      </p>
    </Toggler.Enabled>
    <Toggler.Disabled>
      <p className="vads-u-margin-top--0">
        First we’ll call you to schedule the informal conference. Please
        indicate your availability by providing a preferred time for a call.
      </p>
      <p>
        <strong>We’ll make two attempts to call you.</strong> If no one answers,
        we’ll leave a voice mail and a number for you to return the call. If we
        aren’t able to get in touch with you after 2 attempts, we’ll proceed
        with the Higher-Level Review.
      </p>
    </Toggler.Disabled>
  </Toggler>
);

export const InformalConferenceTimesDescriptionRep = (
  <Toggler toggleName={Toggler.TOGGLE_NAMES.hlrUpdatedContent}>
    <Toggler.Enabled>
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
        accredited representative to call us back. If we can’t leave a message
        or make contact with them after 2 attempts, we’ll review and decide your
        case without an informal conference.
      </p>
    </Toggler.Enabled>
    <Toggler.Disabled>
      <p className="vads-u-margin-top--0">
        First we’ll call your representative to schedule the informal
        conference. Please indicate their availability by providing a preferred
        time for a call.
      </p>
      <p>
        <strong>We’ll make two attempts to call your representative.</strong> If
        no one answers, we’ll leave a voice mail and a number for your
        representative to return the call. If we aren’t able to get in touch
        with your representative after 2 attempts, we’ll proceed with the
        Higher-Level Review.
      </p>
    </Toggler.Disabled>
  </Toggler>
);

export const informalConferenceTimeSelectTitleOriginal =
  'Choose the best time for us to call you';
export const informalConferenceTimeSelectTitleRepOriginal =
  'Choose the best time for us to call your representative';

export const informalConferenceTimeSelectTitle =
  'What’s the best time for us to call you?';
export const informalConferenceTimeSelectTitleRep =
  'What’s the best time to call your accredited representative?';

export const informalConferenceTimeSelectHint =
  'Your time zone is based on the mailing address you provide in this request.';

export const informalConferenceTimeReviewField = ({ children }) => (
  <div className="review-row">
    <dt>
      <Toggler toggleName={Toggler.TOGGLE_NAMES.hlrUpdatedContent}>
        <Toggler.Enabled>{informalConferenceTimeSelectTitle}</Toggler.Enabled>
        <Toggler.Disabled>
          {informalConferenceTimeSelectTitleOriginal}
        </Toggler.Disabled>
      </Toggler>
    </dt>
    <dd>{children}</dd>
  </div>
);

export const informalConferenceTimeRepReviewField = ({ children }) => (
  <div className="review-row">
    <dt>
      <Toggler toggleName={Toggler.TOGGLE_NAMES.hlrUpdatedContent}>
        <Toggler.Enabled>
          {informalConferenceTimeSelectTitleRep}
        </Toggler.Enabled>
        <Toggler.Disabled>
          {informalConferenceTimeSelectTitleRepOriginal}
        </Toggler.Disabled>
      </Toggler>
    </dt>
    <dd>{children}</dd>
  </div>
);
