import React from 'react';
import {
  PersonalInformation,
  PersonalInformationHeader,
} from 'platform/forms-system/src/js/components/PersonalInformation/PersonalInformation';
import { PersonalInformationReview } from 'platform/forms-system/src/js/components/PersonalInformation/PersonalInformationReview';

import { hasSession } from '../../../helpers';

const CustomPersonalInfo = props => (
  <PersonalInformation
    {...props}
    config={{
      name: { show: true, required: true },
      ssn: { show: true, required: true },
      vaFileNumber: { show: true, required: false },
      dateOfBirth: { show: false },
    }}
    dataAdapter={{
      ssnPath: 'veteranSocialSecurityNumber',
      vaFileNumberPath: 'vaFileNumber',
    }}
  >
    <PersonalInformationHeader>
      <h1 className="vads-u-margin-bottom--3 vads-u-font-size--h2">
        Confirm the personal information we have on file for you
      </h1>
    </PersonalInformationHeader>
  </PersonalInformation>
);

const CustomPersonalInfoReview = props => (
  <PersonalInformationReview
    {...props}
    config={{
      name: { show: true },
      ssn: { show: true },
      vaFileNumber: { show: true },
      dateOfBirth: { show: false },
    }}
    dataAdapter={{
      ssnPath: 'veteranSocialSecurityNumber',
      vaFileNumberPath: 'vaFileNumber',
    }}
    title="Personal information"
  />
);

/** @type {PageSchema} */
export default {
  title: 'Personal information',
  path: 'personal/information',
  depends: formData => formData?.claimantType === 'VETERAN' && hasSession(),
  CustomPage: CustomPersonalInfo,
  CustomPageReview: CustomPersonalInfoReview,
  hideOnReview: false,
  schema: {
    type: 'object',
    properties: {}, // Must be present even if empty
  },
  uiSchema: {},
};
