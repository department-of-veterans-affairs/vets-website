// @ts-check
import React from 'react';
import {
  textareaSchema,
  textareaUI,
  yesNoUI,
  yesNoSchema,
  titleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { validateWhiteSpace } from 'platform/forms/validations';

/** @type {PageSchema} */
export default {
  uiSchema: {
    acknowledgement10a: {
      ...titleUI('Institution Acknowledgements (4 of 5)'),
      ...descriptionUI(
        <div>
          <p>
            The facility is financially sound and fully capable of meeting its
            obligations related to training activities. As part of this
            application, the facility agrees to submit financial documentation
            that substantiates its financial stability.(Examples of
            documentation may include copies of tax returns, or financial
            reports that reports the financial position of the institution or
            establishment, as prepared by any appropriate third-party entity.
            New facilities are requested to submit 24 months of financial data
            to determine financial soundness. Please contact your Education
            Liaison Representative (ELR)/State Approving Agency (SAA) for
            additional guidance if needed).
          </p>
          <p>
            <strong>Note:</strong> USE Department of Education, Title IV school
            participants are not required to provide financial statement with
            the application.
          </p>
        </div>,
      ),
      financiallySound: {
        ...yesNoUI({
          hideLabelText: true,
          labels: {
            Y:
              'Yes, the institution is capable of fulfilling its commitments for training.',
            N:
              'No, the institution is not capable of fulfilling its commitments for training.',
          },
          errorMessages: {
            required: 'You must make a selection.',
          },
        }),
      },
      financialSoundnessExplanation: {
        ...textareaUI({
          required: formData =>
            formData.acknowledgement10a?.financiallySound === false,
          errorMessages: {
            required:
              'You must specify a reason the institution is not capable of fulfilling its commitments for training.',
          },
        }),
        'ui:validations': [validateWhiteSpace],
        'ui:options': {
          charcount: true,
          hideLabelText: true,
          expandUnder: 'financiallySound',
          expandUnderCondition: false,
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      acknowledgement10a: {
        type: 'object',
        properties: {
          financiallySound: { ...yesNoSchema, title: 'Financially Sound' },
          financialSoundnessExplanation: {
            ...textareaSchema,
            maxLength: 500,
            title: 'Financial Soundness Explanation',
          },
        },
        required: ['financiallySound'],
      },
    },
  },
};
