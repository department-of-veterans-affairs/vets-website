import React from 'react';

export default function LoadingButton({ isLoading, children, onClick }) {
  const contents = isLoading ? <i className="fa fa-spinner fa-spin"/> : children;
  return <button disabled={isLoading} onClick={onClick} className="usa-button">{contents}</button>;
}
