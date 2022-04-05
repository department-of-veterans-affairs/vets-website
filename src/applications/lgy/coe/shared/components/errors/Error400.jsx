import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/Telephone';
import PropTypes from 'prop-types';

const getIntroSentence = origin =>
  origin === 'documents'
    ? 'You may have received letters from us about your VA home loan Certificate of Eligibility, but we can’t find that information'
    : 'You may already have a VA Home loan Certificate of Eligibility but we can’t find the information';

export const Error400 = ({ origin }) => {
  const introSentence = getIntroSentence(origin);

  return (
    <va-alert
      close-btn-aria-label="Close notification"
      status="warning"
      visible
    >
      <h3 slot="headline">We can’t find your VA home loan COE status</h3>
      <p>
        {introSentence}. Please refresh this page or check back later. You can
        also sign out of VA.gov and try signing back into this page.
      </p>
      <p>
        If you get this error again, please call the VA.gov help desk at{' '}
        <va-telephone contact="8446982311" /> (TTY:{' '}
        <va-telephone contact={CONTACTS['711']} />
        ). We’re here Monday–Friday, 8:00 a.m.–8:00 p.m. ET.
      </p>
      {origin === 'form' && (
        <p>
          <strong>If you would like to continue</strong> and submit an online
          request for you COE, please continue to start the request process
        </p>
      )}
    </va-alert>
  );
};

Error400.propTypes = {
  origin: PropTypes.string,
};
