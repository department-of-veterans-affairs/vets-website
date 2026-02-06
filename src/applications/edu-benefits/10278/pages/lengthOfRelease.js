import React from 'react';
import {
  radioUI,
  radioSchema,
  titleUI,
  descriptionUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { validateCurrentOrPastDate } from '~/platform/forms-system/src/js/validation';
import { DISCLOSURE_OPTIONS } from '../helpers';

const uiSchema = {
  ...titleUI('Length for the release of personal information'),
  ...descriptionUI(({ formData }) => {
    const claimInformation = formData?.claimInformation;
    const claimInformationKeys = Object.keys(claimInformation);

    const claimInformationLabels = claimInformationKeys
      .filter(key => key !== 'otherText')
      .map(key => {
        let label;
        if (key === 'minor') {
          label = 'Change of address or direct deposit (minor claimants only)';
        } else if (key === 'other') {
          label = `Other: ${claimInformation.otherText}`;
        } else {
          label = DISCLOSURE_OPTIONS[key];
        }
        return <li key={key}>{label}</li>;
      });
    return (
      <va-card background>
        <div>
          <h3 className="vads-u-margin-top--0">
            Here’s the personal information you selected:
          </h3>
          <ul>{claimInformationLabels}</ul>
        </div>
      </va-card>
    );
  }),
  lengthOfRelease: {
    duration: radioUI({
      title:
        'Select how long you want us to release your personal information.',
      labels: {
        ongoing: 'Ongoing until you give us a written notice to terminate',
        date:
          'From the date you submit this form to the date you choose to terminate',
      },
      errorMessages: {
        required: 'You must provide an answer',
      },
    }),
    date: {
      ...currentOrPastDateUI({
        title: 'Date of termination',
        hint: "This date can't be in the past",
        expandUnder: 'duration',
        monthSelect: false,
        removeDateHint: true,
        errorMessages: {
          required: 'Enter the date of the termination',
        },
        expandUnderCondition: value => value === 'date',
        required: formData => formData?.lengthOfRelease?.duration === 'date',
      }),
      'ui:validations': [validateCurrentOrPastDate],
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    lengthOfRelease: {
      type: 'object',
      properties: {
        duration: radioSchema(['ongoing', 'date']),
        date: currentOrPastDateSchema,
      },
      required: ['duration'],
    },
  },
};

export { schema, uiSchema };
