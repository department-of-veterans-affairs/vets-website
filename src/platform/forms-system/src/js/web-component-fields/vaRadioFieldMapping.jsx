import commonFieldMapping from './commonFieldMapping';
import formsPatternFieldMapping from './formsPatternFieldMapping';
import {
  generateFieldChildren,
  createBlurHandler,
  getFieldValue,
} from '../utilities/field-mapping';

/** @param {WebComponentFieldProps} props */
export default function vaRadioFieldMapping(props) {
  const {
    description,
    textDescription,
    DescriptionField,
    uiOptions,
    index,
    childrenProps,
  } = props;

  const { formsPatternProps, formDescriptionSlot } = formsPatternFieldMapping(
    props,
  );

  return {
    ...commonFieldMapping(props),
    ...formsPatternProps,
    description: textDescription,
    value: getFieldValue(childrenProps.formData, false),
    headerAriaDescribedby: uiOptions?.headerAriaDescribedby,
    onBlur: createBlurHandler(childrenProps.onBlur, childrenProps.idSchema.$id),
    children: generateFieldChildren({
      formDescriptionSlot,
      textDescription,
      DescriptionField,
      description,
      uiOptions,
      index,
    }),
  };
}
