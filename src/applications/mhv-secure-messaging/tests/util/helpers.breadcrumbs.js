import { expect } from 'chai';
import { waitFor } from '@testing-library/react';

/**
 * Assert that the Back breadcrumb has the correct label.
 * Handles both <va-link> (web component) and <a> (plain anchor).
 * For use in unit tests with Testing Library.
 *
 * @param {HTMLElement} container - Testing Library container or document
 * @returns {Promise<void>}
 */
export const assertBackBreadcrumbLabel = async container => {
  await waitFor(() => {
    const backElement = container.querySelector(
      '[data-testid="sm-breadcrumbs-back"]',
    );

    if (!backElement) {
      throw new Error('Back breadcrumb element not found');
    }

    const tagName = backElement.tagName.toLowerCase();

    if (tagName === 'va-link') {
      // Web component: assert the text attribute contains "Back"
      expect(backElement.getAttribute('text')).to.include('Back');
    } else {
      // Plain anchor: assert text content contains "Back"
      expect(backElement.textContent).to.include('Back');
    }
  });
};
