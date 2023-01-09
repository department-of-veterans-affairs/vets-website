import React from 'react';
import PropTypes from 'prop-types';

const EmergencyNote = props => {
  const { dropDownFlag } = props;

  const content = () => (
    <>
      <ul className="vads-u-margin-bottom--2">
        <li>
          <strong>If you think your life or health is in danger,</strong> call{' '}
          <va-telephone contact="911" /> or go to the nearest emergency room.
        </li>
        <li>
          <strong>
            If you’re in a mental health crisis or thinking about suicide,
          </strong>{' '}
          call <va-telephone contact="988" /> then select 1. Or you can chat at{' '}
          <a href="https://988lifeline.org/">988lifeline.org</a>
        </li>
      </ul>
      <p className="vads-u-margin-bottom--0">
        Messages are only for non-urgent questions and concerns.{' '}
        <strong>It can take up to 3 business days to get a response.</strong>
      </p>
    </>
  );

  return (
    <>
      {dropDownFlag ? (
        <va-alert-expandable
          status="warning"
          trigger="Don’t use messages for emergencies"
        >
          <div className="vads-u-padding-x--1 vads-u-padding-bottom--1">
            {content()}
          </div>
        </va-alert-expandable>
      ) : (
        <va-alert
          background-only
          class="vads-u-margin-bottom--1"
          close-btn-aria-label="Close notification"
          disable-analytics="false"
          full-width="false"
          status="warning"
          visible="true"
          show-icon={dropDownFlag}
        >
          <p>
            {' '}
            <i
              className="fas fa-exclamation-triangle vads-u-margin-right--1p5"
              aria-hidden="true"
            />
            <strong className="vads-u-margin-left--0p25">
              Don’t use messages for emergencies
            </strong>
          </p>
          {content()}
        </va-alert>
      )}
    </>
  );
};

EmergencyNote.propTypes = {
  dropDownFlag: PropTypes.bool,
};

export default EmergencyNote;
