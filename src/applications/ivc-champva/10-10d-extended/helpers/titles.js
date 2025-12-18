import React from 'react';
import {
  arrayBuilderItemSubsequentPageTitleUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import MedicarePageTitle from '../components/FormDescriptions/MedicarePageTitle';
import { replaceStrValues } from './formatting';

/**
 * Creates a dynamic Health Insurance page title with provider name.
 *
 * @param {string} title - The page-specific title. Use '%s' as placeholder for provider name.
 *                         If no '%s' is present, provider is prepended by default.
 * @param {string|React.Component} [description=null] - Optional description
 * @param {Object} [options] - Configuration options
 * @param {boolean} [options.lowercase=false] - Whether to lowercase the title
 * @param {'prefix'|'suffix'|'replace'} [options.position='prefix'] - Where to place the provider name
 * @returns {Object} UI schema object for arrayBuilderItemSubsequentPageTitleUI
 *                   The title function always returns a string: either the original title
 *                   (when no provider), or a formatted string with provider inserted.
 *
 * @example
 * // Provider prepended (default): "Cigna prescription coverage"
 * healthInsurancePageTitleUI('prescription coverage')
 *
 * @example
 * // Provider in middle: "Type of insurance for Cigna"
 * healthInsurancePageTitleUI('Type of insurance for %s')
 *
 * @example
 * // Provider appended: "Upload health insurance card for Cigna"
 * healthInsurancePageTitleUI('Upload health insurance card', null, { position: 'suffix' })
 *
 * @example
 * // Multiple placeholders: "Upload Cigna health insurance card"
 * healthInsurancePageTitleUI('Upload %s health insurance card')
 */
export const healthInsurancePageTitleUI = (
  title,
  description = null,
  { lowercase = false, position = 'prefix' } = {},
) =>
  arrayBuilderItemSubsequentPageTitleUI(
    ({ formData }) => {
      const provider = formData?.provider;
      if (!provider) return title;
      if (title.includes('%s')) return replaceStrValues(title, provider);
      if (position === 'suffix') return `${title} ${provider}`;
      return `${provider} ${title}`;
    },
    description,
    lowercase,
  );

/**
 * Creates a dynamic Medicare page title with participant name.
 * Uses a component that accesses Redux to get the full form data.
 * Generates titles like "Jane Doe's Medicare plan types"
 *
 * @param {string} title - The page-specific title (e.g., 'Medicare plan types')
 * @param {string|React.Component} [description=null] - Optional description
 * @returns {Object} UI schema object for titleUI
 */
export const medicarePageTitleUI = (title, description = null) => {
  const pageTitle = ({ formData: item }) => (
    <MedicarePageTitle item={item} title={title} />
  );
  return titleUI(pageTitle, description);
};
