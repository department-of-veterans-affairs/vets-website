import React from 'react';

export default function PhoneNumberView({ number }) {
  const fullPhone = `${number.data.areaCode}${number.data.phoneNumber}`;
  let i = 0;
  if (fullPhone.length !== 10) {
    return <></>;
  }
  const phone = '###-###-####'.replace(/#/g, () => fullPhone[i++] || '');
  return (
    <p className="vads-u-margin--1px">
      <span className=" vads-u-font-weight--bold">{number.label}: </span>
      <span data-testId={`${number.label.toLowerCase()}Phone`}>{phone}</span>
    </p>
  );
}
