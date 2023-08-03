import {
  preparerQualificationsQuestionTitle,
  preparerQualificationsQuestionLabels,
} from '../config/helpers';
import GroupCheckboxWidget from '../../shared/components/GroupCheckboxWidget';
import { claimantIdentificationDisplayOptions } from '../definitions/constants';

/** @type {PageSchema} */
const commonUiSchema = {
  preparerQualifications: {
    'ui:widget': GroupCheckboxWidget,
    'ui:errorMessages': {
      required:
        'You must select at least one relationship, so we can process your certification.',
    },
    // different titles between all the variants
    'ui:options': {
      forceDivWrapper: true,
      // different labels between all the variants
      showFieldLabel: true,
    },
  },
};
export default {
  uiSchemaA: {
    // for veteran claimant
    ...commonUiSchema,
    preparerQualifications: {
      ...commonUiSchema.preparerQualifications,
      'ui:title': preparerQualificationsQuestionTitle(
        claimantIdentificationDisplayOptions.VETERAN,
      ),
      'ui:options': {
        ...commonUiSchema.preparerQualifications['ui:options'],
        labels: preparerQualificationsQuestionLabels(
          claimantIdentificationDisplayOptions.VETERAN,
        ),
      },
    },
  },
  uiSchemaB: {
    // for spouse claimant
    ...commonUiSchema,
    preparerQualifications: {
      ...commonUiSchema.preparerQualifications,
      'ui:title': preparerQualificationsQuestionTitle(
        claimantIdentificationDisplayOptions.SPOUSE,
      ),
      'ui:options': {
        ...commonUiSchema.preparerQualifications['ui:options'],
        labels: preparerQualificationsQuestionLabels(
          claimantIdentificationDisplayOptions.SPOUSE,
        ),
      },
    },
  },
  uiSchemaC: {
    // for parent claimant
    ...commonUiSchema,
    preparerQualifications: {
      ...commonUiSchema.preparerQualifications,
      'ui:title': preparerQualificationsQuestionTitle(
        claimantIdentificationDisplayOptions.PARENT,
      ),
      'ui:options': {
        ...commonUiSchema.preparerQualifications['ui:options'],
        labels: preparerQualificationsQuestionLabels(
          claimantIdentificationDisplayOptions.PARENT,
        ),
      },
    },
  },
  uiSchemaD: {
    // for child claimant
    ...commonUiSchema,
    preparerQualifications: {
      ...commonUiSchema.preparerQualifications,
      'ui:title': preparerQualificationsQuestionTitle(
        claimantIdentificationDisplayOptions.CHILD,
      ),
      'ui:options': {
        ...commonUiSchema.preparerQualifications['ui:options'],
        labels: preparerQualificationsQuestionLabels(
          claimantIdentificationDisplayOptions.CHILD,
        ),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      preparerQualifications: {
        type: 'string',
      },
    },
    required: ['preparerQualifications'],
  },
};
