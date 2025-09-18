import React from 'react';
import PropTypes from 'prop-types';
import { reviewEntry } from 'platform/forms-system/src/js/components/ConfirmationView/ChapterSectionCollection';

const ToxicExposureConditions = ({ formData }) => {
  const conditions = formData?.toxicExposure?.conditions || {};

  if (conditions?.none === true) return null;

  const claimedKeys = Object.keys(conditions).filter(
    key => key !== 'none' && conditions[key] === true,
  );

  return (
    <li>
      <h4>Toxic Exposure </h4>
      <ul className="vads-u-padding--0" style={{ listStyle: 'none' }}>
        {claimedKeys.map(key => reviewEntry(null, key, {}, key, 'Claimed'))}
      </ul>
    </li>
  );
};

ToxicExposureConditions.propTypes = {
  formData: PropTypes.object,
};
export default ToxicExposureConditions;
