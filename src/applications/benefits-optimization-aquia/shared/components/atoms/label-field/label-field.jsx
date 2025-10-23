import PropTypes from 'prop-types';
import React from 'react';

/**
 * Label component for form fields using VA design system.
 * Uses native va-label web component for consistent VA.gov styling.
 * Provides accessible labeling with support for required indicators and hints.
 *
 * @component
 * @see [VA Label](https://design.va.gov/components/form/label)
 * @param {Object} props - Component props
 * @param {string} props.htmlFor - ID of the form field this label is for
 * @param {string} props.label - Label text to display
 * @param {boolean} [props.required=false] - Whether to show required indicator
 * @param {string} [props.hint] - Additional help text to display
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} [props.children] - Child elements (form field)
 * @returns {JSX.Element} VA label web component
 */
export const LabelField = ({
  htmlFor,
  label,
  required = false,
  hint,
  className,
  children,
  ...props
}) => {
  return (
    <va-label
      {...props}
      for={htmlFor}
      label={label}
      required={required}
      hint={hint}
      class={className}
    >
      {children}
    </va-label>
  );
};

LabelField.propTypes = {
  htmlFor: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  hint: PropTypes.string,
  required: PropTypes.bool,
};
