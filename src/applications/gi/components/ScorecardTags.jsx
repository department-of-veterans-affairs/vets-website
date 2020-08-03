import React from 'react';
import { religiousAffiliations } from '../utils/data/religiousAffiliations';

const ScorecardTags = ({ styling, it }) => {
  if (it) {
    return (
      <div className="row vads-u-padding-top--1p5">
        <div className="view-details columns vads-u-display--inline-block">
          {it.menonly === 1 && <div className={styling}>Men Only</div>}
          {it.womenonly === 1 && <div className={styling}>Women Only</div>}
          {it.relaffil && (
            <div className={styling}>{religiousAffiliations[it.relaffil]}</div>
          )}
          {it.hbcu === 1 && (
            <div className={styling}>
              Historical Black College or University
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default ScorecardTags;
