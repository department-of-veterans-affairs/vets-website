import React from 'react';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import {
  PersonalInformation,
  PersonalInformationHeader,
  PersonalInformationCardHeader,
  PersonalInformationNote,
  PersonalInformationFooter,
} from 'platform/forms-system/src/js/components/PersonalInformation/PersonalInformation';

const personalInfoConfig = {
  name: { show: true },
  ssn: { show: true },
  dateOfBirth: { show: true },
};

const PersonalInformationHeaderContent = () => (
  <h3 className="vads-u-margin-bottom--3">
    Confirm the personal information we have on file for you
  </h3>
);

const PersonalInformationCardHeaderContent = () => (
  <h4 className="vads-u-font-size--h3 vads-u-margin-top--0">
    Personal information
  </h4>
);

const PersonalInformationNoteContent = () => (
  <p className="vads-u-margin-top--2">
    <strong>Note:</strong> To protect your personal information, we don&apos;t
    allow online changes to your name, date of birth, or Social Security number.
    If you need to change this information, call us at{' '}
    <va-telephone contact="8008271000" /> (TTY: 711). We&apos;re here Monday
    through Friday, between 8:00 a.m. and 9:00 p.m. ET.
  </p>
);

const PersonalInformationFooterContent = () => (
  <p className="vads-u-margin-bottom--4">
    <va-link
      external
      href={`${environment.BASE_URL}/resources/how-to-change-your-legal-name-on-file-with-va/`}
      text="Find more detailed instructions for how to change your legal name"
    />
  </p>
);

/** @type {PageSchema} */
export const confirmPersonalInformationPage = {
  uiSchema: {},
  schema: {
    type: 'object',
    properties: {},
  },
  CustomPage: props => (
    <PersonalInformation
      {...props}
      config={personalInfoConfig}
      dataAdapter={{ ssnPath: 'idNumber.ssn' }}
    >
      <PersonalInformationHeader>
        <PersonalInformationHeaderContent />
      </PersonalInformationHeader>
      <PersonalInformationCardHeader>
        <PersonalInformationCardHeaderContent />
      </PersonalInformationCardHeader>
      <PersonalInformationNote>
        <PersonalInformationNoteContent />
      </PersonalInformationNote>
      <PersonalInformationFooter>
        <PersonalInformationFooterContent />
      </PersonalInformationFooter>
    </PersonalInformation>
  ),
  CustomPageReview: null,
  hideOnReview: true,
};

