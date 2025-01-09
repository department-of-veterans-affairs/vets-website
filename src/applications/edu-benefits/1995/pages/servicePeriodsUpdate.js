import fullSchema1995 from 'vets-json-schema/dist/22-1995-schema.json';

const { applicantServed, isActiveDuty } = fullSchema1995.properties;

export const schema = {
  type: 'object',
  properties: {
    applicantServed,
    isActiveDuty,
    'view:newService': {
      type: 'boolean',
    },
  },
};

export const isFieldRequired = formData => {
  return formData.applicantServed === 'Yes';
};

export const isFieldHidden = formData => {
  return formData.applicantServed !== 'Yes';
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
};
