import fullSchema1995 from 'vets-json-schema/dist/22-1995-schema.json';
import set from 'platform/utilities/data/set';
import get from 'platform/utilities/data/get';
import * as toursOfDuty from '../../definitions/toursOfDuty';

const { applicantServed, isActiveDuty } = fullSchema1995.properties;

export const schema = {
  type: 'object',
  properties: {
    applicantServed,
    isActiveDuty,
    'view:newService': {
      type: 'boolean',
    },
    toursOfDuty: toursOfDuty.schema(fullSchema1995, {
      fields: ['serviceBranch', 'dateRange'],
      required: ['serviceBranch', 'dateRange.from', 'dateRange.to'],
    }),
  },
};

export const isFieldRequired = formData => {
  return formData.applicantServed === 'Yes';
};

export const isFieldHidden = formData => {
  return formData.applicantServed !== 'Yes';
};

export const setDateRangeRequired = (formData, _schema) => {
  if (isFieldRequired(formData) && get('isActiveDuty', formData)) {
    return set(
      'additionalItems.properties.dateRange.required',
      ['from'],
      _schema,
    );
  }
  if (isFieldRequired(formData) && get('isActiveDuty', formData) === false) {
    return set(
      'additionalItems.properties.dateRange.required',
      ['from', 'to'],
      _schema,
    );
  }
  return set('additionalItems.properties.dateRange.required', [], _schema);
};

export const setServiceBranchRequired = (formData, _schema) => {
  if (isFieldRequired(formData)) {
    return set('additionalItems.required', ['serviceBranch'], _schema);
  }
  return set('additionalItems.required', [], _schema);
};

export const uiSchema = {
  applicantServed: {
    'ui:widget': 'radio',
    'ui:title': 'Have you ever served in the armed forces?',
    'ui:required': formData => formData,
  },
  isActiveDuty: {
    'ui:title': 'Are you on active duty now?',
    'ui:widget': 'yesNo',
    'ui:required': formData => isFieldRequired(formData),
    'ui:options': {
      hideIf: formData => isFieldHidden(formData),
    },
  },
  'view:newService': {
    'ui:title':
      'Do you have any new periods of service to record since you last applied for education benefits?',
    'ui:widget': 'yesNo',
    'ui:required': formData => isFieldRequired(formData),
    'ui:options': {
      hideIf: formData => isFieldHidden(formData),
      widgetProps: {
        Y: { 'data-info': 'yes' },
        N: { 'data-info': 'no' },
      },
      // Only added to the radio when it is selected
      // a11y requirement: aria-describedby ID's *must* exist on the page;
      // and we conditionally add content based on the selection
      selectedProps: {
        Y: {
          'aria-describedby': 'root_view:newService-label',
        },
        // this ID doesn't exist, setting this would cause an axe error
        // N: { 'aria-describedby': 'different_id' },
      },
    },
  },
  toursOfDuty: {
    ...toursOfDuty.uiSchema,
    'ui:options': {
      ...toursOfDuty.uiSchema['ui:options'],
      expandUnder: 'view:newService',
      updateSchema: (formData, _schema) => {
        let finalSchema = { ..._schema };
        finalSchema = setDateRangeRequired(formData, finalSchema);
        finalSchema = setServiceBranchRequired(formData, finalSchema);
        return finalSchema;
      },
    },
    'ui:required': formData => get('view:newService', formData),
  },
};
