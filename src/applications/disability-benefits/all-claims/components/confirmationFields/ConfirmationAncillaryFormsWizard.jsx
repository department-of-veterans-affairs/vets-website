import React from 'react';
import PropTypes from 'prop-types';
import { reviewEntry } from 'platform/forms-system/src/js/components/ConfirmationView/ChapterSectionCollection';

// The boolean questions on these ancillary forms wizard pages are not required and may have null or undefined values
const convertToYesNo = value => {
  if (value === null || value === undefined) return null;
  return value === true ? 'Yes' : 'No';
};

const ConfirmationAncillaryFormsWizard = ({ formData }) => {
  const isAnswering = formData?.['view:ancillaryFormsWizard'];
  const modifyingHome = formData?.['view:modifyingHome'];
  const modifyingCar = formData?.['view:modifyingCar'];
  const alreadyClaimedVehicleAllowance =
    formData?.['view:needsCarHelp']?.['view:alreadyClaimedVehicleAllowance'];
  const needingAid = formData?.['view:aidAndAttendance'];

  // Do not show this confirmation component if no selection is made for formData?.['view:ancillaryFormsWizard'] === true
  if (isAnswering === undefined || isAnswering === null) {
    return null;
  }

  const additionalEntries = {
    isAnswering: {
      label:
        'Do you want to answer questions to determine if you may be eligible for additional benefits?',
      data: convertToYesNo(isAnswering),
    },
    modifyingHome: {
      label: 'Do you need help buying or modifying your home?',
      data: convertToYesNo(modifyingHome),
    },
    modifyingCar: {
      label: 'Do you need help buying or modifying your car?',
      data: convertToYesNo(modifyingCar),
    },
    alreadyClaimedVehicleAllowance: {
      label: 'Have you ever been granted an automobile allowance?',
      data: convertToYesNo(alreadyClaimedVehicleAllowance),
    },
    needingAid: {
      label:
        'Are you confined to your home or need help with everyday activities?',
      data: convertToYesNo(needingAid),
    },
  };

  return (
    <li>
      <h4>Additional disability benefits</h4>
      <ul className="vads-u-padding--0" style={{ listStyle: 'none' }}>
        {Object.entries(additionalEntries)
          .filter(([_, value]) => value.data !== null)
          .map(([key, value]) =>
            reviewEntry(null, key, null, value.label, value.data),
          )}
      </ul>
    </li>
  );
};

ConfirmationAncillaryFormsWizard.propTypes = {
  formData: PropTypes.object,
};
export default ConfirmationAncillaryFormsWizard;
