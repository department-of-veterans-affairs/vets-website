import { validateCurrentOrPastMemorableDate } from 'platform/forms-system/src/js/validation.js';
import VaMemorableDateField from 'platform/forms-system/src/js/web-component-fields/VaMemorableDateField';
import { currentOrPastDateSchema } from 'platform/forms-system/src/js/web-component-patterns';
import React from 'react';
import { CHAPTER_3 } from '../../../constants';

const questionTitle = (
  <>
    <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--0  vads-u-color--base">
      {CHAPTER_3.DEATH_DATE.TITLE}
    </h3>
  </>
);

const deathDatePage = {
  uiSchema: {
    'ui:title': questionTitle,
    dateOfDeath: {
      'ui:webComponentField': VaMemorableDateField,
      'ui:validations': [validateCurrentOrPastMemorableDate],
      'ui:errorMessages': {
        pattern: 'Please enter a valid current or past date',
        required: 'Please enter a date',
      },
      'ui:options': {
        hideLabelText: true,
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
