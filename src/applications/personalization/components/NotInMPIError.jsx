import React from 'react';
import PropTypes from 'prop-types';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const NotInMPIError = ({ className, level }) => {
  const content = (
    <>
      <p>
        We’re sorry. We’re having trouble matching your information to our
        records. So we can’t give you access to VA.gov tools right now. Please
        contact the VA help desk at <Telephone contact={CONTACTS.VA_311} />{' '}
        (TTY: <Telephone contact={CONTACTS['711']} />) to verify and update your
        records.
      </p>
    </>
  );

  return (
    <div className={className}>
      <AlertBox
        headline="We’re having trouble verifying your identity"
        content={content}
        status="warning"
        level={level}
      />
    </div>
  );
};

NotInMPIError.propTypes = {
  className: PropTypes.string,
  level: PropTypes.number.isRequired,
};

export default NotInMPIError;
