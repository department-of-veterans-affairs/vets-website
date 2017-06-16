import React from 'react';

export function fileHelp({ formContext }) {
  if (formContext.reviewMode) {
    return <p/>;
  }

  return (
    <p>
      Files we accept: pdf, jpg, png<br/>
      Maximum file size: 2MB
    </p>
  );
}
