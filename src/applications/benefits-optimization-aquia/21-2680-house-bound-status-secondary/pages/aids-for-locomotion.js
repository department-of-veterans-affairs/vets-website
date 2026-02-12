/**
 * @module pages/aids-for-locomotion
 * @description Standard form system configuration for Aids for Locomotion page
 * VA Form 21-2680 - House Bound Status (Medical Professional)
 *
 * Collects whether aids are required for locomotion, the distance
 * the patient can travel, and an optional custom distance specification.
 * "Other" in the distance radio group conditionally reveals a textarea.
 */

import {
  yesNoUI,
  yesNoSchema,
  radioUI,
  radioSchema,
  textareaUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** Textarea config for specifying distance, revealed when "Other" is selected */
const distanceTextarea = textareaUI({
  title: 'Specify distance',
});

/**
 * uiSchema for Aids for Locomotion page
 * Yes/No radio, distance radio, and textarea conditionally revealed by "Other"
 */
export const aidsForLocomotionUiSchema = {
  'ui:title': 'Aids for locomotion',
  requiresAids: yesNoUI({
    title:
      'Are aids such as canes, braces, crutches, or the assistance of another person required for locomotion?',
    required: () => true,
    errorMessages: {
      required: 'Please select yes or no',
    },
  }),
  locomotionDistance: radioUI({
    title: 'If yes, check the applicable box or specify the distance',
    labels: {
      oneBlock: '1 block',
      fiveOrSixBlocks: '5 or 6 blocks',
      oneMile: '1 mile',
      other: 'Other',
    },
  }),
  locomotionDistanceSpecify: {
    ...distanceTextarea,
    'ui:options': {
      ...distanceTextarea['ui:options'],
      expandUnder: 'locomotionDistance',
      expandUnderCondition: 'other',
      expandedContentFocus: true,
    },
  },
};

/**
 * JSON Schema for Aids for Locomotion page
 * Validates aids requirement, distance selection, and optional distance text
 */
export const aidsForLocomotionSchema = {
  type: 'object',
  required: ['requiresAids'],
  properties: {
    requiresAids: yesNoSchema,
    locomotionDistance: radioSchema([
      'oneBlock',
      'fiveOrSixBlocks',
      'oneMile',
      'other',
    ]),
    locomotionDistanceSpecify: { type: 'string' },
  },
};
