import React, { useRef } from 'react';
import PropTypes from 'prop-types';

const numberTypes = new Set(['number', 'integer']);

export default function TextWidget(props) {
  const inputElement = useRef();
  let inputType = props.options.inputType;
  if (!inputType) {
    inputType = numberTypes.has(props.schema.type) ? 'number' : props.type;
  }

  const pageIndex = props.formContext?.pagePerItemIndex;
  /**
   * addIndex
   * ui:options.ariaDescribedby id may be within an array, so the page index
   * from formContext pagePerItemIndex will be appended
   * @param {String|null} id - aria-describedby id of associated content
   */
  const addIndex = (id = '') =>
    id && typeof pageIndex !== 'undefined' ? `${id}_${pageIndex}` : id;

  /**
   * setAriaInvalid
   * sets the aria-invalid attribute on the input element if there is an associated error message.
   * timeout is used to wait for the error message to appear in the DOM.
   */
  const setAriaInvalid = () => {
    let invalid = 'false';
    if (inputElement.current) {
      setTimeout(() => {
        const errorMessage = document.getElementById(
          `${inputElement.current.id}-error-message`,
        );

        if (errorMessage) {
          inputElement.current.ariaInvalid = 'true';
          invalid = 'true';
        } else {
          inputElement.current.ariaInvalid = 'false';
          invalid = 'false';
        }
      }, 0);
    }

    return invalid;
  };

  const inputProps = {
    ...(props.schema.minValue && { min: props.schema.minValue }),
    ...(props.schema.maxValue && { max: props.schema.maxValue }),
    autoComplete: props.options.autocomplete,
    type: inputType,
    id: props.id,
    name: props.id,
    disabled: props.disabled,
    maxLength: props.schema.maxLength,
    className: props.options.widgetClassNames,
    value: typeof props.value === 'undefined' ? '' : props.value,
    onBlur: event => {
      props.onBlur(props.id);
      if (event.target.id) setAriaInvalid();
    },
    onChange: event => {
      props.onChange(event.target.value ? event.target.value : undefined);
      if (event.target.id) setAriaInvalid();
    },
    onFocus: event => {
      if (event.target.id) setAriaInvalid();
    },
    'aria-describedby': addIndex(props.options?.ariaDescribedby || null),
    'aria-invalid': setAriaInvalid(),
  };

  return <input {...inputProps} ref={inputElement} />;
}
TextWidget.propTypes = {
  /**
   * ui:options from uiSchema
   */
  options: PropTypes.shape({
    /*
    * input's autocomplete attribute value
    */
    autocomplete: PropTypes.string,
    /**
     * input's aria-describedby attribute
     */
    ariaDescribedby: PropTypes.string,
  }),
};

TextWidget.defaultProps = {
  options: {},
  type: 'text',
};
