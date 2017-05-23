import React from 'react';

export default function ChildView({ formData }) {
  return (
    <div>
      <strong>{formData.childFullName.first} {formData.childFullName.last}</strong>
      <br/>
      {formData.childRelation}
    </div>
  );
}
