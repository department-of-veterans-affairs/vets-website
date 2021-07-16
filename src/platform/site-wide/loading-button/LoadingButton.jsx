import React from 'react';

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
      {loadingText && <span className="sr-only">{loadingText}</span>}
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
      // eslint-disable-next-line jsx-a11y/no-interactive-element-to-noninteractive-role
      role="status"
    >
      {contents}
    </button>
  );
}
