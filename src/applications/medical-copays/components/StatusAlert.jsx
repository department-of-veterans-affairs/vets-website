import React, { useState } from 'react';
import PropTypes from 'prop-types';

const StatusAlert = ({ label, content, status, iconType, trackingPrefix }) => {
  const [open, setOpen] = useState(false);

  const handleOnclick = e => {
    if (!content) return;
    if (e) e.target.classList.toggle('active');
    setOpen(!open);
  };

  const getCollapsibleIcon = () => {
    if (!content) return '';
    return open ? 'fa-angle-down open' : 'fa-angle-down close';
  };

  return (
    <>
      <button
        aria-expanded={open}
        aria-controls={`${trackingPrefix}-expandable-alert`}
        type="button"
        className={`collapsible ${status}`}
        onClick={e => handleOnclick(e)}
      >
        <i
          aria-hidden="true"
          role="img"
          className={`fa fa-exclamation-${iconType} alert-icon-base`}
        />
        <span className={`${content ? 'status-label' : null}`}>{label}</span>
        <span className="sr-only">Alert: </span>
        <i
          aria-hidden="true"
          role="img"
          className={`fas ${getCollapsibleIcon()}  more-icon vads-u-padding-left--0p5`}
        />
      </button>
      <div
        id={`${trackingPrefix}-expandable-container`}
        className={`content ${status} ${
          open ? 'vads-u-display--block' : 'vads-u-display--none'
        }`}
      >
        {content}
      </div>
    </>
  );
};

StatusAlert.propTypes = {
  status: PropTypes.string,
  iconType: PropTypes.string,
  trackingPrefix: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  content: PropTypes.object,
};

export default StatusAlert;
