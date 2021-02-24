import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import { handleScrollOnInputFocus } from '../utils/helpers';

const Checkbox = ({
  checked,
  className,
  errorMessage,
  id,
  label,
  name,
  onChange,
  onFocus,
  required,
}) => {
  const inputId = _.uniqueId('errorable-checkbox-');
  const hasErrors = !!errorMessage;
  const errorSpanId = hasErrors ? `${inputId}-error-message` : undefined;

  return (
    <div
      className={classNames(className, 'form-checkbox', {
        'usa-input-error': hasErrors,
      })}
    >
      <input
        aria-describedby={errorSpanId}
        checked={checked}
        id={id || inputId}
        name={name}
        type="checkbox"
        onChange={onChange}
        onFocus={onFocus}
      />
      <label
        className={classNames('gi-checkbox-label', {
          'usa-input-error-label': hasErrors,
        })}
        name={`${name}-label`}
        htmlFor={inputId}
      >
        {label}
        {required && <span className="form-required-span">*</span>}
      </label>
      {hasErrors && (
        <span className="usa-input-error-message" role="alert" id={errorSpanId}>
          <span className="sr-only">Error</span> {errorMessage}
        </span>
      )}
    </div>
  );
};

Checkbox.propTypes = {
  checked: PropTypes.bool,
  errorMessage: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  onFocus: PropTypes.func,
};

Checkbox.defaultProps = {
  onFocus: handleScrollOnInputFocus,
};

export default Checkbox;
