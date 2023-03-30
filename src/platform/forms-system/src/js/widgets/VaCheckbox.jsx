import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { VaCheckbox as CoolCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { FieldTemplateContext } from '../components/FieldTemplateContext';

export default function VaCheckbox({
  id,
  value,
  required,
  disabled,
  label,
  onChange,
  options,
}) {
  const { rawErrors, hasErrors } = useContext(FieldTemplateContext);

  // const requiredSpan = required ? (
  //   <span className="form-required-span">(*Required)</span>
  // ) : null;
  // const widgetClasses = classNames('form-checkbox', options.widgetClassNames);

  const { widgetProps } = options;

  const getWidgetProps = val => widgetProps?.[val] || {};

  return (
    <CoolCheckbox
      id={id}
      name={id}
      label={options.title || label}
      checked={typeof value === 'undefined' ? false : value}
      required={required}
      error={hasErrors ? rawErrors[0] : null}
      disabled={disabled}
      vaChange={event => onChange(event.target.checked)}
      {...getWidgetProps(value ?? false)}
    />
  );
}

VaCheckbox.defaultProps = {
  autofocus: false,
};

VaCheckbox.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.bool,
  required: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  options: PropTypes.object,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
