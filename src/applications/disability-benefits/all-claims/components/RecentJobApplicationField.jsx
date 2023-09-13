import React from 'react';

import { formatDate } from '../utils';

export default function RecentJobApplicationField({ formData }) {
  const { name, date } = formData;

  return (
    <p className="dd-privacy-mask">
      <strong>{name}</strong>
      <br />
      {date && formatDate(date)}
    </p>
  );
}
