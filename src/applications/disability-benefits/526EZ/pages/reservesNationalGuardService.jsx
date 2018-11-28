import fullSchema526EZ from 'vets-json-schema/dist/21-526EZ-schema.json';
// import fullSchema526EZ from '/local/path/vets-json-schema/dist/21-526EZ-schema.json';
import _ from 'lodash/fp';

import dateUI from 'us-forms-system/lib/js/definitions/date';
import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';
import { ReservesGuardDescription, isInFuture } from '../../all-claims/utils';

import { title10DatesRequired } from '../helpers';

const {
  reservesNationalGuardService,
} = fullSchema526EZ.properties.serviceInformation.properties;

export const uiSchema = {
  'ui:order': [
    'unitName',
    'obligationTermOfServiceDateRange',
    'view:isTitle10Activated',
    'title10Activation',
    'waiveVABenefitsToRetainTrainingPay',
  ],
  'ui:title': 'Reserves and National Guard Information',
  'ui:description': ReservesGuardDescription,
  unitName: {
    'ui:title': 'Unit name',
  },
  obligationTermOfServiceDateRange: dateRangeUI(
    'Obligation start date',
    'Obligation end date',
    'End date must be after start date',
  ),
  'view:isTitle10Activated': {
    'ui:title': "I'm currently activated on federal orders",
  },
  title10Activation: {
    'ui:options': {
      expandUnder: 'view:isTitle10Activated',
    },
    title10ActivationDate: _.merge(dateUI('Activation date'), {
      'ui:required': title10DatesRequired,
    }),
    anticipatedSeparationDate: _.merge(dateUI('Expected separation date'), {
      'ui:validations': [isInFuture],
      'ui:required': title10DatesRequired,
    }),
  },
  waiveVABenefitsToRetainTrainingPay: {
    'ui:title':
      'I choose to waive VA compensation pay for the days I receive inactive duty training pay, so I can keep my inactive duty training pay.',
    'ui:widget': 'yesNo',
  },
};

export const schema = _.merge(reservesNationalGuardService, {
  properties: {
    'view:isTitle10Activated': { type: 'boolean' },
  },
});
