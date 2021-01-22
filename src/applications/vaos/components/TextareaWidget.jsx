import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

function TextareaWidget({
  schema,
  id,
  placeholder,
  value,
  required,
  disabled,
  readonly,
  onChange,
  onBlur,
}) {
  let remainingCharacters = null;
  let isOverLimit = false;
  let characterLimitClasses = null;

  if (schema.maxLength) {
    remainingCharacters = schema.maxLength - (value?.length || 0);
    isOverLimit = remainingCharacters < 0;
    characterLimitClasses = classNames('vads-u-font-style--italic', {
      'vads-u-color--secondary-dark': isOverLimit,
    });
  }

  return (
    <>
      <textarea
        id={id}
        className="form-control"
        value={typeof value === 'undefined' ? '' : value}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readonly}
        maxLength={schema.maxLength}
        onBlur={onBlur && (event => onBlur(id, event.target.value))}
        onChange={evt =>
          onChange(evt.target.value === '' ? undefined : evt.target.value)
        }
      />
      {!!schema.maxLength && (
        <div className={characterLimitClasses}>
          {`${Math.abs(remainingCharacters)} ${
            isOverLimit ? 'characters over the limit' : 'characters remaining'
          }`}
        </div>
      )}
    </>
  );
}

TextareaWidget.propTypes = {
  schema: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  required: PropTypes.bool,
  autofocus: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
};

export default TextareaWidget;
