import React from 'react';

export default function RecentJobApplicationField({ formData }) {
  const { name, date } = formData;

  return (
    <div>
      <strong>{name}</strong>
      <p>{date}</p>
    </div>
  );
}
