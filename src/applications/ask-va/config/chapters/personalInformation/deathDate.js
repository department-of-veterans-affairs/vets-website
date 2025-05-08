import React from 'react';
import { validateCurrentOrPastMemorableDate } from '@department-of-veterans-affairs/platform-forms-system/validation';
import {
  titleUI,
  dateOfDeathUI,
  dateOfDeathSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { CHAPTER_3 } from '../../../constants';

const deathDatePage = {
  uiSchema: {
    ...titleUI(CHAPTER_3.DEATH_DATE.TITLE),
    dateOfDeath: {
      ...dateOfDeathUI(CHAPTER_3.DEATH_DATE.TITLE),
      'ui:validations': [validateCurrentOrPastMemorableDate],
      'ui:errorMessages': {
        required: 'Please enter the date of death',
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
    properties: {
      dateOfDeath: dateOfDeathSchema,
    },
  },
};

export default deathDatePage;
