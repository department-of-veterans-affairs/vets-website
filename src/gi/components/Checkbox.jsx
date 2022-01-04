import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import { createId, handleScrollOnInputFocus } from '../utils/helpers';

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
  labelAriaLabel,
  inputAriaLabelledBy,
  inputAriaLabel,
  screenReaderOnly,
  showArialLabelledBy,
}) => {
  const inputId = _.uniqueId('errorable-checkbox-');
  const hasErrors = !!errorMessage;
  const errorSpanId = hasErrors ? `${inputId}-error-message` : undefined;
  const labelId = `${createId(name)}-label`;
  const ariaLabelledBy = [inputAriaLabelledBy, labelId].filter(
    ariaId => ariaId !== null && ariaId !== undefined,
  );
  const ariaLabelledByContent = inputAriaLabel
    ? null
    : ariaLabelledBy.join(' ');

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
        name={createId(name)}
        type="checkbox"
        onChange={onChange}
        onFocus={onFocus}
        aria-label={inputAriaLabel}
        aria-labelledby={showArialLabelledBy ? ariaLabelledByContent : null}
      />
      <label
        className={classNames('gi-checkbox-label', {
          'usa-input-error-label': hasErrors,
        })}
        id={labelId}
        name={labelId}
        htmlFor={inputId}
        aria-label={labelAriaLabel}
      >
        {label}
        {required && <span className="form-required-span">*</span>}
        {screenReaderOnly && (
          <span className="vads-u-visibility--screen-reader">
            {screenReaderOnly}
          </span>
        )}
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
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  onFocus: PropTypes.func,
  ariaLabel: PropTypes.string.isRequired,
};

Checkbox.defaultProps = {
  onFocus: handleScrollOnInputFocus,
};

export default Checkbox;
