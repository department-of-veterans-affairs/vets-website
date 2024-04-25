import React from 'react';
import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';
import { useSelector } from 'react-redux';
import { merge } from 'lodash';
import * as address from '../../definitions/address';
import {
  isVeteran,
  MailingAddressStateTitle,
  sponsorMailingAddressHasState,
  applicantContactInfoDescriptionVet,
  applicantContactInfoDescriptionNonVet,
} from '../../utils/helpers';

export const sponsorMailingAddressStateTitleWrapper = (
  <MailingAddressStateTitle elementPath="application.veteran.address.country" />
);

export const applicantContactInfoWrapper = <ApplicantContactInfoDescription />;

function ApplicantContactInfoDescription() {
  const data = useSelector(state => state.form.data || {});
  return isVeteran(data)
    ? applicantContactInfoDescriptionVet
    : applicantContactInfoDescriptionNonVet;
}

export const uiSchema = {
  application: {
    veteran: {
      address: merge({}, address.uiSchema('Sponsor’s mailing address'), {
        street: {
          'ui:title': 'Street address',
        },
        street2: {
          'ui:title': 'Street address line 2',
        },
        state: {
          'ui:title': sponsorMailingAddressStateTitleWrapper,
          'ui:options': {
            hideIf: formData => !sponsorMailingAddressHasState(formData),
          },
        },
      }),
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        veteran: {
          type: 'object',
          properties: {
            address: address.schema(fullSchemaPreNeed),
          },
        },
      },
    },
  },
};
