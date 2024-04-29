import React from 'react';
import PropTypes from 'prop-types';

export default function LoadingButton({
  isLoading,
  loadingText,
  children,
  onClick,
  disabled,
  ...props
}) {
  const contents = isLoading ? (
    <>
      <va-icon
        size={4}
        icon="see Storybook for icon names: https://design.va.gov/storybook/?path=/docs/uswds-va-icon--default"
        aria-hidden="true"
      />
      {!!loadingText && <span className="sr-only">{loadingText}</span>}
    </>
  ) : (
    children
  );

  // Switch to va-button-icon once the loading icon is added
  return (
    <button
      type="button"
      className="usa-button"
      {...props}
      disabled={isLoading || disabled}
      onClick={onClick}
      aria-live="polite"
    >
      {contents}
    </button>
  );
}

LoadingButton.propTypes = {
  children: PropTypes.any,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  loadingText: PropTypes.string,
  onClick: PropTypes.func,
};
