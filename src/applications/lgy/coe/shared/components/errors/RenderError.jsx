import React from 'react';
import { Error500 } from './Error500';
import { Error400 } from './Error400';

export const RenderError = ({ errors }) => {
  const regExFor500 = /^[5][0-9][0-9]$/;
  // If it is a 500 error

  if (errors.coe && regExFor500.test(errors?.coe[0]?.code)) {
    return <Error500 />;
  }

  // If it is any other kind of error
  return <Error400 />;
};
