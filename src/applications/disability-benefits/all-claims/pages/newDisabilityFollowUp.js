import React from 'react';
import { createSelector } from 'reselect';
import dateUI from 'us-forms-system/lib/js/definitions/date';

import { getDisabilityName } from '../utils';
import disabilityLabels from '../content/disabilityLabels';

import fullSchema from '../config/schema';
import { CauseTitle } from '../content/newDisabilityFollowUp';

const {
  cause,
  causedByDisability,
  causedByDisabilityDescription,
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

// const allCauses = cause.enum;
// const causesWithoutSecondary = allCauses.filter(
//   causeCode => causeCode !== 'SECONDARY',
// );

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
            PREEXISTING:
              'My disability or condition existed before I served in the military, but it got worse because of my military service.',
            VA:
              'My disability was caused by an injury or event that happened when I was receiving VA care.',
          },
          // updateSchema: (formData, causeSchema, causeUISchema, index) => ({
          //   enum: getDisabilitiesList(formData, index).length
          //     ? allCauses
          //     : causesWithoutSecondary,
          // }),
        },
      },
      primaryDescription: {
        'ui:title':
          'Please briefly describe the injury or exposure that caused your condition. (For example, I operated loud machinery while in the Army, and this caused me to lose my hearing.)',
        'ui:widget': 'textarea',
        'ui:required': (formData, index) =>
          formData.newDisabilities[index].cause === 'NEW',
        'ui:options': {
          expandUnder: 'cause',
          expandUnderCondition: 'NEW',
        },
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
            'Please briefly describe how {other disability selected} caused your new disability.',
          'ui:widget': 'textarea',
          'ui:required': (formData, index) =>
            formData.newDisabilities[index].cause === 'SECONDARY' &&
            getDisabilitiesList(formData, index).length > 0,
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
          primaryDescription,
          'view:secondaryFollowUp': {
            type: 'object',
            properties: {
              causedByDisability,
              causedByDisabilityDescription,
            },
          },
          disabilityStartDate,
        },
      },
    },
  },
};
