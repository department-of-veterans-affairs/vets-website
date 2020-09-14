import React from 'react';

export default function PhoneNumberView({ number }) {
  const fullPhone = `${number.data.areaCode}${number.data.phoneNumber}`;
  let i = 0;
  if (fullPhone.length !== 10) {
    return <></>;
  }
  const phone = '###-###-####'.replace(/#/g, () => fullPhone[i++] || '');
  return (
    <p className="vads-u-margin--1px" data-testid="phoneNumber">
      <span data-testid={`${number.label.toLowerCase()}Phone-label`}>
        {number.label} phone:{' '}
      </span>
      <span
        data-testid={`${number.label.toLowerCase()}Phone`}
        className=" vads-u-font-weight--bold"
      >
        {phone}
      </span>
    </p>
  );
}
