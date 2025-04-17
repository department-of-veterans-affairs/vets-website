import React from 'react';
import PropTypes from 'prop-types';

const numberTypes = new Set(['number', 'integer']);

export default function TextWidget(props) {
  let { inputType } = props.options;
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
    onBlur: () => props.onBlur(props.id),
    onChange: event =>
      props.onChange(event.target.value ? event.target.value : undefined),
    onFocus: props.onFocus,
    'aria-describedby': addIndex(props.options?.ariaDescribedby || null),
  };

  return <input {...inputProps} />;
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
