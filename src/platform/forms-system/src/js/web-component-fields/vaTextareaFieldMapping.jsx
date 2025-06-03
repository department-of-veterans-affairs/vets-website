import commonFieldMapping from './commonFieldMapping';
import formsPatternFieldMapping from './formsPatternFieldMapping';
import {
  generateFieldChildren,
  createBaseFieldMapping,
} from '../utilities/field-mapping';

/** @param {WebComponentFieldProps} props */
export default function vaTextareaFieldMapping(props) {
  const {
    description,
    textDescription,
    DescriptionField,
    uiOptions,
    index,
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
    messageAriaDescribedby:
      commonFieldProps.messageAriaDescribedby || textDescription || undefined,
    charcount: uiOptions?.charcount,
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
