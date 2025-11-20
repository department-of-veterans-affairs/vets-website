import React from 'react';
import { useSelector } from 'react-redux';
import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';
import { merge } from 'lodash';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import * as address from '../../definitions/address';
import {
  MailingAddressStateTitle,
  applicantsMailingAddressHasState,
  applicantContactInfoAddressTitle,
} from '../../utils/helpers';

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
  addressDescription = null,
) {
  return {
    application: {
      claimant: {
        address: merge({}, address.uiSchema(addressTitle, addressDescription), {
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
          properties: {
            address: address.schema(fullSchemaPreNeed, true),
          },
        },
      },
    },
  },
};
