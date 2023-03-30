import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { FieldTemplateContext } from '../components/FieldTemplateContext';

const numberTypes = new Set(['number', 'integer']);

function VaTextWidget(props) {
  const { rawErrors, hasErrors, label } = useContext(FieldTemplateContext);

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
    // type: inputType,
    id: props.id,
    name: props.id,
    error: hasErrors ? rawErrors[0] : null,
    label,
    disabled: props.disabled,
    maxLength: props.schema.maxLength,
    className: props.options.widgetClassNames,
    value: typeof props.value === 'undefined' ? '' : props.value,
    onBlur: () => props.onBlur(props.id),
    onInput: event =>
      props.onChange(event.target.value ? event.target.value : undefined),
    onFocus: props.onFocus,
    required: props.required,
    'message-aria-describedby': addIndex(
      props.options?.ariaDescribedby || null,
    ),
  };

  return <VaTextInput {...inputProps} />;
}

// const mapStateToProps = state => ({
//   theState: state,
//   // formData: state.form?.data || {},
//   // additionalIssues: state.form?.data.additionalIssues || [],
// });
// const mapDispatchToProps = {
//   // setFormData: setData,
// };

export default VaTextWidget;
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )(VaTextWidget);

VaTextWidget.propTypes = {
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

VaTextWidget.defaultProps = {
  options: {
    title: '',
  },
  type: 'text',
};
