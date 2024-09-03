import React from 'react';

export const pageTitle = (title, subtitle) => (
  <>
    <p>
      <b>{title}</b>
    </p>
    {subtitle && <p>{subtitle}</p>}
  </>
);
