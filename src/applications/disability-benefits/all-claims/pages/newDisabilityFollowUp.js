import React from 'react';
import { createSelector } from 'reselect';
import dateUI from 'us-forms-system/lib/js/definitions/date';

import { getNewDisabilityName } from '../utils';
import disabilityLabels from '../content/disabilityLabels';

import fullSchema from '../config/schema';

const {
  cause,
  primaryDisability,
  mistreatmentDescription,
  disabilityStartDate
} = fullSchema.properties.newDisabilities.items.properties;

export const disabilityNameTitle = ({ formData }) => {
  return (
    <legend className="schemaform-block-title schemaform-title-underline">{getNewDisabilityName(formData.diagnosticCode)}</legend>
  );
};

export const uiSchema = {
  newDisabilities: {
    items: {
      'ui:title': disabilityNameTitle,
      cause: {
        'ui:title': '',
        'ui:widget': 'radio',
        'ui:options': {
          labels: {
            NEW: 'My disability was caused by—or got worse because of—an injury or exposure during my service in the military.',
            SECONDARY: 'My disability was caused by another disability (for example, I have a limp that caused a bad back).',
            VA: 'My disability was caused by VA mistreatment.'
          },
          updateSchema: (formData, causeSchema, causeUISchema, index) => {
            return {
              title: `Please tell us what caused your ${disabilityLabels[formData.newDisabilities[index].diagnosticCode]}`
            };
          }
        }
      },
      primaryDisability: {
        'ui:title': 'Which disability caused the disability you’re claiming here?',
        'ui:required': (formData, index) => formData.newDisabilities[index].cause === 'SECONDARY',
        'ui:options': {
          expandUnder: 'cause',
          expandUnderCondition: 'SECONDARY',
          updateSchema: createSelector(
            formData => formData.ratedDisabilities,
            formData => formData.newDisabilities,
            (formData, primarySchema, primaryUISchema, index) => index,
            (disabilities = [], newDisabilities, currentIndex) => {
              const newDisabilitiesWithoutCurrent = newDisabilities.filter((item, index) => index !== currentIndex);
              return {
                'enum': disabilities.map(disability => disability.diagnosticCode)
                  .concat(newDisabilitiesWithoutCurrent.map(disability => disability.diagnosticCode)),
                enumNames: disabilities.map(disability => disability.name)
                  .concat(newDisabilitiesWithoutCurrent.map(disability => getNewDisabilityName(disability.diagnosticCode))),
              };
            }
          )
        }
      },
      mistreatmentDescription: {
        'ui:title': 'Please describe the VA mistreatment that caused your disability',
        'ui:required': (formData, index) => formData.newDisabilities[index].cause === 'VA',
        'ui:options': {
          expandUnder: 'cause',
          expandUnderCondition: 'VA'
        }
      },
      disabilityStartDate: dateUI(
        'Date your disability began or got worse (This date doesn’t have to be exact.)'
      )
    }
  }
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
          primaryDisability,
          mistreatmentDescription,
          disabilityStartDate
        }
      }
    }
  }
};
