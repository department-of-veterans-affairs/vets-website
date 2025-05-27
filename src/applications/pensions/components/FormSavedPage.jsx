import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import FormSaved from '@department-of-veterans-affairs/platform-forms/FormSaved';

import { formatDateParsedZoneLong } from 'platform/utilities/date';

const FormSavedPage = props => {
  const itf = useSelector(state => state.form?.itf) || {};
  const date = itf.currentITF?.expirationDate;
  const itfExpirationDate = date ? formatDateParsedZoneLong(date) : 'Unknown';
  const expirationMessage = (
    <>
      <p className="expires-container">
        Submit your application by{' '}
        <strong className="expires">{itfExpirationDate}</strong>. If you don’t
        submit your application by this date, you will need to restart the
        application. This will create a new intent to file date, which may
        change your effective date for benefits if your application is approved.
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
