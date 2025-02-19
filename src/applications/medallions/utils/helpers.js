import React from 'react';

import { radioUI } from 'platform/forms-system/src/js/web-component-patterns';

export const applicantInfoNoteDescription = (
  <div>
    <div>
      <va-card background>
        <h4>
          <b>Personal information</b>
        </h4>
        <p>
          <b>Name:</b> Bruce Wayne
        </p>
      </va-card>
    </div>

    <p>
      <b>Note: </b>
      To protect your personal information, we don’t allow online changes to
      your name, date of birth, or Social Security number. If you need to change
      this information, call us at <va-telephone contact="8008271000" />. We’re
      here Monday through Friday, between 8:00 a.m. and 9:00 p.m. ET.
    </p>

    <div>
      <a
        href="https://www.va.gov/resources/how-to-change-your-legal-name-on-file-with-va/"
        target="_blank"
        rel="noreferrer"
      >
        Find more detailed instructions for how to change your legal name (opens
        in new tab)
      </a>
    </div>
    <br />
  </div>
);

export const applicantRelationToVetRadio = {
  relationToVetRadio: radioUI({
    title: 'What’s your relationship to the Veteran?',
    labels: {
      familyMember: 'Family member',
      personalRep: 'Personal representative',
      repOfVSO: 'Representative of Veterans Service Organization (VSO)',
      repOfCemetery: 'Representative of a cemetery',
      repOfFuneralHome: 'Representative of a funeral home',
      other: 'Other',
    },
    required: () => true,
    errorMessages: {
      required: 'Please select an option',
    },
  }),
};

export const validateVetRadioOtherComment = (formData, errors) => {
  if (formData.relationToVetRadio === 'other') {
    if (!formData.otherRelation) {
      errors.otherRelation.addError('You must provide a response');
    } else if (formData.otherRelation.length > 50) {
      errors.otherRelation.addError(
        'Character limit exceeded. Maximum 50 characters allowed.',
      );
    }
  }
  return errors;
};
