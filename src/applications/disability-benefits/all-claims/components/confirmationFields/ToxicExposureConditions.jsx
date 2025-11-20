import React from 'react';
import PropTypes from 'prop-types';
import { reviewEntry } from 'platform/forms-system/src/js/components/ConfirmationView/ChapterSectionCollection';
import { sippableId, capitalizeEachWord } from '../../utils';

const ToxicExposureConditions = ({ formData }) => {
  // first, get list of toxic exposure conditions the user has claimed
  // return null if "none" is selected OR if the optional question has no selections
  // then, cross-check that with the list of conditions they checked
  // and display the readable (non-Sippable) names of those conditions

  const teConditions = formData?.toxicExposure?.conditions || {};
  const claimedKeys = Object.keys(teConditions).filter(
    key => key !== 'none' && teConditions[key] === true,
  );
  if (teConditions?.none === true || claimedKeys.length === 0) {
    return null;
  }
  const conditionsContainer = formData?.newDisabilities || [];
  const finalList = conditionsContainer
    .filter(condition => claimedKeys.includes(sippableId(condition.condition)))
    .map(condition => capitalizeEachWord(condition.condition));

  return (
    <li>
      <h4>Toxic Exposure</h4>
      <ul className="vads-u-padding--0" style={{ listStyle: 'none' }}>
        {teConditions?.none
          ? reviewEntry(
              null,
              'toxicExposureNone',
              {},
              'Toxic exposure conditions',
              'None claimed',
            )
          : finalList.map(key => reviewEntry(null, key, {}, key, 'Claimed'))}
      </ul>
    </li>
  );
};

ToxicExposureConditions.propTypes = {
  formData: PropTypes.object,
};
export default ToxicExposureConditions;
