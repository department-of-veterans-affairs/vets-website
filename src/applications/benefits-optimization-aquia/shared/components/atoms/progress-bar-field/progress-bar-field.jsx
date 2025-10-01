import PropTypes from 'prop-types';
import React from 'react';

/**
 * Progress bar component for multi-step forms.
 * Uses native va-progress-bar web component for consistent VA.gov styling.
 * Provides visual feedback on form completion progress.
 *
 * @component
 * @see [VA Progress Bar - Segmented](https://design.va.gov/components/form/progress-bar-segmented)
 * @param {Object} props - Component props
 * @param {number} props.current - Current step/page number (1-based)
 * @param {number} props.total - Total number of steps/pages
 * @param {string} [props.label] - Label text for the progress bar
 * @param {string} [props.heading] - Heading text displayed above the progress bar
 * @param {string} [props.headingLevel='2'] - HTML heading level (1-6)
 * @param {boolean} [props.centered=false] - Center the progress bar
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} VA progress bar web component
 */
export const ProgressBarField = ({
  current,
  total,
  label,
  heading,
  headingLevel = '2',
  centered = false,
  className,
  ...props
}) => {
  const percentage = Math.round((current / total) * 100);
  const progressLabel = label || `Step ${current} of ${total}`;

  return (
    <va-progress-bar
      {...props}
      current={current}
      max={total}
      label={progressLabel}
      heading={heading}
      heading-level={headingLevel}
      centered={centered}
      class={className}
      aria-valuenow={current}
      aria-valuemax={total}
      aria-valuetext={`${progressLabel} - ${percentage}% complete`}
    />
  );
};

ProgressBarField.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  centered: PropTypes.bool,
  className: PropTypes.string,
  heading: PropTypes.string,
  headingLevel: PropTypes.oneOf(['1', '2', '3', '4', '5', '6']),
  label: PropTypes.string,
};
