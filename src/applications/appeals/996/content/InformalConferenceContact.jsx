import React from 'react';

export const informalConferenceContactTitle =
  'Scheduling your informal conference';

export const informalConferenceContactInfo = (
  <va-additional-info trigger="What if I don’t have an accredited representative?">
    <div>
      <p className="vads-u-margin-top--0">
        If you haven’t already appointed an accredited representative, you’ll
        need to follow our instructions to find, contact, and appoint an
        accredited representative.
      </p>
      <p className="vads-u-margin-bottom--0">
        <a href="/get-help-from-accredited-representative/" target="_blank">
          Find, contact, and appoint an accredited representative (opens in new
          tab)
        </a>
      </p>
    </div>
  </va-additional-info>
);

export const informalConferenceContactLabel =
  'Who should we contact to schedule your informal conference?';

export const informalConferenceContactOptions = {
  me: 'Contact me',
  rep: 'Contact my accredited representative',
};

export const informalConferenceContactOptionDescriptions = {
  me:
    'VA may contact me by mail, telephone, email, or another way to schedule my conference.',
  rep:
    'VA may contact my accredited representative by mail, telephone, email, or another way to schedule my conference.',
};

export const newEditButtonLabel = `Edit ${informalConferenceContactTitle}`;
