import React from 'react';

export const validateInitials = (inputValue, firstName, lastName) => {
  if (!inputValue || inputValue.length === 0) {
    return '';
  }

  const lettersOnlyPattern = /^[A-Za-z]+$/;
  if (!lettersOnlyPattern.test(inputValue)) {
    return 'Please enter your initials using letters only';
  }

  let lastName2;

  const hyphenIndex = lastName.indexOf('-');
  if (hyphenIndex !== -1) {
    lastName2 = lastName.substring(hyphenIndex + 1);
  }

  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();
  const lastInitial2 = lastName2?.charAt(0).toUpperCase();

  const inputFirst = inputValue.charAt(0);
  const inputSecond = inputValue.charAt(1);

  if (inputFirst !== firstInitial || inputSecond !== lastInitial) {
    return `Initials must match your name: ${firstName} ${lastName}`;
  }

  if (inputValue.length === 3) {
    const inputThird = inputValue.charAt(2);

    if (inputThird !== lastInitial2) {
      return `Initials must match your name: ${firstName} ${lastName}`;
    }
  }

  return '';
};

export const getCardDescription = item => {
  return item ? (
    <>
      <p>
        <strong>Facility Code: </strong>
        {item.facilityCode}
      </p>
      <p>
        <strong>Institution: </strong>
        {item.institutionName}
      </p>
      {item.institutionAddress && (
        <p>
          <strong>Address: </strong>
          {[
            item.institutionAddress.street,
            item.institutionAddress.street2,
            item.institutionAddress.street3,
            item.institutionAddress.city,
            item.institutionAddress.state,
            item.institutionAddress.postalCode,
          ]
            .filter(Boolean)
            .join(', ')}
        </p>
      )}
    </>
  ) : null;
};

export const getCardTitle = item => {
  if (!item) return 'Institution Details';

  return item.institutionName || `Facility Code: ${item.facilityCode}`;
};

export const additionalInstitutionDetailsArrayOptions = {
  arrayPath: 'additionalInstitutionDetails',
  nounSingular: 'institution',
  nounPlural: 'institutions',
  required: false,
  isItemIncomplete: item => !item?.facilityCode,
  maxItems: 10,
  text: {
    getItemName: item => getCardTitle(item),
    cardDescription: item => getCardDescription(item),
    summaryTitle: props => {
      const count = props?.formData?.additionalInstitutionDetails?.length || 0;
      return count > 1
        ? 'Review your additional institutions'
        : 'Review your additional institution';
    },
    summaryDescriptionWithoutItems: (
      <>
        <h3 className="vads-u-margin-top--0">
          You can add more locations to this agreement.
        </h3>
        <p>
          If you have any more campuses or additional locations to add to this
          agreement, you can do so now. You will need a facility code for each
          location you would like to add.
        </p>
      </>
    ),
  },
};
