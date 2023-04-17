import React from 'react';
import {
  preparerIdentificationFields,
  relationshipToVeteranEnum,
} from '../definitions/constants';

export default {
  uiSchema: {
    [preparerIdentificationFields.parentObject]: {
      'ui:title': (
        <h3 className="vads-u-color--gray-dark vads-u-margin-top--0">
          Who is submitting this authorization?
        </h3>
      ),
      [preparerIdentificationFields.relationshipToVeteran]: {
        'ui:title': (
          <p className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
            Relationship to Veteran
          </p>
        ),
        'ui:widget': 'radio',
      },
      other: {
        'ui:title': (
          <p className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
            If your relationship with the Veteran is not listed, you can write
            it here
          </p>
        ),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
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
    },
  },
};
