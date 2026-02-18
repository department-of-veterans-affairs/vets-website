import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import SelectArrayItemsWidget from '../components/SelectArrayItemsWidget';
import {
  disabilityOption,
  disabilitiesClarification,
  ratedDisabilitiesAlert,
} from '../content/ratedDisabilities';

import { increaseOnly, claimingRated } from '../utils';
import { requireRatedDisability } from '../validations';
import ConfirmationRatedDisabilities from '../components/confirmationFields/ConfirmationRatedDisabilities';

const { ratedDisabilities } = fullSchema.properties;

export const uiSchema = {
  'ui:title': 'Rated Disabilities',
  'ui:description':
    'Below are your rated disabilities. Please choose the disability you’re filing for increased compensation because it has gotten worse.',
  ratedDisabilities: {
    'ui:title': ' ',
    'ui:field': 'StringField',
    'ui:widget': SelectArrayItemsWidget,
    'ui:options': {
      showFieldLabel: 'label',
      label: disabilityOption,
      widgetClassNames: 'widget-outline',
      keepInPageOnReview: true,
      // making the customTitle truthy but an empty string (trimmable), so the
      // ObjectField doesn't wrap this content in a <DL> and break accessibility
      customTitle: ' ',
    },
    'ui:validations': [requireRatedDisability],
  },
  'view:disabilitiesClarification': {
    'ui:description': disabilitiesClarification,
  },
  'view:ratedDisabilitiesAlert': {
    'ui:description': ratedDisabilitiesAlert,
    'ui:options': {
      hideIf: formData => !increaseOnly(formData) || claimingRated(formData),
    },
  },
  'ui:confirmationField': ConfirmationRatedDisabilities,
};

export const schema = {
  type: 'object',
  properties: {
    ratedDisabilities,
    'view:disabilitiesClarification': {
      type: 'object',
      properties: {},
    },
    'view:ratedDisabilitiesAlert': {
      type: 'object',
      properties: {},
    },
  },
};
