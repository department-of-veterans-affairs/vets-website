import React from 'react';
import PropTypes from 'prop-types';
import CrisisLineConnectButton from './CrisisLineConnectButton';

const EmergencyNote = props => {
  const { dropDownFlag } = props;

  const content = () => (
    <>
      <div className="vads-u-margin-bottom--2">
        <p>
          Your care team may take up to <strong>3 business days</strong> to
          reply.
        </p>
        <p>
          If you need help sooner, use one of these urgent communications
          options:
        </p>
        <ul>
          <li>
            <strong>If you’re in crisis or having thoughts of suicide,</strong>{' '}
            connect with our Veterans Crisis Line. We offer confidential support
            anytime, day or night.
          </li>

          <CrisisLineConnectButton inAlert />
          <li>
            <strong>If you think your life or health is in danger,</strong> Call{' '}
            <va-telephone
              data-dd-action-name="911 link - in dropown"
              contact="911"
            />{' '}
            or go to the nearest emergency room.
          </li>
        </ul>
      </div>
    </>
  );

  return (
    <>
      {dropDownFlag ? (
        <va-alert-expandable
          status="info"
          trigger="Only use messages for non-urgent needs"
          data-dd-action-name="Only use messages for non-urgent needs dropdown"
          data-testid="emergency-use-only-expandable"
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
          data-test-id="emergency-use-only-alert"
        >
          <p>
            {' '}
            <va-icon
              icon="warning"
              className="vads-u-margin-right--1p5"
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
