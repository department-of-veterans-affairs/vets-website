import React from 'react';
import { useSelector } from 'react-redux';
import { merge } from 'lodash';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';

import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';
import get from 'platform/utilities/data/get';

import * as address from '../../definitions/address';

import phoneUI from '../../components/Phone';
import emailUI from '../../definitions/email';

import {
  isAuthorizedAgent,
  preparerAddressHasState,
  MailingAddressStateTitle,
  PreparerPhoneNumberDescription,
} from '../../utils/helpers';
import {
  ContactDetailsTitle,
  MailingAddressTitle,
} from '../../components/PreparerHelpers';

const { applicant } = fullSchemaPreNeed.properties.application.properties;

export function DynamicStateSelectFieldPreparer(props) {
  const formData = useSelector(state => state.form.data || {});

  const dynamicLabel = MailingAddressStateTitle({
    elementPath:
      'application.applicant.view:applicantInfo.mailingAddress.country',
    formData,
  });

  const modifiedProps = {
    ...props,
    label: dynamicLabel,
  };

  return <VaSelectField {...modifiedProps} />;
}

export const uiSchema = {
  application: {
    applicant: {
      'view:applicantInfo': {
        mailingAddress: merge({}, address.uiSchema(MailingAddressTitle), {
          country: {
            'ui:webComponentField': VaSelectField,
            'ui:options': {
              classNames: 'selectNonImposter',
            },
            'ui:required': isAuthorizedAgent,
            'ui:errorMessages': {
              required: 'Select Country',
            },
          },
          street: {
            'ui:title': 'Street address',
            'ui:required': isAuthorizedAgent,
            'ui:errorMessages': {
              required: 'Enter a street address',
            },
          },
          street2: {
            'ui:title': 'Street address line 2',
          },
          city: {
            'ui:required': isAuthorizedAgent,
            'ui:errorMessages': {
              required: 'Enter a city',
            },
          },
          state: {
            'ui:webComponentField': DynamicStateSelectFieldPreparer,
            'ui:required': isAuthorizedAgent,
            'ui:options': {
              hideIf: formData => !preparerAddressHasState(formData),
              classNames: 'selectNonImposter',
            },
            'ui:errorMessages': {
              enum: 'Select a state or territory',
            },
          },
          postalCode: {
            'ui:required': isAuthorizedAgent,
            'ui:errorMessages': {
              required: 'Enter a postal code',
            },
            'ui:options': {
              replaceSchema: (formData, _schema, _uiSchema, index, path) => {
                const addressPath = path.slice(0, -1);
                const data = get(addressPath, formData) ?? {};
                const { country } = data;
                const addressSchema = _schema;
                const addressUiSchema = _uiSchema;

                // country-specific error messages
                if (country === 'USA') {
                  addressUiSchema['ui:errorMessages'] = {
                    required: 'Please provide a valid postal code',
                  };
                } else if (['CAN', 'MEX'].includes(country) || !country) {
                  addressUiSchema['ui:errorMessages'] = {
                    required: 'Enter a postal code',
                  };
                } else {
                  // no pattern validation for other countries
                  addressUiSchema['ui:errorMessages'] = {
                    required:
                      'Enter a postal code that meets your country’s requirements. If your country doesn’t require a postal code, enter N/A.',
                  };
                }

                return {
                  ...addressSchema,
                };
              },
            },
          },
        }),
      },
      'view:contactInfo': {
        'ui:title': ContactDetailsTitle,
        applicantPhoneNumber: merge({}, phoneUI('Phone number'), {
          'ui:required': isAuthorizedAgent,
        }),
        applicantEmail: merge({}, emailUI(), {
          'ui:required': isAuthorizedAgent,
        }),
        'view:contactInfoDescription': {
          'ui:description': PreparerPhoneNumberDescription,
          'ui:options': {
            displayEmptyObjectOnReview: true,
          },
        },
      },
    },
  },
  'ui:options': {
    itemName: 'Your Contact Details',
  },
};
export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        applicant: {
          type: 'object',
          properties: {
            'view:applicantInfo': {
              type: 'object',
              properties: {
                mailingAddress: address.schema(fullSchemaPreNeed),
              },
            },
            'view:contactInfo': {
              type: 'object',
              properties: {
                applicantPhoneNumber: applicant.properties.applicantPhoneNumber,
                applicantEmail: applicant.properties.applicantEmail,
                'view:contactInfoDescription': {
                  type: 'object',
                  properties: {},
                },
              },
            },
          },
        },
      },
    },
  },
};
