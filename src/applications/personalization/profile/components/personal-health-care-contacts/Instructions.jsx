import React from 'react';
import PropTypes from 'prop-types';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const Instructions = ({ testId, contactType, description }) => {
  const isEc = contactType === 'emergency contact';
  return (
    <div data-testid={testId}>
      <p className="vads-u-color--gray-medium vads-u-margin-top--0p5 vads-u-margin-bottom--0p5">
        {description}
      </p>
      <p className="vads-u-margin-top--2 vads-u-margin-bottom--1">
        To add {isEc ? 'an' : 'a'} {contactType}, call the Health Eligibility
        Center at <VaTelephone contact={CONTACTS['222_VETS']} /> (
        <VaTelephone contact={CONTACTS['711']} tty />
        ). We’re available Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </p>
    </div>
  );
};

Instructions.propTypes = {
  contactType: PropTypes.string,
  description: PropTypes.string,
  testId: PropTypes.string,
};

export default Instructions;
