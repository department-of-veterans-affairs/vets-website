import React from 'react';
import { blankSchema } from 'platform/forms-system/src/js/utilities/data/profile';
import {
  ApplicantInformation,
  ApplicantInformationInfoSection,
} from '../../pages/applicant-information/ApplicantInformation';

export const applicantInformation = {
  path: 'applicant-information',
  title: 'Applicant Information',
  CustomPage: ApplicantInformation,
  CustomPageReview: null,
  uiSchema: {},
  schema: blankSchema,
  review: props => ({
    'Applicant Information': (() => {
      const {
        veteranFullName,
        veteranSocialSecurityNumber,
        veteranDateOfBirth,
        gender: genderData,
      } = props?.data;

      return (
        <ApplicantInformationInfoSection
          veteranDateOfBirth={veteranDateOfBirth}
          veteranFullName={veteranFullName}
          veteranSocialSecurityNumber={veteranSocialSecurityNumber}
          gender={genderData}
        />
      );
    })(),
  }),
};
