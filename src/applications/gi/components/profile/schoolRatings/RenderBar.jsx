import React from 'react';

const RenderBar = ({ label, avgRating }) => {
  const starMax = 4;

  const percent = avgRating
    ? ((parseFloat(avgRating) * 100).toFixed(2) / starMax).toFixed(0)
    : 0;

  return (
    <div className="vads-l-row">
      <div className="small-screen:vads-l-col--6 vads-l-col--12">{label} </div>
      <div className="small-screen:vads-l-col--6 vads-l-col--12 category-rating ">
        <div className="bar bar-outer vads-u-display--inline-block vads-u-background-color--gray-lighter">
          <div
            style={{
              width: `${percent}%`,
            }}
            className="bar vads-u-display--inline-block vads-u-background-color--gold-darker"
          >
            &nbsp;
          </div>
        </div>
        <span className="vads-u-margin-left--2&quot;"> {avgRating} </span>
      </div>
    </div>
  );
};

export default RenderBar;
