import React from 'react';
import PropTypes from 'prop-types';
import { religiousAffiliations } from '../utils/data/religiousAffiliations';

const ScorecardTags = ({ styling, menOnly, womenOnly, relAffil, hbcu }) => {
  return (
    <div>
      {menOnly === 1 && <div className={styling}>Men Only</div>}
      {womenOnly === 1 && <div className={styling}>Women Only</div>}
      {relAffil && (
        <div className={styling}>{religiousAffiliations[relAffil]}</div>
      )}
      {hbcu === 1 && (
        <div className={styling}>Historically Black college or university</div>
      )}
    </div>
  );
};

ScorecardTags.propTypes = {
  styling: PropTypes.string.isRequired,
  hbcu: PropTypes.number,
  menOnly: PropTypes.number,
  relAffil: PropTypes.string,
  womenOnly: PropTypes.number,
};

export default ScorecardTags;
