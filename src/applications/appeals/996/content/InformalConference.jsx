import React from 'react';

export const informalConferenceTitle =
  'Option to request an informal conference';

export const informalConferenceLabel =
  'Do you want to request an informal conference?';

export const InformalConferenceDescription = (
  <>
    <h3>{informalConferenceTitle}</h3>
    <p>
      You or your accredited representative have the option to request an
      informal conference. If you request an informal conference, we’ll conduct
      only one informal conference for this Higher-Level Review.
    </p>
    <p>
      If you request an informal conference, it may take us longer to make a
      decision on your Higher-Level Review.
    </p>
    <va-additional-info trigger="What happens during an informal conference">
      <div>
        <p className="vads-u-margin-top--0">
          An informal conference is a call with the higher-level reviewer for
          your case.
        </p>
        <p className="vads-u-margin-bottom--0">
          During the call, you or your accredited representative should identify
          any errors in the decision, and discuss why you think the decision
          should change. The reviewer will consider the errors you identify. But
          you can’t submit new evidence.
        </p>
      </div>
    </va-additional-info>
  </>
);

export const informalConferenceLabels = {
  yes: 'Yes',
  no: 'No',
};

export const informalConferenceDescriptions = {
  yes:
    'I understand that if I request an informal conference, I can’t discuss or introduce new evidence that wasn’t part of my file at the time of the decision at issue.',
  no: '',
};

export const editButtonText = 'Edit';
export const updateButtonText = 'Update page';

export const editButtonLabel = `Edit ${informalConferenceTitle}`;
