import React from 'react';
import PropTypes from 'prop-types';

/**
 * @component FormDataViewer
 * @description Displays form data values in a read-only format.
 * Skips objects where all nested values are undefined.
 *
 * @param {Object} props
 * @param {Object} props.data - The form data object to display
 */
export const FormDataViewer = ({ data }) => {
  if (!data || typeof data !== 'object') {
    return <p className="vads-u-color--gray">No data available</p>;
  }

  // Recursively check if an object has any defined values
  const hasDefinedValues = obj => {
    if (!obj || typeof obj !== 'object') {
      return obj !== undefined;
    }

    return Object.values(obj).some(value => {
      if (value && typeof value === 'object') {
        return hasDefinedValues(value);
      }
      return value !== undefined;
    });
  };

  const renderValue = (key, value) => {
    // Skip undefined values
    if (value === undefined) {
      return null;
    }

    // Skip objects with no defined values
    if (value && typeof value === 'object' && !hasDefinedValues(value)) {
      return null;
    }

    switch (typeof value) {
      case 'boolean':
        return (
          <div className="vads-u-margin-bottom--0">
            <span className="vads-u-font-weight--bold vads-u-font-size--sm vads-u-margin-right--0p5">
              {key}:
            </span>
            <span className="vads-u-font-size--sm">{value ? 'Yes' : 'No'}</span>
          </div>
        );

      case 'string':
      case 'number':
        if (!value && value !== 0) return null;
        return (
          <div className="vads-u-margin-bottom--0">
            <span className="vads-u-font-weight--bold vads-u-font-size--sm vads-u-margin-right--0p5">
              {key}:
            </span>
            <span className="vads-u-font-size--sm">{value}</span>
          </div>
        );

      case 'object':
        if (value === null) {
          return null;
        }

        // Only render object if it has defined values
        if (!hasDefinedValues(value)) {
          return null;
        }

        return (
          <div
            key={key}
            className="vads-u-border-left--4px vads-u-border-color--gray-light vads-u-padding-left--1 vads-u-margin-bottom--0p5"
          >
            <p className="vads-u-font-size--sm vads-u-margin-y--0 vads-u-font-weight--bold">
              {key}
            </p>
            <FormDataViewer data={value} />
          </div>
        );

      default:
        return null;
    }
  };

  // If no defined values exist at all, show empty message
  if (!hasDefinedValues(data)) {
    return (
      <div className="vads-u-background-color--gray-lightest vads-u-padding--1">
        <p className="vads-u-margin--0 vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-style--italic">
          No form data entered yet
        </p>
      </div>
    );
  }

  return (
    <div className="vads-u-background-color--gray-lightest vads-u-padding--0p5">
      {Object.entries(data).map(([key, value]) => {
        const rendered = renderValue(key, value);
        return rendered ? <div key={key}>{rendered}</div> : null;
      })}
    </div>
  );
};

FormDataViewer.propTypes = {
  data: PropTypes.object,
};
