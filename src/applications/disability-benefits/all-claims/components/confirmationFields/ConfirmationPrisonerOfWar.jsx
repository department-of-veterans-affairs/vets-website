import React from 'react';
import PropTypes from 'prop-types';
import { reviewEntry } from 'platform/forms-system/src/js/components/ConfirmationView/ChapterSectionCollection';
import { capitalizeEachWord, sippableId } from '../../utils';
import { formatDate } from '../../utils/dates';

const ConfirmationPrisonerOfWar = ({ formData }) => {
  const powStatus = formData?.['view:powStatus'];
  const confinements = formData?.['view:isPow']?.confinements || [];

  // Return null if powStatus is undefined
  if (powStatus === undefined) {
    return null;
  }

  // first, get list of POW conditions the user has claimed
  // then, cross-check that with the list of conditions they checked
  // and display the readable (non-Sippable) names of those conditions
  const powDisabilities = formData?.['view:isPow']?.powDisabilities || {};
  const claimedKeys = Object.keys(powDisabilities).filter(
    key => key !== 'none' && powDisabilities[key] === true,
  );

  const conditionsContainer = formData?.newDisabilities || [];
  const finalList = conditionsContainer
    .filter(condition => claimedKeys.includes(sippableId(condition.condition)))
    .map(condition => capitalizeEachWord(condition.condition));

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
      data: finalList.length ? finalList : null,
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
