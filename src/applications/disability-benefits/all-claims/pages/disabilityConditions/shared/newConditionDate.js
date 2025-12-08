import { useEffect } from 'react';
import {
  arrayBuilderItemSubsequentPageTitleUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { createNewConditionName } from '../../../content/disabilityConditions';

import {
  addStyleToShadowDomOnPages,
  ForceFieldBlur,
  validateApproximateDate,
} from './utils';

// Hides the built-in “For example: January 19 2000”
const HideDefaultDateHint = () => {
  useEffect(() => {
    // Inject the style into every <va-memorable-date> on the page
    addStyleToShadowDomOnPages(
      [''],
      ['va-memorable-date'],
      '#dateHint {display:none}',
    );
  }, []);

  return null; // nothing visual – side-effect only
};

const baseDateUI = currentOrPastDateUI({
  title: 'When did your condition start?',
  hint:
    'You can share an approximate date. If your back pain started in the winter of 2020, enter December 1, 2020.',
});

/** @type {PageSchema} */
const newConditionDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) => createNewConditionName(formData, true),
      undefined,
      false,
    ),

    conditionDate: {
      ...baseDateUI,
      // run the effect here
      'ui:description': HideDefaultDateHint,
      'ui:validations': [validateApproximateDate],
    },

    _forceFieldBlur: {
      'ui:field': ForceFieldBlur,
    },
  },

  schema: {
    type: 'object',
    properties: {
      conditionDate: currentOrPastDateSchema,
      _forceFieldBlur: { type: 'boolean' },
    },
  },
};

export default newConditionDatePage;
