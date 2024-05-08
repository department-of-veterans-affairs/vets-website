import React from 'react';
import PropTypes from 'prop-types';

const Instructions = ({ testId, contactType }) => {
  const isEmergency = contactType === 'emergency contact';

  return (
    <div data-testid={testId}>
      To add {isEmergency ? 'an' : 'a'} {contactType}, call your VA health
      facility.{' '}
      <va-link href="https://www.va.gov/find-locations/">
        Find your health facility’s phone number
      </va-link>
      .
    </div>
  );
};

Instructions.propTypes = {
  contactType: PropTypes.string,
  testId: PropTypes.string,
};

export default Instructions;
