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
    <div className="rotate-icon-container">
      <va-icon id="rotating-va-loading-icon" icon="autorenew" size={1} />
      {!!loadingText && <span className="sr-only">{loadingText}</span>}
    </div>
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
