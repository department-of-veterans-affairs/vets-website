import React from 'react';
import PropTypes from 'prop-types';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const Instructions = ({ testId, contactType }) => {
  const isEmergency = contactType === 'emergency contact';
  return (
    <div data-testid={testId}>
      To add {isEmergency ? 'an' : 'a'} {contactType}, call the Health
      Eligibility Center at <VaTelephone contact={CONTACTS['222_VETS']} /> (
      <VaTelephone contact={CONTACTS['711']} tty />
      ). We’re available Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
    </div>
  );
};

Instructions.propTypes = {
  contactType: PropTypes.string,
  testId: PropTypes.string,
};

export default Instructions;
