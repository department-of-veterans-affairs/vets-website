import React from 'react';

import { formatDate } from '../utils/dates/formatting';

export default function RecentJobApplicationField({ formData }) {
  const { name, date } = formData;

  return (
    <p>
      <strong>{name}</strong>
      <br />
      {date && formatDate(date)}
    </p>
  );
}
