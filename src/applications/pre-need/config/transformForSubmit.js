import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';
import { replaceEscapedCharacters } from 'platform/forms-system/src/js/utilities/replaceEscapedCharacters';

const escapedCharacterReplacer = (_key, value) => {
  if (typeof value === 'string') {
    return replaceEscapedCharacters(value);
  }

  return value;
};

export default function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    formsSystemTransformForSubmit(formConfig, form),
  );

  return JSON.stringify(
    { ...transformedData, formNumber: formConfig.formId },
    escapedCharacterReplacer,
  );
}
