import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Alert = ({ isAccredited }) => {
  const [pathname, setPathname] = useState(window.location.pathname);
  useEffect(() => {
    const handlePathnameChange = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener('popstate', handlePathnameChange);
    return () => {
      window.removeEventListener('popstate', handlePathnameChange);
    };
  }, []);

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
              {!pathname.includes('/confirmation')
                ? `Your school facility code indicates the school is not accredited.
              In addition to completing VA Form 22-10216, you’ll also need to
              complete and submit VA Form 22-10215. You will be directed to that
              form after completing this one.`
                : `Our records indicate your school is not accredited. After submitting this form, 
                you will also need to complete and submit VA Form 22-10215, in addition to VA Form 22-10216.`}
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
