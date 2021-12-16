import React from 'react';

const SelectNotificationOptionsAlert = ({ firstChannelId }) => {
  return (
    <div data-testid="select-options-alert">
      <va-alert status="warning">
        <h2 slot="headline">Select your notification options</h2>
        <p>
          We’ve added notification options to your profile. Tell us how you’d
          like us to contact you.
        </p>
        <p>
          <a
            href={`#${firstChannelId}`}
            className="vads-u-text-decoration--none vads-u-padding--1 vads-u-margin-left--neg1 vads-u-margin-top--neg1 vads-u-margin-bottom--neg1"
          >
            <i
              aria-hidden="true"
              className="fas fa-arrow-down vads-u-margin-right--1"
            />{' '}
            Select your notification options
          </a>
        </p>
      </va-alert>
    </div>
  );
};

export default SelectNotificationOptionsAlert;
