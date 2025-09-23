import React from 'react';
import PropTypes from 'prop-types';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import commonFieldMapping from 'platform/forms-system/src/js/web-component-fields/commonFieldMapping';
import formsPatternFieldMapping from 'platform/forms-system/src/js/web-component-fields/formsPatternFieldMapping';

/**
 * Custom text input field that capitalizes text on blur
 * @param {WebComponentFieldProps} props
 */

export default function CapitalizingTextInputField(props) {
  const {
    description,
    textDescription,
    DescriptionField,
    uiOptions,
    index,
    childrenProps,
  } = props;

  const commonFieldProps = commonFieldMapping(props);
  const { formsPatternProps, formDescriptionSlot } = formsPatternFieldMapping(
    props,
  );

  const handleInput = (event, value) => {
    let newVal = value || event.target.value;
    newVal = newVal === '' ? undefined : newVal;
    childrenProps.onChange(newVal);
  };

  const handleBlur = () => {
    const currentValue = childrenProps.formData;
    if (currentValue && typeof currentValue === 'string') {
      const capitalizedValue = currentValue.toUpperCase();
      if (capitalizedValue !== currentValue) {
        childrenProps.onChange(capitalizedValue);
      }
    }

    childrenProps.onBlur(childrenProps.idSchema.$id);
  };

  const mappedProps = {
    ...commonFieldProps,
    ...formsPatternProps,
    autocomplete:
      childrenProps.uiSchema['ui:autocomplete'] || uiOptions?.autocomplete,
    value:
      typeof childrenProps.formData === 'undefined'
        ? ''
        : childrenProps.formData,
    messageAriaDescribedby:
      commonFieldProps.messageAriaDescribedby || textDescription || undefined,
    width: uiOptions?.width,
    onInput: handleInput,
    onBlur: handleBlur,
    children: (
      <>
        {formDescriptionSlot}
        {textDescription && <p>{textDescription}</p>}
        {DescriptionField && (
          <DescriptionField options={uiOptions} index={index} />
        )}
        {!textDescription && !DescriptionField && description}
      </>
    ),
  };

  return <VaTextInput {...mappedProps} />;
}

CapitalizingTextInputField.propTypes = {
  childrenProps: PropTypes.shape({
    formData: PropTypes.any,
    idSchema: PropTypes.shape({
      $id: PropTypes.string.isRequired,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    uiSchema: PropTypes.shape({
      'ui:autocomplete': PropTypes.string,
    }).isRequired,
  }).isRequired,
  description: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.func,
  ]),
  DescriptionField: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  textDescription: PropTypes.string,
  uiOptions: PropTypes.shape({
    autocomplete: PropTypes.string,
    width: PropTypes.string,
  }),
};
