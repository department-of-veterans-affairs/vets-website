import { createSelector } from 'reselect';

import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import { validateLength } from 'platform/forms/validations';
import { capitalizeEachWord, isBDD } from '../utils';
import { getDisabilityLabels } from '../content/disabilityLabels';

import {
  disabilityNameTitle,
  ServiceConnectedDisabilityDescription,
} from '../content/newDisabilityFollowUp';

import { NULL_CONDITION_STRING, CHAR_LIMITS } from '../constants';

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
      .map(
        item =>
          typeof item.condition === 'string'
            ? capitalizeEachWord(item.condition)
            : NULL_CONDITION_STRING,
      );

    return ratedDisabilities
      .map(
        disability =>
          typeof disability.name === 'string'
            ? capitalizeEachWord(disability.name)
            : NULL_CONDITION_STRING,
      )
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
      'ui:options': {
        itemAriaLabel: data => `${data.condition} followup questions`,
      },
      cause: {
        'ui:title': 'What caused your condition?',
        'ui:widget': 'radio',
        'ui:options': {
          labels: {
            NEW:
              'My condition was caused by an injury or exposure during my military service.',
            SECONDARY:
              'My condition was caused by another service-connected disability I already have. (For example, I have a limp that caused lower-back problems.)',
            WORSENED:
              'My condition existed before I served in the military, but it got worse because of my military service.',
            VA:
              'My condition was caused by an injury or event that happened when I was receiving VA care.',
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
          'Please briefly describe the injury or exposure that caused your condition. For example, I operated loud machinery while in the service, and this caused me to lose my hearing. (400 characters maximum)',
        'ui:widget': 'textarea',
        'ui:required': (formData, index) =>
          !isBDD(formData) && formData.newDisabilities[index]?.cause === 'NEW',
        'ui:options': {
          expandUnder: 'cause',
          expandUnderCondition: 'NEW',
          hideIf: isBDD,
        },
        'ui:validations': [validateLength(CHAR_LIMITS.primaryDescription)],
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
            formData.newDisabilities[index]?.cause === 'SECONDARY' &&
            getDisabilitiesList(formData, index).length > 0,
          'ui:options': {
            labels: getDisabilityLabels(),
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
            !isBDD(formData) &&
            formData.newDisabilities[index]?.cause === 'SECONDARY' &&
            getDisabilitiesList(formData, index).length > 0,
          'ui:options': {
            hideIf: isBDD,
          },
          'ui:validations': [
            validateLength(CHAR_LIMITS.causedByDisabilityDescription),
          ],
        },
      },
      'view:worsenedFollowUp': {
        'ui:options': {
          expandUnder: 'cause',
          expandUnderCondition: 'WORSENED',
          hideIf: isBDD,
        },
        worsenedDescription: {
          'ui:title':
            'Please briefly describe the injury or exposure during your military service that caused your existing disability to get worse. (50 characters maximum)',
          'ui:required': (formData, index) =>
            !isBDD(formData) &&
            formData.newDisabilities[index]?.cause === 'WORSENED' &&
            getDisabilitiesList(formData, index).length > 0,
          'ui:validations': [validateLength(CHAR_LIMITS.worsenedDescription)],
        },
        worsenedEffects: {
          'ui:title':
            'Please tell us how the disability affected you before your service, and how it affects you now after your service. (350 characters maximum)',
          'ui:widget': 'textarea',
          'ui:required': (formData, index) =>
            !isBDD(formData) &&
            formData.newDisabilities[index]?.cause === 'WORSENED' &&
            getDisabilitiesList(formData, index).length > 0,
          'ui:validations': [validateLength(CHAR_LIMITS.worsenedEffects)],
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
            !isBDD(formData) &&
            formData.newDisabilities[index]?.cause === 'VA' &&
            getDisabilitiesList(formData, index).length > 0,
          'ui:options': {
            hideIf: isBDD,
          },
          'ui:validations': [
            validateLength(CHAR_LIMITS.vaMistreatmentDescription),
          ],
        },
        vaMistreatmentLocation: {
          'ui:title':
            'Please tell us where this happened. (25 characters maximum)',
          'ui:required': (formData, index) =>
            formData.newDisabilities[index]?.cause === 'VA' &&
            getDisabilitiesList(formData, index).length > 0,
          'ui:validations': [
            validateLength(CHAR_LIMITS.vaMistreatmentLocation),
          ],
        },
        vaMistreatmentDate: {
          'ui:title':
            'Please tell us when this happened. If you’re having trouble remembering the exact date you can provide a year. (25 characters maximum)',
          'ui:required': (formData, index) =>
            formData.newDisabilities[index]?.cause === 'VA' &&
            getDisabilitiesList(formData, index).length > 0,
          'ui:validations': [validateLength(CHAR_LIMITS.vaMistreatmentDate)],
        },
      },
      'view:serviceConnectedDisability': {
        'ui:description': ServiceConnectedDisabilityDescription,
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
          'view:serviceConnectedDisability': {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  },
};
