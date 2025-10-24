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

export const formatAddress = str => {
  if (typeof str !== 'string' || str.trim().length === 0) {
    return str;
  }

  const exceptionsList = ['NW', 'NE', 'SW', 'SE', 'PO'];
  const exceptions = exceptionsList.map(item => item.toUpperCase());

  return str
    .trim()
    .split(/\s+/)
    .map(word => {
      const subWords = word.split('-');
      const formattedSubWords = subWords.map(subWord => {
        const upperSubWord = subWord.toUpperCase();

        if (exceptions.includes(upperSubWord)) {
          return upperSubWord;
        }

        const matchingException = exceptions.find(ex =>
          upperSubWord.startsWith(ex),
        );
        if (matchingException) {
          return matchingException + subWord.slice(matchingException.length);
        }

        if (/^\d+[A-Z]+$/.test(subWord)) {
          return subWord;
        }

        const numberLetterMatch = subWord.match(/^(\d+)([a-zA-Z]+)$/);
        if (numberLetterMatch) {
          const numbers = numberLetterMatch[1];
          const letters = numberLetterMatch[2];
          return `${numbers}${letters}`;
        }

        return subWord.charAt(0).toUpperCase() + subWord.slice(1).toLowerCase();
      });

      return formattedSubWords.join('-');
    })
    .join(' ');
};

export const toTitleCase = str => {
  if (typeof str !== 'string') {
    return '';
  }

  const trimmedStr = str.trim();

  if (!trimmedStr) {
    return '';
  }

  const words = trimmedStr.split(/\s+/);

  const titled = words.map(word => {
    const parts = word.split('-').map(part => {
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    });
    return parts.join('-');
  });

  return titled.join(' ');
};

export const getCardDescription = item => {
  return item ? (
    <>
      <p>
        <strong>VA facility code: </strong>
        {item.facilityCode}
      </p>
      {item.institutionAddress && (
        <>
          <p className="vads-u-margin-bottom--0">
            {[
              formatAddress(item.institutionAddress.street),
              formatAddress(item.institutionAddress.street2),
              formatAddress(item.institutionAddress.street3),
            ]
              .filter(Boolean)
              .join(', ')}
          </p>
          <p className="vads-u-margin-top--0">
            {toTitleCase(item.institutionAddress.city)}{' '}
            {item.institutionAddress.state},{' '}
            {item.institutionAddress.postalCode}
          </p>
        </>
      )}
    </>
  ) : null;
};

export const getCardTitle = item => {
  if (!item) return 'Institution Details';

  return (
    toTitleCase(item.institutionName) || `Facility Code: ${item.facilityCode}`
  );
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

export const createBannerMessage = (
  institutionDetails,
  isArrayItem,
  mainInstitution,
) => {
  const notYR = institutionDetails.yrEligible === false;
  const notIHL = institutionDetails.ihlEligible === false;

  let message = '';
  const code = institutionDetails?.facilityCode;
  const notFound = institutionDetails?.institutionName === 'not found';
  const badFormat = code?.length > 0 && !/^[a-zA-Z0-9]{8}$/.test(code);
  const thirdChar = code?.charAt(2).toUpperCase();

  const hasXInThirdPosition =
    code?.length === 8 && !badFormat && thirdChar === 'X';

  if (notFound) {
    return null;
  }

  if (isArrayItem) {
    if (hasXInThirdPosition) {
      message =
        "This facility code can't be accepted. Check your WEAMS 22-1998 Report or contact your ELR for a list of eligible codes.";
      return message;
    }
    if (
      !mainInstitution?.facilityMap?.branches?.includes(code) &&
      !mainInstitution?.facilityMap?.extensions?.includes(code)
    ) {
      message =
        "This facility code can't be accepted because it's not associated with your main campus. Check your WEAMS 22-1998 Report or contact your ELR for a list of eligible codes.";
    }
  }

  if (notYR && !isArrayItem) {
    message =
      'This institution is unable to participate in the Yellow Ribbon Program. You can enter a main or branch campus facility code to continue.';
  }

  if (!notYR && notIHL) {
    message =
      'This institution is unable to participate in the Yellow Ribbon Program.';
  }

  return message || null;
};

export const getAcademicYearDisplay = () => {
  const currentYear = new Date().getFullYear();
  return `${currentYear}-${currentYear + 1}`;
};
