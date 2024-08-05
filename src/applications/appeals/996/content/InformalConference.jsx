import React from 'react';

import { Toggler } from 'platform/utilities/feature-toggles';

export const informalConferenceTitle = 'Request an informal conference';

export const newInformalConferenceTitle =
  'Option to request an informal conference';

export const informalConferenceLabel =
  'Do you want to request an informal conference?';

export const InformalConferenceDescription = (
  <Toggler toggleName={Toggler.TOGGLE_NAMES.hlrUpdatedContent}>
    <Toggler.Enabled>
      <h3>{newInformalConferenceTitle}</h3>
      <p>
        You or your accredited representative have the option to request an
        informal conference. If you request an informal conference, we’ll
        conduct only one informal conference for this Higher-Level Review.
      </p>
      <va-additional-info trigger="What happens during an informal conference">
        <div>
          <p className="vads-u-margin-top--0">
            An informal conference is a call with the higher-level reviewer for
            your case. If you choose to have an informal conference, the
            reviewer will contact <strong>you</strong> or{' '}
            <strong>your accredited representative, if you have one</strong>, to
            schedule a time to discuss your case with you.
          </p>
          <p className="vads-u-margin-bottom--0">
            During the call, you or your accredited representative can identify
            errors and discuss why you think the decision should change. You
            can’t submit new evidence.
          </p>
        </div>
      </va-additional-info>
    </Toggler.Enabled>
    <Toggler.Disabled>
      <h3>{informalConferenceTitle}</h3>
      <p>
        An informal conference is a phone call between you or your accredited
        representative (claims agent, attorney, or Veterans Service
        Organization) and the reviewer to discuss why you think the decision
        should be changed and identify factual errors.
      </p>
      <p id="choose-conference-notice" className="vads-u-margin-bottom--3">
        If you request an informal conference, the reviewer will call you or
        your representative. You can request only one informal conference for
        each Higher-Level Review request.
      </p>
    </Toggler.Disabled>
  </Toggler>
);

export const informalConferenceHint =
  'I understand that if I request an informal conference, I can’t discuss or introduce new evidence that wasn’t part of my file at the time of the decision at issue.';

export const informalConferenceLabels = {
  no: 'No, I do not want an informal conference',
  me: 'Yes, call me to schedule an informal conference',
  rep: 'Yes, call my representative',
};

export const newInformalConferenceLabels = {
  yes: 'Yes',
  no: 'No',
};

export const newInformalConferenceReviewLabels = {
  yes: 'Yes',
  no: 'No',
  rep: 'Yes, call my accredited representative',
};

export const informalConferenceDescriptions = {
  yes:
    'I understand that if I request an informal conference, I can’t discuss or introduce new evidence that wasn’t part of my file at the time of the decision at issue.',
  no:
    'I understand that if I don’t request an informal conference, VA will proceed to make a decision on my Higher-Level Review.',
  me:
    'VA may contact me by mail, telephone, email, or by other means to schedule my conference.',
  rep:
    'VA may contact my accredited representative by mail, telephone, email, or by other means to schedule my conference. You must have an accredited representative who you appointed to speak to us on your behalf. If you haven’t already appointed an accredited representative, you’ll need to follow our instructions to find, contact, and appoint an accredited representative.',
};

export const editButtonText = 'Edit';
export const updateButtonText = 'Update page';

export const editButtonLabel = `Edit ${informalConferenceTitle}`;
export const newEditButtonLabel = `Edit ${newInformalConferenceTitle}`;
