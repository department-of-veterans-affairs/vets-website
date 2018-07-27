import fullSchema526EZ from 'vets-json-schema/dist/21-526EZ-schema.json';
// import fullSchema526EZ from '/local/path/vets-json-schema/dist/21-526EZ-schema.json';
import _ from 'lodash/fp';

import dateUI from 'us-forms-system/lib/js/definitions/date';
import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';
import { ReservesGuardDescription } from '../helpers';

const { reservesNationalGuardService } = fullSchema526EZ.properties.serviceInformation.properties;

const title10DatesRequired = {
  'ui:required': (formData) => {
    return _.get('view:isTitle10Activated', formData, false);
  }
};

export const uiSchema = {
  'ui:order': [
    'unitName',
    'obligationTermOfServiceDateRange',
    'view:isTitle10Activated',
    'title10Activation',
    'waiveVABenefitsToRetainTrainingPay'
  ],
  'ui:title': 'Reserves and National Guard Information',
  'ui:description': ReservesGuardDescription,
  unitName: {
    'ui:title': 'Unit Name',
  },
  obligationTermOfServiceDateRange: dateRangeUI(
    'Obligation Start Date',
    'Obligation End Date',
    'End date must be after start date'
  ),
  'view:isTitle10Activated': {
    'ui:title': 'I am currently activated on Federal orders'
  },
  title10Activation: {
    'ui:options': {
      expandUnder: 'view:isTitle10Activated',
    },
    title10ActivationDate: _.merge(dateUI('Activation Date'), title10DatesRequired),
    // TODO: validate that separation date is in the future?
    anticipatedSeparationDate: _.merge(dateUI('Anticipated Separation Date'), title10DatesRequired),
  },
  waiveVABenefitsToRetainTrainingPay: {
    'ui:title': 'I elect to waive VA benefits for the days I accrued inactive duty training pay in order to retain my inactive duty training pay.',
    'ui:widget': 'yesNo'
  }
};

export const schema = _.merge(reservesNationalGuardService, {
  properties: {
    'view:isTitle10Activated': { type: 'boolean' }
  }
});
