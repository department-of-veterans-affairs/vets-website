import React from 'react';
import PropTypes from 'prop-types';
import { getDocketName } from '../../utils/appeals-v2-helpers';

function DocketCard({ total, ahead, docket }) {
  const completedWidth = { width: `${((total - ahead) / total) * 100}%` };

  return (
    <div className="docket-container">
      <p className="appeals-ahead">{ahead.toLocaleString()}</p>
      <p>Appeals ahead of you</p>

      <div className="marker-container">
        <div>
          <div className="marker-text-spacer" style={completedWidth} />
          <span className="marker-text">You are here</span>
        </div>
        <div>
          <div className="spacer" style={completedWidth} />
          <div className="marker">
            <img src="/img/Docket-line-pin.svg" alt="" />
          </div>
        </div>
      </div>

      <div>
        <div className="docket-bar">
          <div className="completed" style={completedWidth} />
        </div>
        <div className="end-of-docket" />
      </div>

      <div className="front-of-docket-text">
        <p>Front of docket line</p>
      </div>
      <p>
        <strong>{total.toLocaleString()}</strong> total appeals on the{' '}
        {docket ? getDocketName(docket) : ''} docket
      </p>
    </div>
  );
}

DocketCard.propTypes = {
  ahead: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  docket: PropTypes.string,
};

export default DocketCard;
