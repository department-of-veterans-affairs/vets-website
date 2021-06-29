import React from 'react';
import PropTypes from 'prop-types';

const numberTypes = new Set(['number', 'integer']);
const indexRegex = /:index/g;

export default function TextWidget(props) {
  const pageIndex = props.formContext?.pagePerItemIndex;
  let inputType = props.options.inputType;
  if (!inputType) {
    inputType = numberTypes.has(props.schema.type) ? 'number' : props.type;
  }

  /**
   * replaceIndex
   * ariaDescribedby id may need to be indexed, add `:index` to the id and the
   * formContext pagePerItemIndex will replace it
   * @param {String|null} id - aria-describedby id with ":index" placeholder
   */
  const replaceIndex = (id = '') =>
    id && pageIndex !== 'undefined' ? id.replace(indexRegex, pageIndex) : id;

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
    'aria-describedby': replaceIndex(props.options?.ariaDescribedby || null),
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
