import React from 'react';
import { religiousAffiliations } from '../utils/data/religiousAffiliations';

const ScorecardTags = ({ styling, it }) => {
  return (
    <div>
      {it.menonly === 1 && <div className={styling}>Men Only</div>}
      {it.womenonly === 1 && <div className={styling}>Women Only</div>}
      {it.relaffil && (
        <div className={styling}>{religiousAffiliations[it.relaffil]}</div>
      )}
      {it.hbcu === 1 && (
        <div className={styling}>Historically Black College or University</div>
      )}
    </div>
  );
};

export default ScorecardTags;
