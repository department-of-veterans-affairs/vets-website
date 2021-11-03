import React, { useState } from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';

const ExpandableAlert = ({
  label,
  content,
  status,
  iconType,
  trackingPrefix,
  ...rest
}) => {
  const [open, setOpen] = useState(false);

  const handleOnclick = e => {
    if (!content) return;
    if (e) e.target.classList.toggle('active');
    setOpen(!open);
    recordEvent({
      event: `int-accordion-${open ? 'expand' : 'collapse'}`,
      [`${trackingPrefix}-expandable-alert`]: label,
    });
  };

  const getCollapsibleIcon = () => {
    if (!content) return '';

    return open ? 'fa-angle-down open' : 'fa-angle-down close';
  };

  return (
    <div {...rest}>
      <button
        aria-expanded={open}
        aria-controls={`expandable-alert-${trackingPrefix}`}
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
        id={`expandable-container-${trackingPrefix}`}
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
  label: PropTypes.string.isRequired,
  trackingPrefix: PropTypes.string.isRequired,
  content: PropTypes.string,
  iconType: PropTypes.string,
  status: PropTypes.string,
};

export default ExpandableAlert;
