import React from 'react';
import { createSelector } from 'reselect';

import { capitalizeEachWord } from '../utils';
import disabilityLabels from '../content/disabilityLabels';

import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import {
  CauseTitle,
  disabilityNameTitle,
} from '../content/newDisabilityFollowUp';

import { validateLength } from '../../../../platform/forms/validations';

const {
  cause,
  causedByDisability,
  causedByDisabilityDescription,
  primaryDescription,
  vaMistreatmentDate,
  worsenedDescription,
  worsenedEffects,
  vaMistreatmentDescription,
  vaMistreatmentLocation,
} = fullSchema.definitions.newDisabilities.items.properties;

const getDisabilitiesList = createSelector(
  formData => formData.ratedDisabilities,
  formData => formData.newDisabilities,
  (formData, index) => index,
  (ratedDisabilities = [], newDisabilities = [], currentIndex) => {
    const newDisabilitiesWithoutCurrent = newDisabilities
      .filter((item, index) => index !== currentIndex)
      .map(item => capitalizeEachWord(item.condition));

    return ratedDisabilities
      .map(disability => capitalizeEachWord(disability.name))
      .concat(newDisabilitiesWithoutCurrent);
  },
);

const allCauses = cause.enum;
const causesWithoutSecondary = allCauses.filter(
  causeCode => causeCode !== 'SECONDARY',
);

export const uiSchema = {
  'ui:title': 'Disability details',
  newDisabilities: {
    items: {
      'ui:title': disabilityNameTitle,
      cause: {
        'ui:title': <CauseTitle />,
        'ui:widget': 'radio',
        'ui:options': {
          labels: {
            NEW:
              'My disability was caused by an injury or exposure during my military service.',
            SECONDARY:
              'My disability was caused by another service-connected disability I already have. (For example, I have a limp that caused lower-back problems.)',
            WORSENED:
              'My disability or condition existed before I served in the military, but it got worse because of my military service.',
            VA:
              'My disability was caused by an injury or event that happened when I was receiving VA care.',
          },
          updateSchema: (formData, causeSchema, causeUISchema, index) => ({
            enum: getDisabilitiesList(formData, index).length
              ? allCauses
              : causesWithoutSecondary,
          }),
        },
      },
      primaryDescription: {
        'ui:title':
          'Please briefly describe the injury or exposure that caused your condition. For example, I operated loud machinery while in the Army, and this caused me to lose my hearing. (400 characters maximum)',
        'ui:widget': 'textarea',
        'ui:required': (formData, index) =>
          formData.newDisabilities[index].cause === 'NEW',
        'ui:options': {
          expandUnder: 'cause',
          expandUnderCondition: 'NEW',
        },
        'ui:validations': [validateLength(400)],
      },
      'view:secondaryFollowUp': {
        'ui:options': {
          expandUnder: 'cause',
          expandUnderCondition: 'SECONDARY',
        },
        causedByDisability: {
          'ui:title':
            'Please choose the disability that caused the new disability you’re claiming here.',
          'ui:required': (formData, index) =>
            formData.newDisabilities[index].cause === 'SECONDARY' &&
            getDisabilitiesList(formData, index).length > 0,
          'ui:options': {
            labels: disabilityLabels,
            updateSchema: (formData, primarySchema, primaryUISchema, index) => {
              const disabilitiesList = getDisabilitiesList(formData, index);
              if (!disabilitiesList.length) {
                return {
                  'ui:hidden': true,
                };
              }
              return {
                enum: disabilitiesList,
              };
            },
          },
        },
        causedByDisabilityDescription: {
          'ui:title':
            'Please briefly describe how the disability you selected caused your new disability. (400 characters maximum)',
          'ui:widget': 'textarea',
          'ui:required': (formData, index) =>
            formData.newDisabilities[index].cause === 'SECONDARY' &&
            getDisabilitiesList(formData, index).length > 0,
          'ui:validations': [validateLength(400)],
        },
      },
      'view:worsenedFollowUp': {
        'ui:options': {
          expandUnder: 'cause',
          expandUnderCondition: 'WORSENED',
        },
        worsenedDescription: {
          'ui:title':
            'Please briefly describe the injury or exposure during your military service that caused your existing disability to get worse. (50 characters maximum)',
          'ui:required': (formData, index) =>
            formData.newDisabilities[index].cause === 'WORSENED' &&
            getDisabilitiesList(formData, index).length > 0,
          'ui:validations': [validateLength(50)],
        },
        worsenedEffects: {
          'ui:title':
            'Please tell us how the disability affected you before your service, and how it affects you now after your service. (350 characters maximum)',
          'ui:widget': 'textarea',
          'ui:required': (formData, index) =>
            formData.newDisabilities[index].cause === 'WORSENED' &&
            getDisabilitiesList(formData, index).length > 0,
          'ui:validations': [validateLength(350)],
        },
      },
      'view:vaFollowUp': {
        'ui:options': {
          expandUnder: 'cause',
          expandUnderCondition: 'VA',
        },
        vaMistreatmentDescription: {
          'ui:title':
            'Please briefly describe the injury or event while you were under VA care that caused your disability. (350 characters maximum)',
          'ui:widget': 'textarea',
          'ui:required': (formData, index) =>
            formData.newDisabilities[index].cause === 'VA' &&
            getDisabilitiesList(formData, index).length > 0,
          'ui:validations': [validateLength(350)],
        },
        vaMistreatmentLocation: {
          'ui:title':
            'Please tell us where this happened. (25 characters maximum)',
          'ui:required': (formData, index) =>
            formData.newDisabilities[index].cause === 'VA' &&
            getDisabilitiesList(formData, index).length > 0,
          'ui:validations': [validateLength(25)],
        },
        vaMistreatmentDate: {
          'ui:title':
            'Please tell us when this happened. If you’re having trouble remembering the exact date you can provide a year. (25 characters maximum)',
          'ui:required': (formData, index) =>
            formData.newDisabilities[index].cause === 'VA' &&
            getDisabilitiesList(formData, index).length > 0,
          'ui:validations': [validateLength(25)],
        },
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    newDisabilities: {
      type: 'array',
      items: {
        type: 'object',
        required: ['cause'],
        properties: {
          cause,
          primaryDescription,
          'view:secondaryFollowUp': {
            type: 'object',
            properties: {
              causedByDisability,
              causedByDisabilityDescription,
            },
          },
          'view:worsenedFollowUp': {
            type: 'object',
            properties: {
              worsenedDescription,
              worsenedEffects,
            },
          },
          'view:vaFollowUp': {
            type: 'object',
            properties: {
              vaMistreatmentDescription,
              vaMistreatmentLocation,
              vaMistreatmentDate,
            },
          },
        },
      },
    },
  },
};
