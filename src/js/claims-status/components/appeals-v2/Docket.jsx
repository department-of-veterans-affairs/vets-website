import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// TODO: Depending on when this gets rendered, we may want to return null if either
//  `ahead` or `total` don't exist (or if `total` === 0 because of the divide by 0  error)
function Docket({ ahead, total, form9Date }) {
  const completedWidth = { width: `${((total - ahead) / total) * 100}%` };
  const date = moment(form9Date, 'YYYY-MM-DD').format('MMMM YYYY');

  // TODO: Assess how accessible this is
  return (
    <div>
      <h2>How long until a judge is ready to write your decision?</h2>
      <p>The Board of Veterans’ Appeals hears cases in the order they are received. When you completed a Form 9 in {date}, you secured your spot in line. Your appeal is near the front of the line.</p>
      <div className="docket-container">
        <p className="appeals-ahead">{ahead.toLocaleString()}</p>
        <p>Appeals ahead of you</p>

        <div className="marker-container">
          <div>
            <div className="marker-text-spacer" style={completedWidth}/>
            <span className="marker-text">You are here</span>
          </div>
          <div>
            <div className="spacer" style={completedWidth}/>
            <div className="marker">
              <img src="/img/Docket-line-pin.svg" alt=""/>
            </div>
          </div>
        </div>

        <div>
          <div className="docket-bar">
            <div className="completed" style={completedWidth}/>
          </div>
          <div className="end-of-docket"/>
        </div>

        <div className="front-of-docket-text"><p>Front of docket line</p></div>
        <p><strong>{total.toLocaleString()}</strong> total appeals on the docket</p>
      </div>
      <h2>Is there a way for my appeal to be decided more quickly?</h2>
      <p>The Board can move your appeal to the front of the docket line if you:</p>
      <ul>
        <li>Are 75 years or older</li>
        <li>Have a terminal illness</li>
        <li>Are in financial distress</li>
      </ul>
      <p>These appeals are called Advanced on Docket (AOD). When you turn 75, your appeal automatically becomes AOD. If you have a terminal illness or are in financial distress, ask your VSO or representative to file a motion with the Board for AOD status.</p>
    </div>
  );
}

Docket.propTypes = {
  ahead: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  form9Date: PropTypes.string.isRequired
};

export default Docket;

