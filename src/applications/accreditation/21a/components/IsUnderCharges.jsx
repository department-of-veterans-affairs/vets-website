import React from 'react';

const IsUnderCharges = () => (
  <>
    This does not include:
    <ul style={{ marginBottom: '0px' }}>
      <li>traffic fines of $300 or less</li>
      <li>any violation of law committed before your 16th birthday</li>
      <li>
        any conviction for which the record was expunged under federal or state
        law
      </li>
    </ul>
  </>
);

export default IsUnderCharges;
