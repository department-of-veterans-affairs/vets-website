import React from 'react';
import { createSelector } from 'reselect';
import dateUI from 'us-forms-system/lib/js/definitions/date';

import { getDisabilityName } from '../utils';
import disabilityLabels from '../content/disabilityLabels';

import fullSchema from '../config/schema';

const {
  cause,
  primaryDisability,
  primaryDescription,
  disabilityStartDate,
} = fullSchema.properties.newDisabilities.items.properties;

export const disabilityNameTitle = ({ formData }) => (
  <legend className="schemaform-block-title schemaform-title-underline">
    {getDisabilityName(formData.condition)}
  </legend>
);

const getDisabilitiesList = createSelector(
  formData => formData.ratedDisabilities,
  formData => formData.newDisabilities,
  (formData, index) => index,
  (ratedDisabilities = [], newDisabilities = [], currentIndex) => {
    const newDisabilitiesWithoutCurrent = newDisabilities
      .filter((item, index) => index !== currentIndex)
      .map(item => getDisabilityName(item.condition));

    return ratedDisabilities
      .map(disability => getDisabilityName(disability.name))
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
        'ui:title': 'How is this disability service connected?',
        'ui:widget': 'radio',
        'ui:options': {
          labels: {
            NEW:
              'My disability was caused by—or got worse because of—an injury or exposure during my service in the military.',
            SECONDARY:
              'My disability was caused by another disability (for example, I have a limp that caused lower-back problems).',
            VA: 'My disability was caused by VA mistreatment.',
          },
          updateSchema: (formData, causeSchema, causeUISchema, index) => ({
            enum: getDisabilitiesList(formData, index).length
              ? allCauses
              : causesWithoutSecondary,
          }),
        },
      },
      primaryDisability: {
        'ui:title':
          'Please choose the disability that caused the disability you’re claiming here.',
        'ui:required': (formData, index) =>
          formData.newDisabilities[index].cause === 'SECONDARY' &&
          getDisabilitiesList(formData, index).length > 0,
        'ui:options': {
          labels: disabilityLabels,
          expandUnder: 'cause',
          expandUnderCondition: 'SECONDARY',
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
      primaryDescription: {
        'ui:title':
          'Please briefly describe the injury or event that caused your disability.',
        'ui:widget': 'textarea',
        'ui:required': (formData, index) =>
          formData.newDisabilities[index].cause === 'NEW',
        'ui:options': {
          expandUnder: 'cause',
          expandUnderCondition: 'NEW',
        },
      },
      disabilityStartDate: dateUI(
        'Date this injury or event happened (This date doesn’t have to be exact.)',
      ),
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
        required: ['cause', 'disabilityStartDate'],
        properties: {
          cause,
          primaryDisability,
          primaryDescription,
          disabilityStartDate,
        },
      },
    },
  },
};
