import React from 'react';
import { titleUI } from './titlePattern';
import { yesNoSchema, yesNoUI } from './yesNoPattern';
import {
  getArrayUrlSearchParams,
  maxItemsFn,
  maxItemsHint,
} from '../patterns/array-builder/helpers';

/**
 * useFormsPattern helper
 * https://design.va.gov/storybook/?path=/docs/uswds-va-radio--docs#forms-pattern-single
 * @param {ArrayBuilderYesNoUIOptions} yesNoOptions
 */
const withUseFormsPattern = yesNoOptions => {
  if (!yesNoOptions) return {};

  return {
    useFormsPattern: yesNoOptions.useFormsPattern ? 'single' : undefined,
    formHeading: yesNoOptions.formHeading,
    formDescription: yesNoOptions.formDescription,
    formHeadingLevel: yesNoOptions.formHeadingLevel,
    formHeadingLevelStyle: yesNoOptions.formHeadingLevelStyle,
  };
};

/**
 * @param {ArrayBuilderYesNoUIOptions} options
 * @param {{
 * labelHeaderLevel: string,
 * ifMinimalHeader?: {
 *   labelHeaderLevel: string,
 *   labelHeaderLevelStyle: string
 * }}} defaults
 */
const withLabelHeaderLevel = (options, defaults) => {
  const hasLabelHeaderLevel =
    options &&
    Object.prototype.hasOwnProperty.call(options, 'labelHeaderLevel');

  const hasLabelHeaderLevelStyle =
    options &&
    Object.prototype.hasOwnProperty.call(options, 'labelHeaderLevelStyle');

  const result = {};

  if (hasLabelHeaderLevel) {
    // Use user value directly
    result.labelHeaderLevel = options.labelHeaderLevel;
  } else {
    // Use default + ifMinimalHeader fallback
    result.labelHeaderLevel = defaults.labelHeaderLevel;
    result.ifMinimalHeader = {
      labelHeaderLevel: defaults.ifMinimalHeader.labelHeaderLevel,
    };
  }

  if (hasLabelHeaderLevelStyle) {
    // Use user value directly
    result.labelHeaderLevelStyle = options.labelHeaderLevelStyle;
  } else {
    // Use default + ifMinimalHeader fallback
    if (!result.ifMinimalHeader) {
      result.ifMinimalHeader = {};
    }
    result.ifMinimalHeader.labelHeaderLevelStyle =
      defaults.ifMinimalHeader.labelHeaderLevelStyle;
  }

  return result;
};

/**
 * Looks for URL param 'add' and 'removedAllWarn' and returns a warning alert if both are present
 */
export function withAlertOrDescription({
  description,
  nounSingular,
  hasMultipleItemPages,
  showEditExplanationText = true,
}) {
  return () => {
    const search = getArrayUrlSearchParams();
    const isAdd = search.get('add');
    const isEdit = search.get('edit');
    const removedAllWarn = search.get('removedAllWarn');
    if (isAdd && removedAllWarn) {
      return (
        <>
          <div className="vads-u-margin-top--4">
            <va-alert slim status="warning" visible>
              <p className="vads-u-margin-y--0">
                {`You must add at least one ${nounSingular} for us to process this form.`}
              </p>
            </va-alert>
          </div>
        </>
      );
    }
    if (isEdit && (hasMultipleItemPages && showEditExplanationText)) {
      return `We’ll take you through each of the sections of this ${nounSingular} for you to review and edit`;
    }
    return description || '';
  };
}

/**
 * Looks for URL param 'edit' and returns a title with 'Edit' prepended if it is present.
 * Optionally allows control over whether the title should be lowercased.
 *
 * @param {string | function} title - The title or a function that returns a title.
 * @param {boolean} [lowerCase=true] - Whether to lower case the first character of the title when 'edit' is present.
 * @returns {function} - A function that returns the modified or original title.
 */
export const withEditTitle = (title, lowerCase = true) => {
  return props => {
    const search = getArrayUrlSearchParams();
    const isEdit = search.get('edit');
    const titleStr = typeof title === 'function' ? title(props) : title;
    if (isEdit) {
      const modifiedTitle = lowerCase
        ? titleStr.charAt(0).toLowerCase() + titleStr.slice(1)
        : titleStr;
      return `Edit ${modifiedTitle}`;
    }
    return titleStr;
  };
};

/**
 * Title for the first page of an item in an array builder
 *
 * - Puts the title in the format "Edit {title}" when editing
 * - Displays a warning alert if all items have been removed and is required
 * - Displays an additional description message for edit
 *
 * Usage:
 * ```
 * uiSchema: {
 *   ...arrayBuilderItemFirstPageTitleUI({
 *     title: 'Name and address of employer',
 *     nounSingular: 'employer',
 *   }),
 *   ...
 * }
 * ```
 *
 * @param {Object} options
 * @param {string} options.title
 * @param {string} options.nounSingular
 * @param {boolean} [options.lowerCase=true]
 * @param {boolean} [options.hasMultipleItemPages=true]
 * @param {string | JSX.Element | ({ formData, formContext }) => string | JSX.Element} [options.description]
 * @param {boolean} [options.showEditExplanationText=true]
 * @returns {UISchemaOptions}
 */
