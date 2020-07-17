import React from 'react';

import { formatDateRange } from '../utils';

export default ({ formData }) => {
  const { name, dates } = formData;

  return (
    <p>
      <strong>{name}</strong>
      <br />
      {formatDateRange(dates)}
    </p>
  );
};
