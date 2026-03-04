import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  titleUI,
  radioUI,
  radioSchema,
  yesNoUI,
  yesNoSchema,
  dateOfBirthSchema,
  dateOfBirthUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaDateField from 'platform/forms-system/src/js/web-component-fields/VaDateField';
import {
  applicationInfoFields,
  BRANCH_OF_SERVICE,
  CONVEYANCE_TYPES,
} from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Section II: Application information'),
    'ui:description': (
      <VaAlert status="info" class="vads-u-margin-top--3" uswds visible>
        <h2 slot="headline">Service and conveyance details</h2>
        <p className="vads-u-margin--0">
          We need information about your military service and the type of
          vehicle or equipment you are applying for.
        </p>
      </VaAlert>
    ),
    [applicationInfoFields.parentObject]: {
      [applicationInfoFields.branchOfService]: radioUI({
        title: 'Branch of service',
        labels: BRANCH_OF_SERVICE,
        required: () => true,
      }),
      [applicationInfoFields.activeDutyStatus]: yesNoUI({
        title: 'Are you currently on active duty?',
        required: () => true,
      }),
      [applicationInfoFields.placeOfEntry]: {
        'ui:title': 'Place of entry into active duty',
        'ui:options': { hideEmptyValueInReview: true },
      },
      [applicationInfoFields.dateOfEntry]: {
        ...dateOfBirthUI({ hint: 'For example: January 2020' }),
        'ui:title': 'Date of entry into active duty',
        'ui:webComponentField': VaDateField,
        'ui:options': { hideEmptyValueInReview: true },
      },
      [applicationInfoFields.placeOfRelease]: {
        'ui:title': 'Place of release from active duty (if applicable)',
        'ui:options': { hideEmptyValueInReview: true },
      },
      [applicationInfoFields.dateOfRelease]: {
        ...dateOfBirthUI({ hint: 'For example: March 2024' }),
        'ui:title': 'Date of release from active duty (if applicable)',
        'ui:webComponentField': VaDateField,
        'ui:options': { hideEmptyValueInReview: true },
      },
      [applicationInfoFields.vaOfficeLocation]: {
        'ui:title': 'Location of VA office that has your file (city and state)',
        'ui:options': { hideEmptyValueInReview: true },
      },
      [applicationInfoFields.conveyanceType]: radioUI({
        title: 'Type of conveyance are you applying for?',
        labels: CONVEYANCE_TYPES,
        required: () => true,
      }),
      [applicationInfoFields.conveyanceTypeOther]: {
        'ui:title': 'Specify other type of conveyance',
        'ui:options': {
          hideIf: formData =>
            formData?.applicationInfo?.conveyanceType !== 'other',
          hideEmptyValueInReview: true,
        },
      },
      [applicationInfoFields.previouslyAppliedConveyance]: yesNoUI({
        title:
          'Have you previously applied for an automobile or other conveyance from VA?',
        required: () => true,
      }),
      [applicationInfoFields.previouslyAppliedPlace]: {
        'ui:title': 'Place where you previously applied',
        'ui:options': {
          hideIf: formData =>
            formData?.applicationInfo?.previouslyAppliedConveyance !== true,
          hideEmptyValueInReview: true,
        },
      },
      [applicationInfoFields.previouslyAppliedDate]: {
        ...dateOfBirthUI({ hint: 'Date of your previous application' }),
        'ui:title': 'Date of previous application',
        'ui:webComponentField': VaDateField,
        'ui:options': {
          hideIf: formData =>
            formData?.applicationInfo?.previouslyAppliedConveyance !== true,
          hideEmptyValueInReview: true,
        },
      },
      [applicationInfoFields.appliedDisabilityCompensation]: yesNoUI({
        title: 'Have you applied for VA disability compensation?',
        required: () => true,
      }),
      [applicationInfoFields.appliedDisabilityCompensationPlace]: {
        'ui:title':
          'Name of place where you applied for disability compensation',
        'ui:options': {
          hideIf: formData =>
            formData?.applicationInfo?.appliedDisabilityCompensation !== true,
          hideEmptyValueInReview: true,
        },
      },
      [applicationInfoFields.dateApplied]: {
        ...dateOfBirthUI({
          hint: 'Date you applied for disability compensation',
        }),
        'ui:title': 'Date you applied for disability compensation',
        'ui:webComponentField': VaDateField,
        'ui:options': {
          hideIf: formData =>
            formData?.applicationInfo?.appliedDisabilityCompensation !== true,
          hideEmptyValueInReview: true,
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [applicationInfoFields.parentObject]: {
        type: 'object',
        properties: {
          [applicationInfoFields.branchOfService]: radioSchema(
            Object.keys(BRANCH_OF_SERVICE),
          ),
          [applicationInfoFields.activeDutyStatus]: yesNoSchema,
          [applicationInfoFields.placeOfEntry]: {
            type: 'string',
            maxLength: 100,
          },
          [applicationInfoFields.dateOfEntry]: dateOfBirthSchema,
          [applicationInfoFields.placeOfRelease]: {
            type: 'string',
            maxLength: 100,
          },
          [applicationInfoFields.dateOfRelease]: dateOfBirthSchema,
          [applicationInfoFields.vaOfficeLocation]: {
            type: 'string',
            maxLength: 200,
          },
          [applicationInfoFields.conveyanceType]: radioSchema(
            Object.keys(CONVEYANCE_TYPES),
          ),
          [applicationInfoFields.conveyanceTypeOther]: {
            type: 'string',
            maxLength: 100,
          },
          [applicationInfoFields.previouslyAppliedConveyance]: yesNoSchema,
          [applicationInfoFields.previouslyAppliedPlace]: {
            type: 'string',
            maxLength: 100,
          },
          [applicationInfoFields.previouslyAppliedDate]: dateOfBirthSchema,
          [applicationInfoFields.appliedDisabilityCompensation]: yesNoSchema,
          [applicationInfoFields.appliedDisabilityCompensationPlace]: {
            type: 'string',
            maxLength: 200,
          },
          [applicationInfoFields.dateApplied]: dateOfBirthSchema,
        },
        required: [
          applicationInfoFields.branchOfService,
          applicationInfoFields.activeDutyStatus,
          applicationInfoFields.conveyanceType,
          applicationInfoFields.previouslyAppliedConveyance,
          applicationInfoFields.appliedDisabilityCompensation,
        ],
      },
    },
  },
};
