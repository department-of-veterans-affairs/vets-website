import React, { useState } from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';

const ExpandableAlert = ({ label, content, status, iconType, ...rest }) => {
  const [open, setOpen] = useState(false);

  const handleOnclick = e => {
    if (!content) return;
    if (e) e.target.classList.toggle('active');
    setOpen(!open);
    recordEvent({
      event: `int-accordion-${open ? 'expand' : 'collapse'}`,
      'operating-status-heading': label,
    });
  };

  const iconIndicator = info => {
    if (info && open) return 'fa-angle-down open';
    if (info && !open) return ' fa-angle-down close';
    return null;
  };

  return (
    <div {...rest}>
      <button
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
          className={`fas ${iconIndicator(
            content,
          )}  more-icon vads-u-padding-left--0p5`}
        />
      </button>

      <div
        className={`content ${status} ${
          open ? 'vads-u-display--block' : 'vads-u-display--none'
        }`}
      >
        {content && (
          <p className="vads-u-font-family--sans vads-u-padding-x--1">
            {content}
          </p>
        )}
      </div>
    </div>
  );
};

ExpandableAlert.propTypes = {
  label: PropTypes.string,
  content: PropTypes.string,
  iconType: PropTypes.string,
  status: PropTypes.string,
};

export default ExpandableAlert;
