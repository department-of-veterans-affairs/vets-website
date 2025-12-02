import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import MedicarePageTitle from '../components/FormDescriptions/MedicarePageTitle';

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
