import React from 'react';
import PropTypes from 'prop-types';
import { reviewEntry } from 'platform/forms-system/src/js/components/ConfirmationView/ChapterSectionCollection';
import { sippableId, capitalizeEachWord } from '../../utils';

const HousingSituationResponses = ({ formData }) => {
  const housingOptions = formData || {};
  const claimedKeys = Object.keys(housingOptions).filter(
    key => key !== 'none' && housingOptions[key],
  );
  const finalList = housingOptions
    .filter(housingOption => claimedKeys.includes(sippableId(housingOption)))
    .map(housingOption => capitalizeEachWord(housingOption));

  return (
    <li>
      <h4>Please describe your current living situation.</h4>
      <ul className="vads-u-padding--0" style={{ listStyle: 'none' }}>
        {housingOptions?.none
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

HousingSituationResponses.propTypes = {
  formData: PropTypes.object,
};
export default HousingSituationResponses;
