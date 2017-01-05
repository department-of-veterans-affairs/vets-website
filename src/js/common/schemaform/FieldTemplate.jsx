import React from 'react';

/*
 * This is the template for each field (which in the schema library means label + widget)
 */

export default function FieldTemplate(props) {
  const { id, schema, label, help, required, rawErrors, children, formContext, uiSchema } = props;
  const hasErrors = (formContext.submitted || formContext.touched[id]) && rawErrors && rawErrors.length;
  const requiredSpan = required ? <span className="form-required-span">*</span> : null;

  let errorSpanId;
  let errorSpan;
  let errorClass;
  if (hasErrors) {
    errorClass = `usa-input-error${uiSchema['ui:field'] === 'mydate' ? ' form-error-date' : ''}`;
    errorSpanId = `${id}-error-message`;
    errorSpan = <span className="usa-input-error-message" id={`${errorSpanId}`}>{rawErrors[0]}</span>;
  }

  return schema.type === 'object' || schema.type === 'array'
    ? children
    : (<div className={errorClass}>
      <label className={hasErrors ? 'usa-input-error-label' : null} htmlFor={id}>{label}{requiredSpan}</label>
      {errorSpan}
      {children}
      {help}
    </div>
    );
}
