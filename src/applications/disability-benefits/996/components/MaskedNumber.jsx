import React from 'react';

const Dot = () => <span className="masked-number" role="presentation" />;

// Mask all but the last 4 of the SSN & VA file number
const MaskedNumber = ({ number }) =>
  number ? (
    <>
      <Dot />
      <Dot />
      <Dot />-<Dot />
      <Dot />-{number.toString().slice(-4)}
    </>
  ) : null;

export default MaskedNumber;
