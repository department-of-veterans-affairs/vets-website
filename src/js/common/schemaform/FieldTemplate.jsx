import React from 'react';
import _ from 'lodash/fp';
import classNames from 'classnames';

/*
 * This is the template for each field (which in the schema library means label + widget)
 */

export default function FieldTemplate(props) {
  const {
    id,
    schema,
    help,
    required,
    rawErrors,
    children,
    formContext,
    uiSchema
  } = props;

  const hasErrors = (formContext.submitted || formContext.touched[id])
    && rawErrors && rawErrors.length;
  const requiredSpan = required
    ? <span className="schemaform-required-span">(*Required)</span>
    : null;
  const label = uiSchema['ui:title'] || props.label;
  const isDateField = uiSchema['ui:widget'] === 'date';
  const showFieldLabel = uiSchema['ui:options'] && uiSchema['ui:options'].showFieldLabel;
  const hideLabelText = uiSchema['ui:options'] && uiSchema['ui:options'].hideLabelText;

  const description = uiSchema['ui:description'];
  const textDescription = typeof description === 'string' ? description : null;
  const DescriptionField = typeof description === 'function'
    ? uiSchema['ui:description']
    : null;

  let errorSpanId;
  let errorSpan;
  let errorClass;
  if (hasErrors) {
    errorClass = isDateField ? 'input-error-date' : 'usa-input-error';
    errorSpanId = `${id}-error-message`;
    errorSpan = <span className="usa-input-error-message" id={`${errorSpanId}`}>{rawErrors[0]}</span>;
  }

  const containerClassNames = classNames(
    'schemaform-field-template',
    _.get(['ui:options', 'classNames'], uiSchema)
  );
  const labelClassNames = classNames({
    'usa-input-error-label': hasErrors && !isDateField,
    'schemaform-label': true
  });

  const inputWrapperClassNames = classNames('schemaform-widget-wrapper', {
    'usa-input-error form-error-date': isDateField && hasErrors
  });

  return (schema.type === 'object'
    || schema.type === 'array'
    || (schema.type === 'boolean' && !uiSchema['ui:widget'])
  ) && !showFieldLabel
    ? children
    : (<div className={containerClassNames}>
      <div className={errorClass}>
        {!hideLabelText && <label className={labelClassNames} htmlFor={id}>{label}{requiredSpan}</label>}
        {textDescription && <p>{textDescription}</p>}
        {DescriptionField && <DescriptionField options={uiSchema['ui:options']}/>}
        {!textDescription && !DescriptionField && description}
        {errorSpan}
        {<div className={inputWrapperClassNames}>{children}</div>}
        {help}
      </div>
    </div>
    );
}
