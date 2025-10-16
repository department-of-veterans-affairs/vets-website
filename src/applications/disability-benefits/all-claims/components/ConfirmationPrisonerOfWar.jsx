import React from 'react';
import PropTypes from 'prop-types';
import { reviewEntry } from 'platform/forms-system/src/js/components/ConfirmationView/ChapterSectionCollection';
import { formatDate, capitalizeEachWord } from '../utils';

const ConfirmationPrisonerOfWar = ({ formData }) => {
  const powStatus = formData?.['view:powStatus'];
  const confinements = formData?.['view:isPow']?.confinements || [];
  const powDisabilities = formData?.['view:isPow']?.powDisabilities || {};

  // Return null if powStatus is undefined
  if (powStatus === undefined) {
    return null;
  }

  const powEntries = {
    powStatus: {
      label: 'Have you ever been a POW?',
      data: powStatus ? 'Yes' : 'No',
    },
    confinements: {
      label: 'Periods of confinement',
      data: confinements.length
        ? confinements.map(
            item =>
              `From ${item.from ? formatDate(item.from) : 'N/A'} to ${
                item.to ? formatDate(item.to) : 'N/A'
              }`,
          )
        : null,
    },
    powDisabilities: {
      label: 'Which of your conditions is connected to your POW experience?',
      data: Object.entries(powDisabilities).length
        ? Object.entries(powDisabilities)
            .filter(([_, value]) => value === true)
            .map(([key]) => capitalizeEachWord(key))
            .join('\n')
        : 'None selected',
    },
  };

  return (
    <li>
      <h4>Prisoner of War (POW)</h4>
      <ul className="vads-u-padding--0" style={{ listStyle: 'none' }}>
        {Object.entries(powEntries).map(([key, value]) =>
          reviewEntry(null, key, null, value.label, value.data),
        )}
      </ul>
    </li>
  );
};

ConfirmationPrisonerOfWar.propTypes = {
  formData: PropTypes.object,
};
export default ConfirmationPrisonerOfWar;
