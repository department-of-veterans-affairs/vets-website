import commonFieldMapping from './commonFieldMapping';
import formsPatternFieldMapping from './formsPatternFieldMapping';
import {
  getInputType,
  generateFieldChildren,
  createBaseFieldMapping,
} from '../utilities/field-mapping';

/** @param {WebComponentFieldProps} props */
export default function vaTextInputFieldMapping(props) {
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
  const baseFieldMapping = createBaseFieldMapping(props);

  return {
    ...commonFieldProps,
    ...formsPatternProps,
    ...baseFieldMapping,
    autocomplete:
      childrenProps.uiSchema['ui:autocomplete'] || uiOptions?.autocomplete,
    messageAriaDescribedby:
      commonFieldProps.messageAriaDescribedby || textDescription || undefined,
    type: getInputType(childrenProps.schema, uiOptions),
    width: uiOptions?.width,
    charcount: uiOptions?.charcount,
    currency: uiOptions?.currency,
    inputSuffix: uiOptions?.inputSuffix,
    inputIconSuffix: uiOptions?.inputIconSuffix,
    inputPrefix: uiOptions?.inputPrefix,
    inputIconPrefix: uiOptions?.inputIconPrefix,
    onChange: childrenProps.onChange,
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
