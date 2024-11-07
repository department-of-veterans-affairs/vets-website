import { validateCurrentOrPastMemorableDate } from 'platform/forms-system/src/js/validation.js';
import VaMemorableDateField from 'platform/forms-system/src/js/web-component-fields/VaMemorableDateField';
import {
  currentOrPastDateSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import React from 'react';
import { CHAPTER_3 } from '../../../constants';

const deathDatePage = {
  uiSchema: {
    ...titleUI(CHAPTER_3.DEATH_DATE.TITLE),
    dateOfDeath: {
      'ui:webComponentField': VaMemorableDateField,
      'ui:validations': [validateCurrentOrPastMemorableDate],
      'ui:errorMessages': {
        pattern: 'Please enter a valid current or past date',
        required: 'Please enter a date',
      },
      'ui:options': {
        hideLabelText: true,
        labelHeaderLevel: '3',
      },
      'ui:reviewField': ({ children }) => (
        <div className="review-row">
          <dt>{CHAPTER_3.DEATH_DATE.TITLE}</dt>
          <dd>
            {children.props.formData && (
              <>
                {new Date(
                  `${children.props.formData}T00:00:00`,
                ).toLocaleDateString('en-us', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </>
            )}
          </dd>
        </div>
      ),
    },
  },

  schema: {
    type: 'object',
    required: ['dateOfDeath'],
    properties: { dateOfDeath: currentOrPastDateSchema },
  },
};

export default deathDatePage;
