import PropTypes from 'prop-types';
import React from 'react';

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
  return (
    <>
      <va-textarea
        id={id}
        className="form-control"
        label={schema.title}
        value={typeof value === 'undefined' ? '' : value}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readonly}
        charcount
        maxLength={schema.maxLength}
        onBlur={onBlur && (event => onBlur(id, event.target.value))}
        onInput={evt =>
          onChange(evt.target.value === '' ? undefined : evt.target.value)
        }
        uswds
        data-testid="reason-comment-field"
      />
    </>
  );
}

TextareaWidget.propTypes = {
  id: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired,
  autofocus: PropTypes.bool,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  readonly: PropTypes.bool,
  required: PropTypes.bool,
  value: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
};

export default TextareaWidget;
