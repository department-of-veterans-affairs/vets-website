import React from 'react';
import { cloneDeep } from 'lodash';
import {
  addressUI,
  addressSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameUI,
  fullNameSchema,
  titleUI,
  titleSchema,
  ssnUI,
  ssnSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { blankSchema } from 'platform/forms-system/src/js/utilities/data/profile';
import CustomPrefillMessage from '../components/CustomPrefillAlert';
import { applicantWording } from '../../shared/utilities';
import ApplicantField from '../../shared/components/applicantLists/ApplicantField';
import { applicantListSchema } from '../helpers/utilities';
import { applicantAddressCleanValidation } from '../../shared/validations';

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

/** @type {PageSchema} */
export const applicantInfoIntroSchema = {
  uiSchema: {
    applicants: {
      'ui:options': {
        viewField: ApplicantField,
      },
      items: {
        ...titleUI(
          ({ formData }) => (
            <>
              <span className="dd-privacy-hidden">
                {applicantWording(formData)}
              </span>{' '}
              information
            </>
          ),
          ({ formData }) => (
            <>
              Next we’ll ask more questions about{' '}
              <span className="dd-privacy-hidden">
                {applicantWording(formData, false, false)}
              </span>
              . This includes social security number, mailing address, contact
              information, relationship to the sponsor, and health insurance
              information.
            </>
          ),
        ),
      },
    },
  },
  schema: applicantListSchema([], {
    titleSchema,
    'view:description': blankSchema,
  }),
};

/** @type {PageSchema} */
export const applicantIdentificationInfoSchema = {
  uiSchema: {
    applicants: {
      'ui:options': {
        viewField: ApplicantField,
        keepInPageOnReview: true,
      },
      items: {
        ...titleUI(({ formData }) => (
          <>
            <span className="dd-privacy-hidden">
              {applicantWording(formData)}
            </span>{' '}
            identification information
          </>
        )),
        applicantSSN: ssnUI(),
      },
    },
  },
  schema: applicantListSchema(['applicantSSN'], {
    titleSchema,
    applicantSSN: ssnSchema,
  }),
};

/** @type {PageSchema} */
export const applicantSharedAddressSchema = {
  uiSchema: {
    applicants: {
      items: {},
      'ui:options': {
        viewField: ApplicantField,
      },
    },
  },
  schema: applicantListSchema([], {}),
};

/** @type {PageSchema} */
export const applicantMailingAddressSchema = {
  uiSchema: {
    applicants: {
      'ui:options': { viewField: ApplicantField },
      items: {
        ...titleUI(
          ({ formData }) => (
            <>
              <span className="dd-privacy-hidden">
                {applicantWording(formData)}
              </span>{' '}
              mailing address
            </>
          ),
          ({ formData, formContext }) => {
            const txt =
              'We’ll send any important information about your application to this address';
            // Prefill message conditionally displays based on `certifierRole`
            return formContext.pagePerItemIndex === '0' ? (
              <>
                <p>{txt}</p>
                {CustomPrefillMessage(formData, 'applicant')}
              </>
            ) : (
              <p>{txt}</p>
            );
          },
        ),
        applicantAddress: {
          ...addressUI({
            labels: {
              militaryCheckbox:
                'Address is on a United States military base outside the country.',
            },
          }),
          'ui:validations': [applicantAddressCleanValidation],
        },
      },
    },
  },
  schema: applicantListSchema([], {
    titleSchema,
    applicantAddress: addressSchema(),
  }),
};
