import React from 'react';

export default {
  uiSchema: {
    characterOfDischarge: {
      'ui:title': (
        <>
          <p>
            <b>What was your character of discharge?</b>
          </p>
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
      'ui:widget': 'select',
      'ui:options': {
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
    },
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
        enum: [
          'Honorable',
          'Under Honorable Conditions (General)',
          'Under Honorable Conditions',
          'Dishonorable',
          'Uncharacterized',
          'Bad Conduct',
          "I'm not sure",
        ],
      },
      characterOfDischargeTWO: { type: 'object', properties: {} },
    },
  },
};
