import React from 'react';

const CHARACTER_OF_DISCHARGE = [
  'Honorable',
  'Under Honorable Conditions (General)',
  'Under Honorable Conditions',
  'Dishonorable',
  'Uncharacterized',
  'Bad Conduct',
  "I'm not sure",
];

export default {
  uiSchema: {
    // 'view:characterOfDischarge': {
    characterOfDischarge: {
      'ui:title': (
        <>
          <p>
            <b>What was your character of discharge?</b>
            <span className="schemaform-required-span">(*Required)</span>
          </p>
        </>
      ),
      'ui:description': (
        <>
          <p>
            If you served multiple titles with different characters of
            discharge, please select the "highest" of your discharge statuses.
          </p>
          <p>
            If you feel your character of discharge is unjust, you can apply for
            a discharge upgrade.
          </p>
        </>
      ),
      // 'ui:webComponentField': VaSelectField,
      'ui:widget': 'select',
      'ui:options': {
        placeholder: 'Select',

        widgetProps: {
          honorable: { characterOfDischarge: 'Honorable' },
          underHonorableConditionsGeneral: {
            characterOfDischarge: 'Under Honorable Conditions (General)',
          },
          underHonorableConditions: {
            characterOfDischarge: 'Under Honorable Conditions',
          },
          dishonorable: { characterOfDischarge: 'Dishonorable' },
          uncharacterized: { characterOfDischarge: 'Uncharacterized' },
          badConduct: { characterOfDischarge: 'Bad Conduct' },
          notSure: { characterOfDischarge: "I'm not sure" },
        },
      },
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'Character of discharge is required',
      },
    },
    // },
    characterOfDischargeTWO: {
      'ui:title': '',
      'ui:description': (
        <>
          <p>
            <a href="https://www.va.gov/discharge-upgrade-instructions">
              Learn more about the discharge upgrade process.
            </a>
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
    properties: {
      characterOfDischarge: {
        type: 'string',
        enum: CHARACTER_OF_DISCHARGE,
      },
      characterOfDischargeTWO: { type: 'object', properties: {} },
    },
  },
};