export const arrayBuilderItemFirstPageTitleUI = ({
  title,
  description,
  nounSingular,
  lowerCase = true,
  hasMultipleItemPages = true,
  showEditExplanationText = true,
}) => {
  return titleUI(
    withEditTitle(title, lowerCase),
    withAlertOrDescription({
      description,
      nounSingular,
      hasMultipleItemPages,
      showEditExplanationText,
    }),
  );
};

/**
 * Title for the top of a subsequent page (not the first) of an item in array builder pattern
 * - Puts the title in the format "Edit {title}" when editing
 *
 * ```js
 * uiSchema: {
 *   ...arrayBuilderItemSubsequentPageTitleUI('Your contact information')
 *   ...arrayBuilderItemSubsequentPageTitleUI(({ formData, formContext }) => `Your contact information ${formData.firstName}`)
 *   ...arrayBuilderItemSubsequentPageTitleUI('Your contact information', 'We’ll send any important information to this address.')
 *   ...arrayBuilderItemSubsequentPageTitleUI('Previous deductible expenses', (<p>
      Tell us more.
          <AdditionalInfo triggerText="What if my expenses are higher than my annual income?">
            We understand in some cases your expenses might be higher than your
            income. If your expenses exceed your income, we’ll adjust them to be
            equal to your income. This won’t affect your application or benefits.
          </AdditionalInfo>
      </p>))
    ...arrayBuilderItemSubsequentPageTitleUI('Sallie Mae', undefined, false)
 * ```
 * @param {string | JSX.Element | ({ formData, formContext }) => string | JSX.Element} [title] 'ui:title'
 * @param {string | JSX.Element | ({ formData, formContext }) => string | JSX.Element} [description] 'ui:description'
 * @param {boolean} [lowerCase=true] - Whether to lower case the first character of the title when 'edit' is present
 *
 * @returns {UISchemaOptions}
 */
export const arrayBuilderItemSubsequentPageTitleUI = (
  title,
  description,
  lowerCase = true,
) => {
  return titleUI(withEditTitle(title, lowerCase), description);
};

/**
 * @typedef {Object} ArrayBuilderYesNoUIOptions
 * @property {UISchemaOptions['ui:title']} [title]
 * @property {{ Y?: string, N?: string }} [labels]
 * @property {{ Y?: string, N?: string }} [descriptions]
 * @property {string | function} [hint]
 * @property {UISchemaOptions['ui:errorMessages']} [errorMessages]
 * @property {UISchemaOptions['ui:options']['labelHeaderLevel']} [labelHeaderLevel]
 * @property {UISchemaOptions['ui:options']['labelHeaderLevelStyle']} [labelHeaderLevelStyle]
 *
 * @property {boolean | 'single'} [useFormsPattern] Alternative approach to using text > summaryTitleWithoutItems | summaryTitle
 * @property {UISchemaOptions['ui:options']['formHeading']} [formHeading]  Used with `useFormsPattern`.
 * @property {UISchemaOptions['ui:options']['formDescription']} [formDescription]  Used with `useFormsPattern`.
 * @property {UISchemaOptions['ui:options']['formHeadingLevel']} [formHeadingLevel]  Used with `useFormsPattern`
 * @property {UISchemaOptions['ui:options']['formHeadingLevelStyle']} [formHeadingLevelStyle]  Used with `useFormsPattern`
 */

/**
 * uiSchema for the yes/no question in an array builder summary page. Includes array builder options, options when no cards are present, and options when cards are present.
 * @param {{
 *   arrayPath: string,
 *   nounSingular: string,
 *   required: boolean | (formData) => boolean,
 *   maxItems?: number | (formData) => number,
 * }} arrayBuilderOptions partial of same options you pass into `arrayBuilderPages`
 * @param {ArrayBuilderYesNoUIOptions} [yesNoOptionsInitial] yesNoUI options for 0 items
 * @param {ArrayBuilderYesNoUIOptions} [yesNoOptionsAdditional] yesNoUI options for more than 0 items
 * @returns {UISchemaOptions}
 * Usage:
 * ```
 * // simple
 * 'view:hasEmployment': arrayBuilderYesNoUI(arrayBuilderOptions)
 *
 * // explicit props
 * 'view:hasEmployment': arrayBuilderYesNoUI({
 *   arrayPath: 'employers',
 *   nounSingular: 'employer',
 *   required: false,
 *   maxItems: 5
 * })
 *
 * // custom text
 * 'view:hasEmployment': arrayBuilderYesNoUI(
 *   arrayBuilderOptions,
 *   {
 *     title: 'Do you have any employment to report?',
 *     labels: {
 *       Y: 'Yes, I have employment to report',
 *       N: 'No, I don’t have employment to report',
 *     },
 *   },
 *   {
 *     title: 'Do you have another employer to report?',
 *     labels: {
 *       Y: 'Yes, I have another employer to report',
 *       N: 'No, I don’t have another employer to report',
 *     },
 *   }
 * )
 * ```
 */
