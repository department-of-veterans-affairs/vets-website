import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const EmergencyNote = props => {
  const { dropDownFlag } = props;

  const content = () => (
    <>
      <ul>
        <li>
          <strong>If you think your life or health is in danger,</strong> call{' '}
          <va-telephone contact="911" /> or go to the nearest emergency room.
        </li>
        <li>
          <strong>
            If you’re in a mental health crisis or thinking about suicide,
          </strong>{' '}
          call <va-telephone contact="988" /> then select 1. Or you can chat at{' '}
          <Link href="988lifeline.org">988lifeline.org</Link>
        </li>
      </ul>
      <p>
        Messages are only for non-urgent questions and concerns.{' '}
        <strong>It can take up to 3 business days to get a response.</strong>
      </p>
    </>
  );

  return (
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
      {dropDownFlag ? (
        <va-additional-info
          disable-border
          trigger="Don’t use messages for emergencies"
        >
          {content()}
        </va-additional-info>
      ) : (
        <>
          <p>
            {' '}
            <i className="fas fa-exclamation-triangle vads-u-margin-right--1p5" />
            <strong className="vads-u-margin-left--0p25">
              Don’t use messages for emergencies
            </strong>
          </p>
          {content()}
        </>
      )}
    </va-alert>
  );
};

EmergencyNote.propTypes = {
  dropDownFlag: PropTypes.bool,
};

export default EmergencyNote;
