/**
 * @module pages/PlaceholderPage
 * @description Placeholder page for VA Form 21P-530A - to be replaced with actual pages
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Placeholder page component
 * Temporary page used during development - will be replaced with actual form pages
 * @param {Object} props - Component props
 * @param {Object} props.data - Form data
 * @param {Function} props.goForward - Function to navigate to next page
 * @param {Function} props.goBack - Function to navigate to previous page
 * @returns {JSX.Element} Placeholder page
 */
export const PlaceholderPage = ({ data, goForward, goBack }) => {
  const handleContinue = () => {
    goForward(data);
  };

  const handleBack = () => {
    goBack(data);
  };

  return (
    <div className="placeholder-page">
      <h3>Page Under Development</h3>
      <p>
        This page is currently under development and will be implemented soon.
      </p>

      <div className="form-nav-buttons vads-u-margin-top--3">
        <va-button
          text="Back"
          onClick={handleBack}
          secondary
          uswds
          className="vads-u-margin-right--2"
        />
        <va-button text="Continue" onClick={handleContinue} uswds />
      </div>
    </div>
  );
};

PlaceholderPage.propTypes = {
  data: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
};
