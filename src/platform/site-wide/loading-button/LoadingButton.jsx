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
      <i
        className="fa fa-spinner fa-spin"
        aria-hidden="true"
        role="presentation"
      />
      {!!loadingText && <span className="sr-only">{loadingText}</span>}
    </>
  ) : (
    children
  );

  // Switch to va-button-icon once the loading icon is added
  return (
    <button
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
