import React from 'react';
import { cloneDeep } from 'lodash';
import {
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameUI,
  fullNameSchema,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import CustomPrefillMessage from '../components/CustomPrefillAlert';
import { applicantWording } from '../../shared/utilities';
import ApplicantField from '../../shared/components/applicantLists/ApplicantField';
import { applicantListSchema } from '../helpers/utilities';

const fullNameMiddleInitialUI = cloneDeep(fullNameUI());
fullNameMiddleInitialUI.middle['ui:title'] = 'Middle initial';

/** @type {PageSchema} */
export const applicantNameDobSchema = {
  uiSchema: {
    ...titleUI('Applicant name and date of birth', ({ formData }) => (
      // Prefill message conditionally displays based on `certifierRole`
      <>
        <p>
          Enter the information for any applicants you want to enroll in CHAMPVA
          benefits.
        </p>
        {CustomPrefillMessage(formData, 'applicant')}
      </>
    )),
    applicants: {
      'ui:options': {
        viewField: ApplicantField,
        keepInPageOnReview: true,
        useDlWrap: true,
        itemName: 'Applicant',
        customTitle: ' ', // prevent <dl> around the schemaform-field-container
        confirmRemove: true,
        itemAriaLabel: item => `${applicantWording(item, false)}`,
      },
      items: {
        applicantName: fullNameUI(),
        applicantDob: dateOfBirthUI({ required: () => true }),
      },
    },
  },
  schema: applicantListSchema(['applicantDob'], {
    titleSchema,
    applicantName: fullNameSchema,
    applicantDob: dateOfBirthSchema,
  }),
};
