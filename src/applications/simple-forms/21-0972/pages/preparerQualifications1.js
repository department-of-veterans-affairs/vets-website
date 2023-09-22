import {
  preparerQualificationsQuestionTitle,
  preparerQualificationsQuestionLabels,
} from '../config/helpers';
import GroupCheckboxWidget from '../../shared/components/GroupCheckboxWidget';
import { claimantIdentificationDisplayOptions } from '../definitions/constants';

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

const schema = {
  type: 'object',
  properties: {
    preparerQualifications: {
      type: 'string',
    },
  },
  required: ['preparerQualifications'],
};

/** @type {PageSchema} */
export const preparerQualificationsSchema1A = {
  uiSchema: {
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
  schema,
};

/** @type {PageSchema} */
export const preparerQualificationsSchema1B = {
  uiSchema: {
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
  schema,
};

/** @type {PageSchema} */
export const preparerQualificationsSchema1C = {
  uiSchema: {
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
  schema,
};

/** @type {PageSchema} */
export const preparerQualificationsSchema1D = {
  uiSchema: {
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
  schema,
};
