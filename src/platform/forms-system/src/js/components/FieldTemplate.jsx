import React from 'react';
import _ from 'lodash/fp'; // eslint-disable-line no-restricted-imports
import classNames from 'classnames';
import { isReactComponent } from '../../../../utilities/ui';
// import environment from 'platform/utilities/environment';

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
    uiSchema,
  } = props;

  const isTouched =
    formContext.touched[id] ||
    Object.keys(formContext.touched).some(touched => id.startsWith(touched));
  const hasErrors =
    (formContext.submitted || isTouched) && rawErrors && rawErrors.length;
  const requiredSpan = required ? (
    <span className="schemaform-required-span">(*Required)</span>
  ) : null;
  const label = uiSchema['ui:title'] || props.label || '';
  const isDateField = uiSchema['ui:widget'] === 'date';
  const showFieldLabel =
    uiSchema['ui:options'] && uiSchema['ui:options'].showFieldLabel;
  const useLabelElement = showFieldLabel === 'label';

  const description = uiSchema['ui:description'];
  const textDescription = typeof description === 'string' ? description : null;
  const DescriptionField = isReactComponent(description)
    ? uiSchema['ui:description']
    : null;
  const isFieldGroup =
    isDateField ||
    uiSchema['ui:widget'] === 'yesNo' ||
    uiSchema['ui:widget'] === 'radio';

  let errorSpanId;
  let errorSpan;
  let errorClass;
  if (hasErrors) {
    errorClass = `usa-input-error ${isDateField ? 'input-error-date' : ''}`;
    errorSpanId = `${id}-error-message`;
    errorSpan = (
      <span className="usa-input-error-message" role="alert" id={errorSpanId}>
        <span className="sr-only">Error</span> {rawErrors[0]}
      </span>
    );
  }

  const containerClassNames = classNames(
    'schemaform-field-template',
    errorClass,
    _.get(['ui:options', 'classNames'], uiSchema),
  );
  const labelClassNames = classNames({
    'usa-input-error-label': hasErrors && !isDateField,
    'schemaform-label': true,
  });

  const inputWrapperClassNames = classNames('schemaform-widget-wrapper', {
    'form-error-date': isDateField && hasErrors,
  });

  const noWrapperContent =
    !showFieldLabel &&
    (schema.type === 'object' ||
      schema.type === 'array' ||
      (schema.type === 'boolean' && !uiSchema['ui:widget']));

  if (noWrapperContent) {
    return children;
  }

  const useFieldsetLegend =
    (isFieldGroup || !!showFieldLabel) && !useLabelElement;

  const labelElement = useFieldsetLegend ? (
    <legend id={`${id}-label`} className={labelClassNames}>
      {label}
      {requiredSpan}
    </legend>
  ) : (
    <label id={`${id}-label`} className={labelClassNames} htmlFor={id}>
      {label}
      {requiredSpan}
    </label>
  );

  // Don't render hidden or empty labels - prevents duplicate IDs on review &
  // submit page
  const showLabel =
    !uiSchema['ui:options']?.hideLabelText &&
    (typeof label !== 'string' || (requiredSpan || label.trim()));

  const content = (
    <>
      {showLabel && labelElement}
      {textDescription && <p>{textDescription}</p>}
      {DescriptionField && (
        <DescriptionField options={uiSchema['ui:options']} />
      )}
      {!textDescription && !DescriptionField && description}
      {errorSpan}
      {<div className={inputWrapperClassNames}>{children}</div>}
      {help}
    </>
  );

  if (useFieldsetLegend) {
    return <fieldset className={containerClassNames}>{content}</fieldset>;
  }

  return <div className={containerClassNames}>{content}</div>;
}
