import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import { useSelector } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';
import { APP_URLS } from '../../utils/appUrls';
import { CONTACTS } from '../../utils/imports';

const RegistrationOnlyAlert = ({ headingLevel = 3 }) => {
  const { currentlyLoggedIn } = useSelector(state => state.user.login);
  const subHeadingLevel = parseInt(headingLevel, 10) + 1;
  const H = `h${headingLevel}`;
  const SH = `h${subHeadingLevel}`;
  const vaFormLink = (
    <va-link
      href="/find-forms/about-form-10-10ez/"
      text="Get VA Form 10-10EZ to download"
    />
  );

  useEffect(() => {
    recordEvent({
      event: 'hca-reg-only-flow',
      'user-auth-status': `logged ${currentlyLoggedIn ? 'in' : 'out'}`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <va-alert status="info">
      <H slot="headline">Care for service-connected conditions</H>
      <p>
        You selected that you want to register for health care for your
        service-connected conditions only.
      </p>
      <p>You can register by mail or in person.</p>

      <p>
        <strong>Note:</strong> If you need help or have any questions call our
        Health Eligibility Center at{' '}
        <va-telephone contact={CONTACTS['222_VETS']} /> (
        <va-telephone contact={CONTACTS['711']} tty />
        ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m.{' '}
        <dfn>
          <abbr title="Eastern Time">ET</abbr>
        </dfn>
        .
      </p>

      <SH className="vads-u-font-size--h4">By mail</SH>
      <p>
        Fill out the PDF version of our Application for Health Benefits (VA Form
        10-10EZ).
      </p>
      <p>{vaFormLink}</p>
      <p>
        When you get to <strong>Type of benefit(s) applying for</strong> in the
        first section, be sure to select only <strong>Registration</strong>.
      </p>
      <p>Mail your completed application to this address:</p>
      <p className="va-address-block">
        Health Eligibility Center
        <br role="presentation" />
        PO Box 5207
        <br role="presentation" />
        Janesville, WI 53547-5207
      </p>

      <SH className="vads-u-font-size--h4">In person</SH>
      <p>Go to your nearest VA medical center.</p>
      <p>
        Bring a completed and signed Application for Health Benefits (VA Form
        10-10EZ) with you.
      </p>
      <p>{vaFormLink}</p>
      <p>Ask for the location of the eligibility and enrollment office.</p>
      <p>
        <va-link
          href={APP_URLS.facilities}
          text="Find your nearest VA medical center"
        />
      </p>
    </va-alert>
  );
};

RegistrationOnlyAlert.propTypes = {
  headingLevel: propTypes.number,
};

export default RegistrationOnlyAlert;
