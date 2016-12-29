import React from 'react';

export default function FieldTemplate(props) {
  const { id, description, schema, label, help, required, rawErrors, children, formContext } = props;
  const hasErrors = (formContext.submitted || formContext.touched[id]) && rawErrors && rawErrors.length;
  const requiredSpan = required ? <span className="form-required-span">*</span> : null;

  let errorSpanId;
  let errorSpan;
  if (hasErrors) {
    errorSpanId = `${id}-error-message`;
    errorSpan = <span className="usa-input-error-message" id={`${errorSpanId}`}>{rawErrors[0]}</span>;
  }

  return schema.type === 'object'
    ? children
    : (<div className={hasErrors ? 'usa-input-error' : null}>
      <label className={hasErrors ? 'usa-input-error-label' : null} htmlFor={id}>{label}{requiredSpan}</label>
      {errorSpan}
      {children}
      {help}
    </div>
    );
}
