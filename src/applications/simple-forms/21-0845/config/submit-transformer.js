import sharedTransformForSubmit from '../../shared/config/submit-transformer';

import { LIMITED_INFORMATION_ITEMS } from '../definitions/constants';

export default function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    sharedTransformForSubmit(formConfig, form),
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

  return JSON.stringify(transformedData);
}
