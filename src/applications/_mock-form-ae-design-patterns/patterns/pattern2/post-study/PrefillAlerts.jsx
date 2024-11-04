import React from 'react';

const PrefillAlerts = () => {
  return (
    <>
      <h2 className="vads-u-margin-bottom--4">Alerts</h2>

      {/* 1st Option */}
      <div className="vads-u-margin-bottom--8">
        <va-alert tabIndex="0">
          <strong>Note:</strong> We’ve prefilled some of your information. If
          you need to make changes, you can edit on this screen. Your changes
          will affect this form and your VA.gov profile.
        </va-alert>
      </div>

      {/* 2nd Option */}
      <div className="vads-u-margin-bottom--8">
        <va-alert tabIndex="0">
          We’ve prefilled some of your information. If you need to make changes,
          you can edit on this screen.{' '}
          <strong>
            Your changes will affect this form and your VA.gov profile.
          </strong>
        </va-alert>
      </div>

      {/* 3rd Option */}
      <va-alert tabIndex="0" class="vads-u-padding-bottom--5">
        <h3 className="vads-u-margin-top--0">
          We’ve prefilled some of your information
        </h3>
        If you need to make changes, you can edit on this screen. Your changes
        will affect this form and your VA.gov profile.
      </va-alert>
    </>
  );
};

export default PrefillAlerts;
