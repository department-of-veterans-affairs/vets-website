import React from 'react';

const NoHealthAlert = () => {
  return (
    <va-alert status="warning" visible data-testid="no-health-message">
      <h2 slot="headline">You don’t have access to My HealtheVet</h2>
      <div>
        <p className="vads-u-margin-y--0">
          To use our health management tools and access your health information
          online, <b>one</b> of the following must be true:
          <ul>
            <li>
              You’ve received care at a VA facility, <b>or</b>
            </li>
            <li>You’ve applied for VA health care</li>
          </ul>
        </p>
        <p className="vads-u-margin-y--0">
          If you’ve received care at a VA health facility, call the facility and
          ask if you’re registered.
        </p>
        <p className="vads-u-margin-bottom--0">
          <a href="/find-locations/?&facilityType=health">
            Find your nearest VA health facility
          </a>
        </p>
        <p className="vads-u-margin-y--0">
          If you’re not enrolled in VA health care, you can apply now.
        </p>
        <p className="vads-u-margin-bottom--0">
          <a href="/health-care/how-to-apply/">
            Find out how to apply for VA health care
          </a>
        </p>
      </div>
    </va-alert>
  );
};

export default NoHealthAlert;
