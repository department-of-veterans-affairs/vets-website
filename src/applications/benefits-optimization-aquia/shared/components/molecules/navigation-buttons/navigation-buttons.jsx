import PropTypes from 'prop-types';
import React from 'react';

/**
 * Navigation buttons component for form pages
 * Provides standardized Back/Continue button layout using VA Design System
 *
 * @see [VA Button](https://design.va.gov/components/button)
 * @see [VA Button Group](https://design.va.gov/components/button/button-group)
 * @param {Object} props - Component props
 * @param {Function} [props.onBack] - Callback function for back button click
 * @param {Function} props.onContinue - Callback function for continue button click
 * @param {boolean} [props.showBack=true] - Whether to show the back button
 * @param {string} [props.continueText='Continue'] - Text for the continue button
 * @param {string} [props.backText='Back'] - Text for the back button
 * @returns {JSX.Element} Navigation buttons component
 *
 * @example
 * <NavigationButtons
 *   onBack={handleBack}
 *   onContinue={handleContinue}
 * />
 *
 * @example
 * <NavigationButtons
 *   onContinue={handleContinue}
 *   showBack={false}
 * />
 *
 * @example
 * <NavigationButtons
 *   onBack={handleBack}
 *   onContinue={handleSubmit}
 *   continueText="Submit Application"
 * />
 */
export const NavigationButtons = ({
  onBack,
  onContinue,
  showBack = true,
  continueText = 'Continue',
  backText = 'Back',
}) => {
  // Ensure text values are never null/undefined
  const safeBackText = backText || 'Back';
  const safeContinueText = continueText || 'Continue';

  return (
    <div className="vads-u-margin-top--4 vads-l-row">
      <div className="vads-l-col--6">
        {showBack &&
          onBack && (
            <va-button onClick={onBack} back>
              {safeBackText}
            </va-button>
          )}
      </div>
      <div className="vads-l-col--6 vads-u-text-align--right">
        <va-button onClick={onContinue} continue>
          {safeContinueText}
        </va-button>
      </div>
    </div>
  );
};

NavigationButtons.propTypes = {
  onContinue: PropTypes.func.isRequired,
  backText: PropTypes.string,
  continueText: PropTypes.string,
  showBack: PropTypes.bool,
  onBack: PropTypes.func,
};
