import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './sass/_m-operating-status.scss';

const ExpandableOperatingStatus = props => {
  const [open, setOpen] = useState(false);
  const handleOnclick = e => {
    if (!props.extraInfo) return;
    e.target.classList.toggle('active');
    const content = e.target.nextElementSibling;
    if (content.style.display === 'block') {
      content.style.display = 'none';
      setOpen(false);
    } else {
      content.style.display = 'block';
      setOpen(true);
    }
  };

  const iconIndicator = extraInfo => {
    if (extraInfo && open) return 'fa-angle-down open';
    if (extraInfo && !open) return ' fa-angle-down close';
    return null;
  };

  return (
    <>
      <button
        type="button"
        className={`collapsible ${props.operatingStatusFacility}`}
        onClick={e => handleOnclick(e)}
      >
        <i
          aria-hidden="true"
          role="img"
          className={`fa fa-exclamation-${props.iconType} alert-icon-base`}
        />
        <span className={`${props.extraInfo ? 'status-label' : null}`}>
          {props.statusLabel}
        </span>
        <span className="sr-only">Alert: </span>
        <i
          aria-hidden="true"
          role="img"
          className={`fas ${iconIndicator(
            props.extraInfo,
          )}  more-icon vads-u-padding-left--0p5`}
        />
      </button>
      <div className={`content ${props.operatingStatusFacility}`}>
        <p className="more-info">{props.extraInfo}</p>
      </div>
    </>
  );
};

ExpandableOperatingStatus.propTypes = {
  statusLabel: PropTypes.string,
  extraInfo: PropTypes.object,
  iconType: PropTypes.string,
  operatingStatusFacility: PropTypes.string,
};

export default ExpandableOperatingStatus;
