import React from 'react';
import { titleUI } from './titlePattern';
import { yesNoSchema, yesNoUI } from './yesNoPattern';
import {
  getArrayUrlSearchParams,
  maxItemsHint,
} from '../patterns/array-builder/helpers';

/**
 * Looks for URL param 'add' and 'removedAllWarn' and returns a warning alert if both are present
 */
export function withAlertOrDescription({ description, nounSingular }) {
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
    return isEdit
      ? `We’ll take you through each of the sections of this ${nounSingular} for you to review and edit`
      : description || '';
  };
}

/**
 * Looks for URL param 'edit' and returns a title with 'Edit' prepended if it is present
 */
export const withEditTitle = title => {
  return props => {
    const search = getArrayUrlSearchParams();
    const isEdit = search.get('edit');
    const titleStr = typeof title === 'function' ? title(props) : title;
    return isEdit
      ? `Edit ${titleStr.charAt(0).toLowerCase() + titleStr.slice(1)}`
      : titleStr;
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
 * @param {{
 *   title: string,
 *   nounSingular: string,
 * }} options
 * @returns {UISchemaOptions}
 */
export const arrayBuilderItemFirstPageTitleUI = ({
  title,
  description,
  nounSingular,
}) => {
  return titleUI(
    withEditTitle(title),
    withAlertOrDescription({ description, nounSingular }),
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
 * ```
 * @param {string | JSX.Element | ({ formData, formContext }) => string | JSX.Element} [title] 'ui:title'
 * @param {string | JSX.Element | ({ formData, formContext }) => string | JSX.Element} [description] 'ui:description'
 *
 * @returns {UISchemaOptions}
 */
export const arrayBuilderItemSubsequentPageTitleUI = (title, description) => {
  return titleUI(withEditTitle(title), description);
};

/**
 * @typedef {{
 *   title?: UISchemaOptions['ui:title'],
 *   labels?: {Y?: string, N?: string},
 *   hideHint?: boolean,
 *   hint?: string,
 *   errorMessages?: UISchemaOptions['ui:errorMessages'],
 *   labelHeaderLevel?: UISchemaOptions['ui:options']['labelHeaderLevel']
 * }} ArrayBuilderYesNoUIOptions
 */

/**
 * @param {{
 *   arrayPath: string,
 *   nounSingular: string,
 *   required: boolean | (formData) => boolean,
 *   maxItems?: number,
 * }} arrayBuilderOptions partial of same options you pass into `arrayBuilderPages`
 * @param {ArrayBuilderYesNoUIOptions} yesNoOptions yesNoUI options for 0 items
 * @param {ArrayBuilderYesNoUIOptions} yesNoOptionsMore yesNoUI options for more than 0 items
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
  yesNoOptions,
  yesNoOptionsMore,
) => {
  const {
    arrayPath,
    nounSingular,
    nounPlural,
    maxItems,
    required,
  } = arrayBuilderOptions;
  const defaultTitle =
    yesNoOptions?.title || `Do you have a ${nounSingular} to add?`;

  const requiredFn = typeof required === 'function' ? required : () => required;

  const customHint =
    typeof yesNoOptionsMore?.hint === 'function'
      ? yesNoOptionsMore?.hint
      : () => yesNoOptionsMore?.hint;
  const customMoreHint =
    typeof yesNoOptions?.hint === 'function'
      ? yesNoOptions?.hint
      : () => yesNoOptions?.hint;

  return {
    ...yesNoUI({
      title: defaultTitle,
      classNames: 'wc-pattern-array-builder-yes-no',
      updateUiSchema: formData => {
        const arrayData = formData?.[arrayPath];
        return arrayData?.length
          ? {
              'ui:title':
                yesNoOptionsMore?.title ||
                `Do you have another ${nounSingular} to add?`,
              'ui:options': {
                labelHeaderLevel: yesNoOptionsMore?.labelHeaderLevel || '4',
                hint: yesNoOptionsMore?.hideHint
                  ? null
                  : customHint({
                      arrayData,
                      nounSingular,
                      nounPlural,
                      maxItems,
                    }) ||
                    maxItemsHint({
                      arrayData,
                      nounSingular,
                      nounPlural,
                      maxItems,
                    }),
                labels: {
                  Y: yesNoOptionsMore?.labels?.Y || 'Yes',
                  N: yesNoOptionsMore?.labels?.N || 'No',
                },
              },
              'ui:errorMessages': {
                required:
                  yesNoOptionsMore?.errorMessages?.required ||
                  `Select yes if you have another ${nounSingular} to add`,
              },
            }
          : {
              'ui:title': defaultTitle,
              'ui:options': {
                labelHeaderLevel: yesNoOptions?.labelHeaderLevel || '3',
                hint: yesNoOptions?.hideHint
                  ? null
                  : customMoreHint({
                      arrayData,
                      nounSingular,
                      nounPlural,
                      maxItems,
                    }) ||
                    `You’ll need to add at least one ${nounSingular}. ${maxItemsHint(
                      {
                        arrayData,
                        nounSingular,
                        nounPlural,
                        maxItems,
                      },
                    )}`,
                labels: {
                  Y: yesNoOptions?.labels?.Y || 'Yes',
                  N: yesNoOptions?.labels?.N || 'No',
                },
              },
              'ui:errorMessages': {
                required:
                  yesNoOptions?.errorMessages?.required ||
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

export const arrayBuilderYesNoSchema = yesNoSchema;
