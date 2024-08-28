import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import recordEvent from 'platform/monitoring/record-event';
import { APP_URLS } from '../../utils/constants';

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
      <p>
        We recommend calling our Health Eligibility Center to register. Or you
        can register by mail or in person.
      </p>

      <SH className="vads-u-font-size--h4">By phone</SH>
      <p>
        Call our Health Eligibility Center at{' '}
        <va-telephone contact={CONTACTS['222_VETS']} /> (
        <va-telephone contact={CONTACTS['711']} tty />) to register for care for
        your service-connected condition.
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
