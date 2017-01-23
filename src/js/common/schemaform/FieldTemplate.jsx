import React from 'react';

/*
 * This is the template for each field (which in the schema library means label + widget)
 */

export default function FieldTemplate(props) {
  const { id, schema, help, required, rawErrors, children, formContext, uiSchema } = props;
  const hasErrors = (formContext.submitted || formContext.touched[id]) && rawErrors && rawErrors.length;
  const requiredSpan = required ? <span className="form-required-span">*</span> : null;
  const label = uiSchema['ui:title'] || props.label;
  const isDateField = uiSchema['ui:widget'] === 'date';

  let errorSpanId;
  let errorSpan;
  let errorClass;
  if (hasErrors) {
    errorClass = isDateField ? 'input-error-date' : 'usa-input-error';
    errorSpanId = `${id}-error-message`;
    errorSpan = <span className="usa-input-error-message" id={`${errorSpanId}`}>{rawErrors[0]}</span>;
  }

  return schema.type === 'object' || schema.type === 'array'
    ? children
    : (<div className={errorClass}>
      <label className={hasErrors && !isDateField ? 'usa-input-error-label' : null} htmlFor={id}>{label}{requiredSpan}</label>
      {errorSpan}
      {<div className={isDateField && hasErrors ? 'usa-input-error form-error-date' : null}>{children}</div>}
      {help}
    </div>
    );
}
