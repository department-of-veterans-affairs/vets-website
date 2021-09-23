import React from 'react';

export default function DependentView({ formData }) {
  return (
    <div>
      gggg
      <strong>
        {formData.fullName.first} {formData.fullName.last}
      </strong>
      llll
      <br />
      {formData.dependentRelation}
    </div>
  );
}
