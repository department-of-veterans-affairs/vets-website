import { getIssueName, getSelected } from '../utils/issues';
import { errorMessages } from '../../995/constants';
import sharedErrorMessages from '../content/errorMessages';
import { REGEXP } from '../constants';

export const validateIssues = (
  errors,
  _data,
  fullData,
  _schema,
  _uiSchema,
  currentIndex = 0,
  vaOrPrivateLocations,
) => {
  const issues = fullData?.[vaOrPrivateLocations]?.[currentIndex]?.issues || [];
  const selectedIssues = getSelected(fullData).map(getIssueName);
  const allSelectedIssues = issues.every(issue =>
    selectedIssues.includes(issue),
  );
  if (!issues?.length || !allSelectedIssues) {
    errors.addError(errorMessages.evidence.issuesMissing);
  }
};

export const validateUniqueLocationOrFacility = (
  currentIndex,
  errors,
  uniqueVaOrPrivate,
  vaOrPrivateLocations,
) => {
  const uniqueVaOrPrivateLocations = new Set(vaOrPrivateLocations);
  const len = vaOrPrivateLocations.length;
  if (len > 1 && len !== uniqueVaOrPrivateLocations.size) {
    const hasDuplicate = vaOrPrivateLocations.find(vaOrPrivateLocation => {
      if (vaOrPrivateLocation.replace(REGEXP.COMMA, '') === '') {
        return false;
      }
      const firstIndex = vaOrPrivateLocations.indexOf(vaOrPrivateLocation);
      const lastIndex = vaOrPrivateLocations.lastIndexOf(vaOrPrivateLocation);
      // only
      return firstIndex !== lastIndex && lastIndex === currentIndex;
    });
    if (hasDuplicate) {
      errors.addError(errorMessages.evidence[uniqueVaOrPrivate]);
    }
  }
};

export const validateAddressParts = (errors, data, addressPart) => {
  const addressData = data.providerFacilityAddress || {};
  const addPart = addressData[addressPart];
  if (!addPart) {
    errors.addError(sharedErrorMessages[addressPart]);
  }
};
