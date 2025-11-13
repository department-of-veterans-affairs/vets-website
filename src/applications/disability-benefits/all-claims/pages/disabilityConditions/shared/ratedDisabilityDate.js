import { useEffect } from 'react';
import {
  arrayBuilderItemSubsequentPageTitleUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  addStyleToShadowDomOnPages,
  backfillCauseForIncreaseRows,
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
  title: 'When did your condition get worse?',
  hint:
    'You can share an approximate date. If your condition started in the winter of 2020, enter December 1, 2020.',
});

/** @returns {PageSchema} */
const ratedDisabilityDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${formData?.ratedDisability || 'service-connected disability'}`,
    ),
    conditionDate: {
      ...baseDateUI,
      // run the effect here
      'ui:description': HideDefaultDateHint,
      'ui:validations': [validateApproximateDate, backfillCauseForIncreaseRows],
    },
    // Aim is to trigger internal VA form field update logic
    _forceFieldBlur: {
      'ui:field': ForceFieldBlur,
    },
  },
  schema: {
    type: 'object',
    properties: {
      conditionDate: currentOrPastDateSchema,
      _forceFieldBlur: { type: 'boolean' }, // Required for ForceFieldBlur to render
    },
  },
};

export default ratedDisabilityDatePage;