export const arrayBuilderYesNoUI = (
  arrayBuilderOptions,
  yesNoOptionsInitial,
  yesNoOptionsAdditional,
) => {
  const { arrayPath, nounSingular, nounPlural, required } = arrayBuilderOptions;
  const defaultTitle =
    yesNoOptionsInitial?.title ?? `Do you have a ${nounSingular} to add?`;

  const requiredFn = typeof required === 'function' ? required : () => required;

  const getCustomHint = options => {
    if (options && Object.prototype.hasOwnProperty.call(options, 'hint')) {
      return typeof options.hint === 'function'
        ? options.hint
        : () => options.hint;
    }
    return null;
  };

  const customHint = getCustomHint(yesNoOptionsAdditional);
  const customMoreHint = getCustomHint(yesNoOptionsInitial);

  return {
    ...yesNoUI({
      title: defaultTitle,
      data: {
        arrayPath, // `data-array-path` attribute for e2e testing
      },
      classNames:
        'wc-pattern-array-builder wc-pattern-array-builder-yes-no vads-web-component-pattern',
      updateUiSchema: formData => {
        const arrayData = formData?.[arrayPath];
        const maxItems = maxItemsFn(arrayBuilderOptions.maxItems, formData);
        return arrayData?.length
          ? {
              'ui:title':
                yesNoOptionsAdditional?.title ??
                `Do you have another ${nounSingular} to add?`,
              'ui:options': {
                ...withLabelHeaderLevel(yesNoOptionsAdditional, {
                  labelHeaderLevel: '4',
                  ifMinimalHeader: {
                    labelHeaderLevel: '2',
                    labelHeaderLevelStyle: '3',
                  },
                }),
                hint: customHint
                  ? customHint({
                      arrayData,
                      nounSingular,
                      nounPlural,
                      maxItems,
                    })
                  : maxItemsHint({
                      arrayData,
                      nounSingular,
                      nounPlural,
                      maxItems,
                    }),
                labels: {
                  Y: yesNoOptionsAdditional?.labels?.Y || 'Yes',
                  N: yesNoOptionsAdditional?.labels?.N || 'No',
                },
                descriptions: yesNoOptionsAdditional?.descriptions,
                ...withUseFormsPattern(yesNoOptionsAdditional),
              },
              'ui:errorMessages': {
                required:
                  yesNoOptionsAdditional?.errorMessages?.required ||
                  `Select yes if you have another ${nounSingular} to add`,
              },
            }
          : {
              'ui:title': defaultTitle,
              'ui:options': {
                ...withLabelHeaderLevel(yesNoOptionsInitial, {
                  labelHeaderLevel: '3',
                  ifMinimalHeader: {
                    labelHeaderLevel: '1',
                    labelHeaderLevelStyle: '2',
                  },
                }),
                hint: customMoreHint
                  ? customMoreHint({
                      arrayData,
                      nounSingular,
                      nounPlural,
                      maxItems,
                    })
                  : `You’ll need to add at least one ${nounSingular}. ${maxItemsHint(
                      {
                        arrayData,
                        nounSingular,
                        nounPlural,
                        maxItems,
                      },
                    )}`,
                labels: {
                  Y: yesNoOptionsInitial?.labels?.Y || 'Yes',
                  N: yesNoOptionsInitial?.labels?.N || 'No',
                },
                descriptions: yesNoOptionsInitial?.descriptions,
                ...withUseFormsPattern(yesNoOptionsInitial),
              },
              'ui:errorMessages': {
                required:
                  yesNoOptionsInitial?.errorMessages?.required ||
                  `Select yes if you have a ${nounSingular} to add`,
              },
            };
      },
    }),
    'ui:validations': [
      (errors, yesNoBoolean, formData) => {
        const arrayData = formData?.[arrayPath];
        // This validation may not be visible,
        // but helps the review page error work correctly
        if (!arrayData?.length && !yesNoBoolean && requiredFn(formData)) {
          errors.addError(
            `You must add at least one ${nounSingular} for us to process this form.`,
          );
        }
      },
    ],
  };
};

/**
 * schema for arrayBuilderYesNoUI
 */
export const arrayBuilderYesNoSchema = yesNoSchema;
