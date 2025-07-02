import React from 'react';
import environment from 'platform/utilities/environment';
import {
  radioSchema,
  radioUI,
  textSchema,
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  preparerIdentificationFields,
  relationshipToVeteranEnum,
  relationshipToVeteranLabels,
} from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: environment.isProduction()
    ? {
        [preparerIdentificationFields.parentObject]: {
          'ui:title': (
            <h3 className="vads-u-color--gray-dark vads-u-margin-top--0">
              Who is submitting this authorization?
            </h3>
          ),
          [preparerIdentificationFields.relationshipToVeteran]: {
            'ui:title': (
              <p className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
                Select your relationship to the Veteran
              </p>
            ),
            'ui:widget': 'radio',
          },
          other: {
            'ui:title': (
              <p className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
                If your relationship with the Veteran isn't listed, describe
                your relationship here
              </p>
            ),
            'ui:options': {
              hideEmptyValueInReview: true,
            },
          },
        },
      }
    : {
        [preparerIdentificationFields.parentObject]: {
          ...titleUI('Who is submitting this authorization?'),
          [preparerIdentificationFields.relationshipToVeteran]: radioUI({
            title: 'Relationship to Veteran',
            labels: relationshipToVeteranLabels,
          }),
          other: textUI({
            title:
              'If your relationship with the Veteran is not listed, you can write it here',
            hideEmptyValueInReview: true,
          }),
        },
      },
  schema: {
    type: 'object',
    properties: environment.isProduction()
      ? {
          [preparerIdentificationFields.parentObject]: {
            type: 'object',
            properties: {
              [preparerIdentificationFields.relationshipToVeteran]: {
                type: 'string',
                enum: relationshipToVeteranEnum,
              },
              other: {
                type: 'string',
              },
            },
          },
        }
      : {
          [preparerIdentificationFields.parentObject]: {
            type: 'object',
            properties: {
              [preparerIdentificationFields.relationshipToVeteran]: radioSchema(
                Object.values(relationshipToVeteranLabels),
              ),
              other: textSchema,
            },
          },
        },
  },
};
