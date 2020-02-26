import React from 'react';

export function stepchildInfo({ formData }) {
  return (
    <div className="vads-u-padding--2">
      <strong>
        {formData.first} {formData.last} 
      </strong>
      <br />
    </div>
  );
}