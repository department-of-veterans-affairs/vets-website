import React from 'react';
import PropTypes from 'prop-types';

const Alert = () => {
  const isAccredited = localStorage.getItem('isAccredited') === 'true';

  return (
    <va-alert
      close-btn-aria-label="Close notification"
      status={!isAccredited ? 'warning' : 'info'}
      visible
    >
      <h2 slot="headline">
        {!isAccredited
          ? 'Additional form needed'
          : 'Complete all submission steps'}
      </h2>
      <>
        <p className="vads-u-margin-y--0" id="additional-form-needed-alert">
          {!isAccredited ? (
            <span>
              Our records indicate your school is not recognized by a regional
              or national accreditor. In addition to completing VA Form
              22-10216, you’ll also need to complete and submit VA Form
              22-10215. You will be directed to that form after completing this
              one.
            </span>
          ) : (
            <span>
              This form requires additional steps for successful submission.
              Follow the instructions below carefully to ensure your form is
              submitted correctly.
            </span>
          )}
        </p>
      </>
    </va-alert>
  );
};

Alert.propTypes = {
  isAccredited: PropTypes.bool,
};

export default Alert;
