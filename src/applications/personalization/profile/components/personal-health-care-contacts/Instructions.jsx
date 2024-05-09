import React from 'react';
import PropTypes from 'prop-types';

const Instructions = ({ testId, contactType }) => {
  const isEmergency = contactType === 'emergency contact';
  return (
    <div data-testid={testId}>
      To add {isEmergency ? 'an' : 'a'} {contactType}, call your VA health
      facility.{' '}
      <a
        href="/find-locations/"
        aria-label={`Find your health facility's phone number to add ${
          isEmergency ? 'an' : 'a'
        } ${contactType}`}
      >
        Find your health facility’s phone number
      </a>
      .
    </div>
  );
};

Instructions.propTypes = {
  contactType: PropTypes.string,
  testId: PropTypes.string,
};

export default Instructions;
