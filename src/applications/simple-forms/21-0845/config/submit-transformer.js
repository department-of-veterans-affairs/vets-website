import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';

import { LIMITED_INFORMATION_ITEMS } from '../definitions/constants';

const escapedCharacterReplacer = (_key, value) => {
  if (typeof value === 'string') {
    return value
      .replaceAll('"', "'")
      .replace(/(?:\r\n|\n\n|\r|\n)/g, '; ')
      .replace(/(?:\t|\f|\b)/g, '')
      .replace(/\\(?!(f|n|r|t|[u,U][\d,a-fA-F]{4}))/gm, '/');
  }

  return value;
};

export default function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    formsSystemTransformForSubmit(formConfig, form),
  );
  const { limitedInformationItems } = transformedData;

  if (limitedInformationItems) {
    // convert object of LIMITED_INFORMATION_ITEMS keys & booleans to
    // comma-separated string of corresponding titles [label-texts]
    transformedData.limitedInformationItems = Object.keys(
      limitedInformationItems,
    )
      .filter(key => limitedInformationItems[key])
      .map(filteredKey => LIMITED_INFORMATION_ITEMS[filteredKey].title)
      .join(',');
  }

  return JSON.stringify(
    { ...transformedData, formNumber: formConfig.formId },
    escapedCharacterReplacer,
  );
}
