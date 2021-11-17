import React, { useState } from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';

const ExpandableOperatingStatus = props => {
  const [open, setOpen] = useState(false);

  const handleOnclick = e => {
    if (!props.extraInfo) return;
    if (e) e.target.classList.toggle('active');
    setOpen(!open);
    recordEvent({
      event: `int-accordion-${open ? 'expand' : 'collapse'}`,
      'operating-status-heading': props.statusLabel,
    });
  };

  const iconIndicator = extraInfo => {
    if (extraInfo && open) return 'fa-angle-down open';
    if (extraInfo && !open) return ' fa-angle-down close';
    return null;
  };

  const convertPhoneNumbersToLinks = data => {
    const replacePattern = /((\d{3}-))?\d{3}-\d{3}-\d{4}(?!([^<]*>)|(((?!<a).)*<\/a>))/g;
    if (data) {
      return data.replace(
        replacePattern,
        '<a target="_blank" href="tel:$&">$&</a>',
      );
    }

    return data;
  };

  const contentString = `<p class="more-info">${props.extraInfo}</p>`;

  return (
    <div>
      <button
        type="button"
        className={`collapsible ${props.operatingStatusFacility}`}
        onClick={e => handleOnclick(e)}
      >
        <i
          aria-hidden="true"
          role="img"
          className={`fa fa-${props.iconType} alert-icon-base`}
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
      {/* eslint-disable react/no-danger */}
      <div
        className={`content ${props.operatingStatusFacility} ${
          open ? 'vads-u-display--block' : 'vads-u-display--none'
        }`}
        dangerouslySetInnerHTML={{
          __html: convertPhoneNumbersToLinks(contentString),
        }}
      />
    </div>
  );
};

ExpandableOperatingStatus.propTypes = {
  statusLabel: PropTypes.string,
  extraInfo: PropTypes.string,
  iconType: PropTypes.string,
  operatingStatusFacility: PropTypes.string,
};

export default ExpandableOperatingStatus;
