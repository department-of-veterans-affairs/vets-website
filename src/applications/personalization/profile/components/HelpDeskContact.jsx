import React from 'react';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const HelpDeskContact = ({ testId }) => (
  <>
    <va-telephone
      data-testid={`${testId}-va-800-number`}
      contact={CONTACTS.VA_BENEFITS}
    />{' '}
    (
    <va-telephone
      data-testid={`${testId}-va-711-number`}
      contact={CONTACTS['711']}
      tty
    />
    )
  </>
);

HelpDeskContact.propTypes = {
  testId: PropTypes.string,
};

export default HelpDeskContact;
