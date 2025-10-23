import React from 'react';

export const pageTitle = (title, subtitle) => (
  <>
    <p>
      <b>{title}</b>
    </p>
    {subtitle && <p>{subtitle}</p>}
  </>
);

export const submitHandler = () => {
  document.getElementById('submit-helper').click();
  return Promise.resolve({ attributes: { confirmationNumber: '123123123' } });
};
