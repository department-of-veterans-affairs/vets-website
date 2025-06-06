import React from 'react';
import { VaInputTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaInputTelephoneFieldMapping from './vaInputTelephoneFieldMapping';

/**
 * Usage uiSchema:
 * ```
 * internationalPhone: {
 *   'ui:title': 'Phone number',
 *   'ui:description': 'description',
 *   'ui:webComponentField': VaInputTelephone,
 *   'ui:hint': 'hint',
 *   'ui:errorMessages': {
 *     required: 'This is a custom error message.',
 *   },
 *   'ui:options': {
 *     noCountry: true,
 *     header: 'Mobile phone number',
 *   },
 * }
 * ```
 *
 * Usage schema:
 * ```
 * internationalPhone: {
 *   type: 'object',
 *   properties: {
 *     callingCode: { type: 'number', title: 'Calling code' }
 *     countryCode: { type: 'string', title: 'Country code' }
 *     contact: { type: 'string', title: 'Contact' }
 *     isValid: { type: 'boolean', title: 'Is valid' }
 *   }
 * }
 * ```
 * @param {WebComponentFieldProps} props */
export default function VaInputTelephoneField(props) {
  const mappedProps = vaInputTelephoneFieldMapping(props);
  return <VaInputTelephone {...mappedProps} />;
}
