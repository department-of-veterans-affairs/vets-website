import React from 'react';

export default function FormTitle({ title, subTitle }) {
  return (
    <div className="schemaform-title">
      <h1 data-testid="form-title">{title}</h1>
      {subTitle && (
        <div className="schemaform-subtitle" data-testid="form-subtitle">
          {subTitle}
        </div>
      )}
    </div>
  );
}
