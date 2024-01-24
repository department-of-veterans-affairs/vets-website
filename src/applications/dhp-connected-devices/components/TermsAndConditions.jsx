import PropTypes from 'prop-types';
import React from 'react';

function FitbitTermsAndConditions() {
  return (
    <div>
      <ul>
        <li>
          Sign into Fitbit and share your Fitbit data with VA. Fitbit data
          includes, but is not limited to heart rate, exercise, sleep, activity,
          and diet (caloric) data (i.e., your patient-generated data).
        </li>
        <li>
          Your data (including, but not limited to, heart rate, exercise habits,
          sleep, activity, and diet data) will be automatically retrieved from
          Fitbit via an automated process and stored within the VA in a secure
          environment.
        </li>
        <li>
          Your Fitbit data will be displayed in a dashboard that can be viewed
          by VA clinicians and health coaches.
        </li>
        <li>
          Your VA care teams may discuss data from this dashboard with you.
        </li>
      </ul>
    </div>
  );
}

const TermsAndConditionsContentMap = {
  fitbit: <FitbitTermsAndConditions />,
};

export const TermsAndConditions = ({ device }) => {
  if (device.key in TermsAndConditionsContentMap) {
    return (
      <>
        <p data-testid={`${device.key}-terms-and-conditions`}>
          By connecting your {device.name} to VA.gov, you consent to follow the{' '}
          <a
            href="https://www.va.gov/privacy-policy/"
            target="_blank"
            rel="noreferrer"
          >
            VA.gov Terms and Conditions,
          </a>{' '}
          in addition to the following terms.
          <va-additional-info
            trigger="View Terms"
            data-testid={`${device.key}-terms-and-conditions-content`}
            uswds
          >
            {TermsAndConditionsContentMap[device.key]}
          </va-additional-info>
        </p>
      </>
    );
  }
  return <></>;
};

TermsAndConditions.propTypes = {
  device: PropTypes.object.isRequired,
};
