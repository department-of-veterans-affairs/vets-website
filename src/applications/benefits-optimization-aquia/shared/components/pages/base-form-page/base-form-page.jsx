import PropTypes from 'prop-types';
import React from 'react';

/**
 * Base form page component that provides consistent structure.
 * All page templates and custom pages can extend or use this component.
 * Provides consistent spacing, styling, and accessibility features.
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 * @param {string} [props.title] - Page title
 * @param {string} [props.subtitle] - Page subtitle
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {boolean} [props.showProgress=false] - Show progress indicator
 * @param {number} [props.currentStep] - Current step number
 * @param {number} [props.totalSteps] - Total number of steps
 * @param {string} [props.headerLevel='h2'] - Header element level
 * @param {boolean} [props.showBorder=false] - Show border around content
 * @returns {JSX.Element} Base form page structure
 */
export const BaseFormPage = ({
  children,
  title,
  subtitle,
  className = '',
  showProgress = false,
  currentStep,
  totalSteps,
  headerLevel = 'h2',
  showBorder = false,
}) => {
  const HeaderTag = headerLevel;

  const contentClasses = [
    'vads-u-margin-y--2',
    showBorder &&
      'vads-u-border--1px vads-u-border-color--gray-light vads-u-padding--2',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={contentClasses}>
      {showProgress &&
        currentStep &&
        totalSteps && (
          <div className="vads-u-margin-bottom--2">
            <va-progress-bar
              label="Form progress"
              percent={(currentStep / totalSteps) * 100}
            />
            <span className="vads-u-display--block vads-u-margin-top--1 vads-u-font-size--sm">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
        )}

      {title && (
        <HeaderTag className="vads-u-font-size--h3 vads-u-margin-bottom--2">
          {title}
        </HeaderTag>
      )}

      {subtitle && (
        <p className="vads-u-font-size--lg vads-u-margin-bottom--2">
          {subtitle}
        </p>
      )}

      {children}
    </div>
  );
};

BaseFormPage.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  currentStep: PropTypes.number,
  headerLevel: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4']),
  showBorder: PropTypes.bool,
  showProgress: PropTypes.bool,
  subtitle: PropTypes.string,
  title: PropTypes.string,
  totalSteps: PropTypes.number,
};
