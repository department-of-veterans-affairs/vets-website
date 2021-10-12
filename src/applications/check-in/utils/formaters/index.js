import React from 'react';

const formatPhone = phoneString => {
  let returnString = phoneString;
  const match = phoneString.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    const intlCode = match[1] ? '+1 ' : '';
    returnString = [intlCode, match[2], '-', match[3], '-', match[4]].join('');
  }
  return returnString;
};

const formatAddress = addressString => {
  const splitAddress = addressString.match(/([^,]*),(.*)/);

  return (
    <>
      {splitAddress[1]}
      <br />
      {splitAddress[2]}
    </>
  );
};

const formatDemographic = demographicString => {
  const phoneMatch = demographicString.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  const emailMatch = demographicString.match(
    /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi,
  );
  if (phoneMatch) {
    return formatPhone(demographicString);
  }
  if (emailMatch) {
    return demographicString;
  }

  return formatAddress(demographicString);
};

export { formatPhone, formatAddress, formatDemographic };
