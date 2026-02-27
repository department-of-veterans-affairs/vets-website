import React from 'react';
import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';
import { selectMedicationsManagementImprovementsFlag } from '../../util/selectors';

export const RefillMedicationList = ({
  medications,
  testId,
  showBold = false,
}) => {
  const isManagementImprovementsEnabled = useSelector(
    selectMedicationsManagementImprovementsFlag,
  );

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
          {isManagementImprovementsEnabled ? (
            <strong>{medication?.prescriptionName}</strong>
          ) : (
            medication?.prescriptionName
          )}
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
