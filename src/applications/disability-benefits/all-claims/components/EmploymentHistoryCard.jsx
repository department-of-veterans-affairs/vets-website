import React from 'react';

import { formatDateRange } from '../utils';

export default ({ formData }) => {
  const { name, dates } = formData;

  return (
    <div>
      <h5>{name}</h5>
      <p>{formatDateRange(dates)}</p>
    </div>
  );
};
