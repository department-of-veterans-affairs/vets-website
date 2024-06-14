import {
  checkboxGroupSchema,
  checkboxGroupUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  preparerQualificationsQuestionTitle,
  preparerQualificationsQuestionLabels,
} from '../config/helpers';
import { claimantIdentificationDisplayOptions } from '../definitions/constants';

const schema = {
  type: 'object',
  properties: {
    preparerQualifications: checkboxGroupSchema(
      Object.keys(preparerQualificationsQuestionLabels(null)),
    ),
  },
  required: ['preparerQualifications'],
};

/** @type {PageSchema} */
export const preparerQualificationsSchema1A = {
  uiSchema: {
    // for veteran claimant
    preparerQualifications: checkboxGroupUI({
      title: preparerQualificationsQuestionTitle(
        claimantIdentificationDisplayOptions.VETERAN,
      ),
      labels: preparerQualificationsQuestionLabels(
        claimantIdentificationDisplayOptions.VETERAN,
      ),
      required: true,
      errorMessages: {
        required:
          'You must select at least one relationship, so we can process your certification.',
      },
    }),
  },
  schema,
};

/** @type {PageSchema} */
export const preparerQualificationsSchema1B = {
  uiSchema: {
    // for spouse claimant
    preparerQualifications: checkboxGroupUI({
      title: preparerQualificationsQuestionTitle(
        claimantIdentificationDisplayOptions.SPOUSE,
      ),
      labels: preparerQualificationsQuestionLabels(
        claimantIdentificationDisplayOptions.SPOUSE,
      ),
      required: true,
      errorMessages: {
        required:
          'You must select at least one relationship, so we can process your certification.',
      },
    }),
  },
  schema,
};

/** @type {PageSchema} */
export const preparerQualificationsSchema1C = {
  uiSchema: {
    // for parent claimant
    preparerQualifications: checkboxGroupUI({
      title: preparerQualificationsQuestionTitle(
        claimantIdentificationDisplayOptions.PARENT,
      ),
      labels: preparerQualificationsQuestionLabels(
        claimantIdentificationDisplayOptions.PARENT,
      ),
      required: true,
      errorMessages: {
        required:
          'You must select at least one relationship, so we can process your certification.',
      },
    }),
  },
  schema,
};

/** @type {PageSchema} */
export const preparerQualificationsSchema1D = {
  uiSchema: {
    // for child claimant
    preparerQualifications: checkboxGroupUI({
      title: preparerQualificationsQuestionTitle(
        claimantIdentificationDisplayOptions.CHILD,
      ),
      labels: preparerQualificationsQuestionLabels(
        claimantIdentificationDisplayOptions.CHILD,
      ),
      required: true,
      errorMessages: {
        required:
          'You must select at least one relationship, so we can process your certification.',
      },
    }),
  },
  schema,
};
