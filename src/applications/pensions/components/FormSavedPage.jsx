import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import FormSaved from '@department-of-veterans-affairs/platform-forms/FormSaved';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { formatDateParsedZoneLong } from 'platform/utilities/date';

const FormSavedPage = props => {
  const itf = useSelector(state => state.form?.itf) || {};
  const date = itf.currentITF?.expirationDate;
  const itfExpirationDate = date ? formatDateParsedZoneLong(date) : null;
  const expirationMessage = itfExpirationDate ? (
    <p className="expires-container">
      Submit your application by{' '}
      <strong className="expires">{itfExpirationDate}</strong>. If you don’t
      submit your application by this date, you will need to restart the
      application. This will create a new intent to file date, which may change
      your effective date for benefits if your application is approved.
    </p>
  ) : (
    <>
      <p>
        There was a problem with our system when we tried to find your intent to
        file.
      </p>
      <strong>What to do next:</strong>
      <p className="itf-contact-container">
        Call us at <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
        <va-telephone contact="711" tty />) to confirm your intent to file. Your
        intent to file determines your effective date for benefits and the last
        day you can submit your saved application.
      </p>
    </>
  );

  return <FormSaved {...props} expirationMessage={expirationMessage} />;
};

FormSavedPage.propTypes = {
  itf: PropTypes.shape({
    currentITF: PropTypes.shape({
      expirationDate: PropTypes.string,
    }),
  }),
};

export default FormSavedPage;
