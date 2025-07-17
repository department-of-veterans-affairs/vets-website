import commonFieldMapping from './commonFieldMapping';
import formsPatternFieldMapping from './formsPatternFieldMapping';
import { allKeysAreEmpty } from './vaFileInputFieldHelpers';

const DEFAULT_ACCEPT_TYPES = '.pdf,.jpeg,.png';

/** @param {WebComponentFieldProps} props */
const vaFileInputFieldMapping = props => {
  const { textDescription, childrenProps, uiOptions } = props;
  const commonFieldProps = commonFieldMapping(props);
  const { formsPatternProps } = formsPatternFieldMapping(props);

  const _accept = uiOptions?.accept;
  const accept = Array.isArray(_accept)
    ? _accept.join(',')
    : DEFAULT_ACCEPT_TYPES;

  return {
    ...commonFieldProps,
    ...formsPatternProps,
    accept,
    maxFileSize: uiOptions?.maxFileSize || Infinity,
    minFileSize: uiOptions?.minFileSize || 0,
    statusText: uiOptions?.statusText || '',
    buttonText: uiOptions?.buttonText,
    readOnly: uiOptions?.readOnly,
    headerSize: commonFieldProps.labelHeaderLevel || uiOptions?.headerSize,
    messageAriaDescribedby:
      commonFieldProps.messageAriaDescribedby || textDescription || undefined,
    onBlur: () => childrenProps.onBlur(childrenProps.idSchema.$id),
    uploadedFile: allKeysAreEmpty(childrenProps.formData)
      ? null
      : childrenProps.formData,
    additionalInput: uiOptions.additionalInput
      ? uiOptions.additionalInput
      : null,
    handleAdditionalInput: uiOptions.handleAdditionalInput,
  };
};

export default vaFileInputFieldMapping;
