import React from 'react';

export default function LoadingButton({
  isLoading,
  loadingText,
  children,
  onClick,
  disabled,
  ...props
}) {
  const contents = loadingText ? (
    <>
      <i
        className="fa fa-spinner fa-spin"
        aria-hidden="true"
        role="presentation"
      />
      {loadingText && (
        <span className="sr-only" role="status">
          {loadingText}
        </span>
      )}
    </>
  ) : (
    children
  );

  return (
    <button
      className="usa-button"
      {...props}
      disabled={isLoading || disabled}
      onClick={onClick}
    >
      {contents}
    </button>
  );
}
