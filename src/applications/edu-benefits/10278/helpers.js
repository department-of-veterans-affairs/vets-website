import React from 'react';

export const DISCLOSURE_KEYS = [
  'statusOfClaim',
  'currentBenefit',
  'paymentHistory',
  'amountOwed',
  'minor',
  'other',
];

export const DISCLOSURE_OPTIONS = {
  statusOfClaim: 'Status of pending claim or appeal',
  currentBenefit: 'Current benefit and rate',
  paymentHistory: 'Payment history',
  amountOwed: 'Amount of money owed VA',
  minor: {
    title: 'Minor claimants only',
    description: 'This is for change of address or direct deposit',
  },
  other: {
    title: 'Other',
    description: "Third parties can't initiate any changes to your record",
  },
};

export const getFullName = fullName => {
  if (!fullName) return null;

  const first = (fullName?.first || '').trim();
  const middle = (fullName?.middle || '').trim();
  const last = (fullName?.last || '').trim();

  return [first, middle, last].filter(Boolean).join(' ');
};

export const organizationRepresentativesArrayOptions = {
  arrayPath: 'organizationRepresentatives',
  nounSingular: 'representative',
  nounPlural: 'representatives',
  required: true,
  isItemIncomplete: item => !item?.fullName?.first || !item?.fullName?.last,
  text: {
    cancelAddButtonText: () => 'Cancel adding this individual’s information',
    cancelEditButtonText: () => 'Cancel editing this individual’s information',
    getItemName: item => getFullName(item?.fullName),
    cardDescription: (item, index, fullData) =>
      fullData?.organizationName || '',
    summaryTitle: 'Review the names of organization’s representatives',
  },
};

export const getThirdPartyName = formData => {
  if (formData?.discloseInformation?.authorize === 'organization') {
    return formData?.organizationName;
  }

  return getFullName(formData?.thirdPartyPersonName?.fullName);
};

/**
 * Require at least one checkbox.
 * Attach to ONE checkbox key so forms-system has a concrete error path
 * (helps scrollToFirstError + consistent errorSchema shape).
 */
export const buildValidateAtLeastOne = disclosureKeys => (
  errors,
  fieldData,
) => {
  const anyChecked = disclosureKeys.some(k => Boolean(fieldData?.[k]));
  if (!anyChecked) {
    const msg = 'You must provide an answer';
    const anchorKey = disclosureKeys[0];
    if (errors?.[anchorKey]?.addError) {
      errors[anchorKey].addError(msg);
    } else {
      errors.addError(msg);
    }
  }
};

/** If "other" is checked, require otherText */
export const validateOtherText = (errors, fieldData) => {
  if (fieldData?.other) {
    const val = (fieldData?.otherText || '').trim();
    if (!val) {
      const msg = 'Enter other information';
      if (errors?.otherText?.addError) {
        errors.otherText.addError(msg);
      } else {
        errors.addError(msg);
      }
    }
  }
};

export const ClaimInformationDescription = ({ formData }) => {
  const claimInformation = formData?.claimInformation;
  const claimInformationKeys = Object.keys(claimInformation);
  const claimInformationLabels = claimInformationKeys
    .filter(key => key !== 'otherText')
    .map((key, index) => {
      if (!claimInformation[key]) {
        return null;
      }

      const specialLabels = {
        minor: 'Change of address or direct deposit (minor claimants only)',
        other: `Other: ${claimInformation.otherText}`,
      };

      const label = specialLabels[key] || DISCLOSURE_OPTIONS[key];
      return <li key={index}>{label}</li>;
    });
  return (
    <va-card background>
      <div>
        <h3 className="vads-u-margin-top--0">
          Here’s the personal information you selected:
        </h3>
        <ul>{claimInformationLabels}</ul>
      </div>
    </va-card>
  );
};

export const InformationToDiscloseReviewField = ({
  children,
  disclosureKeys,
  options,
  dataKey,
  otherTextKey,
}) => {
  const formDataFromChildren = children?.props?.formData;

  const value =
    formDataFromChildren?.[dataKey] &&
    typeof formDataFromChildren[dataKey] === 'object'
      ? formDataFromChildren[dataKey]
      : formDataFromChildren || {};

  const isSelected = key => Boolean(value?.[key]);
  const otherText = (value?.[otherTextKey] || '').trim();

  return (
    <>
      {disclosureKeys.map(key => {
        const opt = options[key];
        const label = typeof opt === 'string' ? opt : opt.title;

        let ddValue = '';

        if (key === 'other') {
          if (isSelected('other')) {
            ddValue = otherText || 'Selected';
          }
        } else if (isSelected(key)) {
          ddValue = 'Selected';
        }

        return (
          <div key={key} className="review-row">
            <dt>{label}</dt>
            <dd>
              {ddValue ? (
                <span
                  className="dd-privacy-hidden"
                  data-dd-action-name="data value"
                >
                  {ddValue}
                </span>
              ) : null}
            </dd>
          </div>
        );
      })}
    </>
  );
};
