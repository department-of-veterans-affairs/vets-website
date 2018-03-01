import React from 'react';

export default function EducationView({ formData }) {
  let from = '';
  let to = '';
  if (formData.yearStarted && formData.yearLeft) {
    from = formData.yearStarted;
    to = formData.yearLeft;
  }

  return (
    <div>
      <strong>{formData.program}</strong><br/>
      {from} &mdash; {to}
    </div>
  );
}
