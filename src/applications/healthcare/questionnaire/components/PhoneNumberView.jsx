import React from 'react';

export default function PhoneNumberView({ number }) {
  const fullphone = `${number.data.areaCode}${number.data.phoneNumber}`;
  let i = 0;
  const phone = '###-###-####'.replace(/#/g, () => fullphone[i++] || '');
  return (
    <p className="vads-u-margin--1px">
      <span className=" vads-u-font-weight--bold">{number.label}: </span>
      {phone}
    </p>
  );
}
