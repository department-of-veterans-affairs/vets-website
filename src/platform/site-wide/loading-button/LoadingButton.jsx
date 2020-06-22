import React from 'react';

export default function LoadingButton({
  isLoading,
  loadingText,
  children,
  onClick,
  disabled,
  ...props
}) {
  let contents;
  if (loadingText) {
    contents = isLoading ? (
      <>
        <i
          className="fa fa-spinner fa-spin"
          aria-hidden="true"
          role="presentation"
        />
        <span className="sr-only">{loadingText}</span>
      </>
    ) : (
      children
    );
  } else {
    contents = isLoading ? <i className="fa fa-spinner fa-spin" /> : children;
  }

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
