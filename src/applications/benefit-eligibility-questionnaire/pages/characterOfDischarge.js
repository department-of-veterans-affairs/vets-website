import React from 'react';
import { selectUI } from 'platform/forms-system/src/js/web-component-patterns';
import {
  characterOfDischargeTypes,
  characterOfDischargeTypeLabels,
} from '../constants/benefits';

export default {
  uiSchema: {
    characterOfDischarge: selectUI({
      title:
        'What is the highest character of discharge you have received or expect to receive?',
      hint: `If you served multiple times with different characters of discharge,
      please select the "highest" of your discharge statuses. 
      If you feel your character of discharge is unjust, you can apply for
      a discharge upgrade.`,
      required: () => true,
      errorMessages: {
        required: 'Character of discharge is required',
      },
    }),
    characterOfDischargeTWO: {
      'ui:title': '',
      'ui:description': (
        <>
          <p>
            <a
              target="_blank"
              href="https://www.va.gov/discharge-upgrade-instructions"
              rel="noreferrer"
            >
              Learn more about the discharge upgrade process (opens in a new
              tab)
            </a>{' '}
            <br />
            Not sure about this question? Call us at{' '}
            <va-telephone contact="8006982411" /> (
            <va-telephone tty="true" contact="711">
              TTY:711
            </va-telephone>
            ). We're here 24/7.
          </p>
        </>
      ),
    },
  },
  schema: {
    type: 'object',
    required: ['characterOfDischarge'],
    properties: {
      characterOfDischarge: {
        type: 'string',
        enum: Object.keys(characterOfDischargeTypes),
        enumNames: Object.values(characterOfDischargeTypeLabels),
      },
      characterOfDischargeTWO: { type: 'object', properties: {} },
    },
  },
};
