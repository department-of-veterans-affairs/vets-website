import React from 'react';
import { useSelector } from 'react-redux';
import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';
import { merge } from 'lodash';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import phoneUI from '../../components/Phone';
import emailUI from '../../definitions/email';
import * as address from '../../definitions/address';
import {
  MailingAddressStateTitle,
  applicantsMailingAddressHasState,
  applicantContactInfoAddressTitle,
  applicantContactInfoSubheader,
  applicantContactInfoDescription,
  bottomPadding,
} from '../../utils/helpers';

const { claimant } = fullSchemaPreNeed.properties.application.properties;

export function DynamicStateSelectFieldApplicant(props) {
  const formData = useSelector(state => state.form.data || {});

  const dynamicLabel = MailingAddressStateTitle({
    elementPath: 'application.claimant.address.country',
    formData,
  });

  const modifiedProps = {
    ...props,
    label: dynamicLabel,
  };

  return <VaSelectField {...modifiedProps} />;
}

export function uiSchema(
  addressTitle = applicantContactInfoAddressTitle,
  contactInfoSubheader = applicantContactInfoSubheader,
  contactInfoDescription = applicantContactInfoDescription,
) {
  return {
    application: {
      claimant: {
        address: merge({}, address.uiSchema(addressTitle), {
          country: {
            'ui:webComponentField': VaSelectField,
            'ui:options': {
              classNames: 'selectNonImposter',
            },
          },
          street: {
            'ui:title': 'Street address',
          },
          street2: {
            'ui:title': 'Street address line 2',
          },
          state: {
            'ui:webComponentField': DynamicStateSelectFieldApplicant,
            'ui:options': {
              hideIf: formData => !applicantsMailingAddressHasState(formData),
              classNames: 'selectNonImposter',
            },
          },
        }),
        'view:contactInfoSubheader': {
          'ui:description': contactInfoSubheader,
          'ui:options': {
            displayEmptyObjectOnReview: true,
          },
        },
        phoneNumber: phoneUI('Phone number'),
        email: emailUI(),
        'view:contactInfoDescription': {
          'ui:description': contactInfoDescription,
          'ui:options': {
            displayEmptyObjectOnReview: true,
          },
        },
        'view:bottomPadding': {
          'ui:description': bottomPadding,
          'ui:options': {
            displayEmptyObjectOnReview: true,
          },
        },
      },
    },
  };
}
export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        claimant: {
          type: 'object',
          required: ['email', 'phoneNumber'],
          properties: {
            address: address.schema(fullSchemaPreNeed, true),
            'view:contactInfoSubheader': {
              type: 'object',
              properties: {},
            },
            phoneNumber: claimant.properties.phoneNumber,
            email: claimant.properties.email,
            'view:contactInfoDescription': {
              type: 'object',
              properties: {},
            },
            'view:bottomPadding': {
              type: 'object',
              properties: {},
            },
          },
        },
      },
    },
  },
};
