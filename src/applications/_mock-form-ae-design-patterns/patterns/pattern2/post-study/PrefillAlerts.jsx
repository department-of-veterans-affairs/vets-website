import React from 'react';

const PrefillAlerts = () => {
  return (
    <>
      <h1 className="vads-u-margin-bottom--8">Alerts</h1>

      {/* 1st Option */}
      <h2 className="vads-u-margin-bottom--4">Task Orange</h2>
      <div className="vads-u-padding-bottom--8 vads-u-padding-left--5">
        <va-alert tabIndex="0">
          <strong>Note:</strong> We’ve prefilled some of your information. If
          you need to make changes, you can edit on this screen. Your changes
          will affect this form and your VA.gov profile.
        </va-alert>
      </div>

      {/* 2nd Option */}
      <h2 className="vads-u-margin-bottom--4 vads-u-margin-top--4">
        Task Gray
      </h2>
      <div className="vads-u-padding-bottom--8 vads-u-padding-left--5">
        <va-alert tabIndex="0">
          We’ve prefilled some of your information. If you need to make changes,
          you can edit on this screen.{' '}
          <strong>
            Your changes will affect this form and your VA.gov profile.
          </strong>
        </va-alert>
      </div>

      {/* 3rd Option */}
      <h2 className="vads-u-margin-bottom--4 vads-u-margin-top--4">
        Task Blue
      </h2>
      <div className="vads-u-padding-left--5 vads-u-padding-bottom--9">
        <va-alert tabIndex="0">
          <h3 className="vads-u-margin-top--0">
            We’ve prefilled some of your information
          </h3>
          If you need to make changes, you can edit on this screen. Your changes
          will affect this form and your VA.gov profile.
        </va-alert>
      </div>
    </>
  );
};

export default PrefillAlerts;
