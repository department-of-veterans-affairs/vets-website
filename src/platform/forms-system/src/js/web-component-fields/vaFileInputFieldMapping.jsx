import commonFieldMapping from './commonFieldMapping';
import formsPatternFieldMapping from './formsPatternFieldMapping';

const allPropertiesAreUndefined = fileInput =>
  Object.keys(fileInput).every(
    property => typeof fileInput[property] === 'undefined',
  );

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
    headerSize: commonFieldProps.labelHeaderLevel,
    messageAriaDescribedby:
      commonFieldProps.messageAriaDescribedby || textDescription || undefined,
    name,
    value: allPropertiesAreUndefined(childrenProps.formData)
      ? ''
      : childrenProps.formData,
  };
};

export default vaFileInputFieldMapping;
