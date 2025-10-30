import React from 'react';
import PropTypes from 'prop-types';

export const RefillMedicationList = ({
  medications,
  testId,
  showBold = false,
}) => {
  if (!medications?.length) return null;

  return (
    <ul className="va-list--disc" data-dd-privacy="mask" data-testid={testId}>
      {medications.map((medication, idx) => (
        <li
          className={`vads-u-padding-y--0 ${
            showBold ? 'vads-u-font-weight--bold' : ''
          }`}
          data-testid={`${testId}-${idx}`}
          key={`${medication?.prescriptionId || idx}`}
          data-dd-privacy="mask"
        >
          {medication?.prescriptionName}
        </li>
      ))}
    </ul>
  );
};

RefillMedicationList.propTypes = {
  testId: PropTypes.string.isRequired,
  medications: PropTypes.array,
  showBold: PropTypes.bool,
};

export default RefillMedicationList;
