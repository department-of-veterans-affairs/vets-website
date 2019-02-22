import React from 'react';
import PropTypes from 'prop-types';

const numberTypes = new Set(['number', 'integer']);

export default function TextWidget(props) {
  let inputType = props.options.inputType;
  if (!inputType) {
    inputType = numberTypes.has(props.schema.type) ? 'number' : props.type;
  }
  return (
    <input
      autoComplete={props.options.autocomplete}
      type={inputType}
      id={props.id}
      name={props.id}
      disabled={props.disabled}
      maxLength={props.schema.maxLength}
      className={props.options.widgetClassNames}
      value={typeof props.value === 'undefined' ? '' : props.value}
      onBlur={() => props.onBlur(props.id)}
      onChange={(event) => props.onChange(event.target.value ? event.target.value : undefined)}/>
  );
}
TextWidget.propTypes = {
  /**
   * ui:options from uiSchema
   */
  options: PropTypes.shape({
    /*
    * input's autocomplete attribute value
    */
    autocomplete: PropTypes.string
  }),
};

TextWidget.defaultProps = {
  options: {},
  type: 'text'
};
