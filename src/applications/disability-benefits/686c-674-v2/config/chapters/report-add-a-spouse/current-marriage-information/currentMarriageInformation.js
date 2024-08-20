import React from 'react';
import {
  titleUI,
  // textUI,
  // textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
// import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
// import { customLocationSchema } from '../../../helpers';
import CustomLocation from '../../../../components/CustomLocation';

// export const schema = {
//   type: 'object',
//   properties: {
//     currentMarriageInformation: customLocationSchema,
//   },
// };

export const schema = {
  type: 'object',
  properties: {
    currentMarriageInformation: {
      type: 'object',
      properties: {
        outsideUsa: {
          type: 'boolean',
        },
        location: {
          type: 'object',
          properties: {
            city: {
              type: 'string',
            },
            state: {
              type: 'object',
              properties: {},
            },
          },
        },
      },
    },
  },
};

export const uiSchema = {
  currentMarriageInformation: {
    ...titleUI('Where did you get married?'),
    outsideUsa: {
      'ui:title': 'I got married outside the U.S.',
      'ui:webComponentField': VaCheckboxField,
    },
    location: {
      city: {
        'ui:title': 'City',
        'ui:required': () => true,
        'ui:autocomplete': 'address-level2',
        'ui:errorMessages': {
          required: 'Enter the city where you were married',
        },
        'ui:webComponentField': VaTextInputField,
      },
      // state: {
      //   'ui:title': 'State',
      //   'ui:webComponentField': VaSelectField,
      //   'ui:required': formData =>
      //     !formData?.currentMarriageInformation?.outsideUsa,
      //   'ui:errorMessages': {
      //     required: 'Select a state',
      //   },
      //   'ui:options': {
      //     updateSchema: (formData, _schema, _uiSchema) => {
      //       const updatedSchemaUI = _uiSchema;
      //       const location = formData?.currentMarriageInformation?.location;
      //       const outsideUsa = formData?.currentMarriageInformation?.outsideUsa;

      //       if (outsideUsa) {
      //         updatedSchemaUI['ui:options'].inert = true;
      //         location.state = undefined;
      //         return _schema;
      //       }

      //       updatedSchemaUI['ui:options'].inert = false;
      //       return _schema;
      //     },
      //   },
      // },

      state: {
        'ui:description': <CustomLocation />,
      },
    },
  },
};
