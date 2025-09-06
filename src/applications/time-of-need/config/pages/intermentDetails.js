import React from 'react';
import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import AutoSaveNotice from '../../components/AutoSaveNotice';

// Radio option values
const REMAINS_OPTIONS = {
  CASKET: 'casket',
  CREMAINS: 'cremains',
  NO_REMAINS: 'noRemains',
};

const YES_NO_UNKNOWN = {
  YES: 'yes',
  NO: 'no',
  UNKNOWN: 'unknown',
};

export default {
  uiSchema: {
    // Show AutoSave notice BEFORE the page heading
    'ui:description': (
      <>
        <AutoSaveNotice />
        <h3 className="vads-u-margin-top--0">Interment details</h3>
      </>
    ),

    remainsType: radioUI({
      title: 'Type of remains',
      labels: {
        [REMAINS_OPTIONS.CASKET]: 'Casket',
        [REMAINS_OPTIONS.CREMAINS]: 'Cremains (cremated)',
        [REMAINS_OPTIONS.NO_REMAINS]: 'No remains',
      },
      errorMessages: { required: 'Select the type of remains' },
    }),

    convictedSexualOffense: radioUI({
      title: 'Has the deceased been convicted of a sexual offense?',
      labels: {
        [YES_NO_UNKNOWN.YES]: 'Yes',
        [YES_NO_UNKNOWN.NO]: 'No',
        [YES_NO_UNKNOWN.UNKNOWN]: 'I don’t know',
      },
      errorMessages: { required: 'Select an option' },
    }),

    capitalCrime: radioUI({
      title: 'Has the deceased committed a capital crime?',
      labels: {
        [YES_NO_UNKNOWN.YES]: 'Yes',
        [YES_NO_UNKNOWN.NO]: 'No',
        [YES_NO_UNKNOWN.UNKNOWN]: 'I don’t know',
      },
      errorMessages: { required: 'Select an option' },
    }),

    'view:capitalCrimeHelp': {
      'ui:description': (
        <va-additional-info trigger="What is a capital crime?">
          <p className="vads-u-margin--0">
            A capital crime is an offense for which a sentence of imprisonment
            for life or the death penalty may be imposed.
          </p>
        </va-additional-info>
      ),
    },
  },

  schema: {
    type: 'object',
    properties: {
      remainsType: radioSchema(Object.values(REMAINS_OPTIONS)),
      convictedSexualOffense: radioSchema(Object.values(YES_NO_UNKNOWN)),
      capitalCrime: radioSchema(Object.values(YES_NO_UNKNOWN)),
      'view:capitalCrimeHelp': {
        type: 'object',
        properties: {},
      },
    },
    required: ['remainsType', 'convictedSexualOffense', 'capitalCrime'],
  },
};
