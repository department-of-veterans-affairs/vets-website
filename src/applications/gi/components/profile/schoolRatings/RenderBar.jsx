import React from 'react';
import PropTypes from 'prop-types';

const RenderBar = ({ label, avgRating }) => {
  const starMax = '4.0';

  const percent = avgRating
    ? ((parseFloat(avgRating) * 100).toFixed(2) / parseFloat(starMax)).toFixed(
        0,
      )
    : 0;

  return (
    <div className="vads-l-row">
      <div className="small-screen:vads-l-col--6 medium-screen:vads-l-col--5 small-desktop-screen:vads-l-col--6 vads-l-col--12">
        {label}{' '}
      </div>
      <div className="small-screen:vads-l-col--6 medium-screen:vads-l-col--7 small-desktop-screen:vads-l-col--6 vads-l-col--12 vads-u-padding-left--1 category-rating ">
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
        <span className="vads-u-margin-left--2&quot;">
          {' '}
          {`${avgRating} / ${starMax}`}{' '}
        </span>
      </div>
    </div>
  );
};

RenderBar.propTypes = {
  avgRating: PropTypes.number.isRequired,
  label: PropTypes.string,
};

export default RenderBar;
