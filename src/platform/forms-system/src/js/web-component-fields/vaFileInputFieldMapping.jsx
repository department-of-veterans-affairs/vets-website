import commonFieldMapping from './commonFieldMapping';
import formsPatternFieldMapping from './formsPatternFieldMapping';
import { allKeysAreEmpty } from './vaFileInputFieldHelpers';

/** @param {WebComponentFieldProps} props */
const vaFileInputFieldMapping = props => {
  const { name, textDescription, childrenProps, uiOptions } = props;
  const commonFieldProps = commonFieldMapping(props);
  const { formsPatternProps } = formsPatternFieldMapping(props);

  return {
    ...commonFieldProps,
    ...formsPatternProps,
    accept: uiOptions?.accept || '.pdf,.jpeg,.png', // A comma-separated list of unique file type specifiers.
    buttonText: uiOptions?.buttonText,
    fileUploadUrl: uiOptions?.fileUploadUrl,
    readOnly: uiOptions?.readOnly,
    headerSize: commonFieldProps.labelHeaderLevel,
    messageAriaDescribedby:
      commonFieldProps.messageAriaDescribedby || textDescription || undefined,
    name,
    onBlur: () => childrenProps.onBlur(childrenProps.idSchema.$id),
    uploadedFile: allKeysAreEmpty(childrenProps.formData)
      ? null
      : childrenProps.formData,
  };
};

export default vaFileInputFieldMapping;
