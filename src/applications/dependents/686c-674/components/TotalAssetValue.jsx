import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getArrayIndexFromPathName } from 'platform/forms-system/src/js/patterns/array-builder/helpers';

export default function TotalAssetValue() {
  const index = getArrayIndexFromPathName();
  const [displayTotal, setDisplayTotal] = useState(0);

  // Get asset values from Redux store (not the formData prop)
  const savings = useSelector(
    state =>
      state?.form?.data?.studentInformation?.[index]?.studentNetworthInformation
        ?.savings,
  );
  const securities = useSelector(
    state =>
      state?.form?.data?.studentInformation?.[index]?.studentNetworthInformation
        ?.securities,
  );
  const realEstate = useSelector(
    state =>
      state?.form?.data?.studentInformation?.[index]?.studentNetworthInformation
        ?.realEstate,
  );
  const otherAssets = useSelector(
    state =>
      state?.form?.data?.studentInformation?.[index]?.studentNetworthInformation
        ?.otherAssets,
  );

  useEffect(
    () => {
      const parseCurrency = value => {
        if (!value) return 0;
        return parseFloat(value) || 0;
      };

      const total =
        parseCurrency(savings) +
        parseCurrency(securities) +
        parseCurrency(realEstate) +
        parseCurrency(otherAssets);

      setDisplayTotal(total);
      console.log('Individual values:', {
        savings,
        securities,
        realEstate,
        otherAssets,
        total,
      });
    },
    [savings, securities, realEstate, otherAssets],
  );

  const formattedTotal = displayTotal.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <div>
      <h4>Total: {formattedTotal}</h4>
    </div>
  );
}
