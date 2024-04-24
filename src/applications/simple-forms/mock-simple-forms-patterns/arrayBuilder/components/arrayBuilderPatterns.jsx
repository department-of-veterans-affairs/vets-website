import React from 'react';
import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { getArrayUrlSearchParams } from '../helpers';

/**
 * Title for the first page of an item in an array builder
 *
 * - Puts the title in the format "Edit {title}" when editing
 * - Displays a warning alert if all items have been removed and is required
 * - Display is additional message for edit
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
export const arrayBuilderItemFirstPageTitleUI = ({ title, nounSingular }) => {
  return titleUI(
    () => {
      const search = getArrayUrlSearchParams();
      const isEdit = search.get('edit');
      return isEdit
        ? `Edit ${title.charAt(0).toLowerCase() + title.slice(1)}`
        : title;
    },
    () => {
      const search = getArrayUrlSearchParams();
      const isAdd = search.get('add');
      const isEdit = search.get('edit');
      const removedAllWarn = search.get('removedAllWarn');
      if (isAdd && removedAllWarn) {
        return (
          <div className="vads-u-margin-top--4">
            <va-alert slim status="warning" visible>
              <p className="vads-u-margin-y--0">
                {`You must add at least one ${nounSingular} for us to process this form.`}
              </p>
            </va-alert>
          </div>
        );
      }
      return isEdit
        ? `We’ll take you through each of the sections of this ${nounSingular} for you to review and edit`
        : '';
    },
  );
};

/**
 * @typedef {{
 *   title?: UISchemaOptions['ui:title'],
 *   labels?: {Y?: string, N?: string},
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
 * // explicit
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
  const { arrayPath, nounSingular, maxItems, required } = arrayBuilderOptions;
  const defaultTitle =
    yesNoOptions?.title || `Do you have a ${nounSingular} to add?`;
  return {
    ...yesNoUI({
      title: defaultTitle,
      updateUiSchema: formData => {
        return formData?.[arrayPath]?.length
          ? {
              'ui:title': defaultTitle,
              'ui:options': {
                labelHeaderLevel: yesNoOptionsMore?.labelHeaderLevel || '4',
                hint:
                  yesNoOptionsMore?.hint || `You can add up to ${maxItems}.`,
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
              'ui:title':
                yesNoOptions?.title || `Do you have a ${nounSingular} to add?`,
              'ui:options': {
                labelHeaderLevel: yesNoOptions?.labelHeaderLevel || '3',
                hint:
                  yesNoOptions?.hint ||
                  `You’ll need to add at least one ${nounSingular}. You can add up to ${maxItems}`,
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
        if (!arrayData?.length && !yesNoBoolean && required(formData)) {
          errors.addError(
            `You must add at least one ${nounSingular} for us to process this form.`,
          );
        }
      },
    ],
  };
};

export const arrayBuilderYesNoSchema = yesNoSchema;
