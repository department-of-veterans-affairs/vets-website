import React, { useEffect } from 'react';
import format from 'date-fns/format';
import { useSelector } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { isLoggedIn as isSignedIn } from 'platform/user/selectors';

import ServiceProvidersText, {
  ServiceProvidersTextCreateAcct,
} from 'platform/user/authentication/components/ServiceProvidersText';

export default function ConfirmationPage() {
  const {
    submission: { response },
    data: { fullName },
  } = useSelector(state => state.form);
  const { userFullName } = useSelector(state => state?.user?.profile);
  const isLoggedIn = useSelector(isSignedIn);
  const name = isLoggedIn ? userFullName : fullName;

  useEffect(() => {
    focusElement('#thank-you-message');
    scrollToTop('topScrollElement');
  }, []);

  return (
    <div>
      <p>
        Equal to VA Form 28-8832 (Education/Vocational Counseling Application)
      </p>
      <h2
        id="thank-you-message"
        className="vads-u-font-size--h3 vads-u-margin-top--1"
      >
        Thank you for submitting your application
      </h2>
      <div className="inset">
        <h3 className="vads-u-margin-top--0 vads-u-font-size--h4">
          Personalized Career Planning and Guidance application{' '}
          <span className="additional">(VA Form 25-8832)</span>
        </h3>
        {Object.values(name).length > 0 && (
          <p>
            FOR: {name.first} {name.last}
          </p>
        )}

        {response && (
          <ul className="claim-list">
            <li>
              <strong>Date submitted</strong>
              <br />
              <span>{format(new Date(response.timestamp), 'MMM d, yyyy')}</span>
            </li>
          </ul>
        )}
        <button
          type="button"
          className="usa-button button screen-only"
          onClick={() => window.print()}
        >
          Print this page
        </button>
      </div>
      <h2 className="vads-u-font-size--h3">What happens after I apply?</h2>
      <p>
        If you’re eligible for career planning and guidance benefits, we’ll
        invite you to an orientation session at your nearest VA regional office.
      </p>
      <p>
        If we haven’t contacted you within a week after you submitted your
        application, don’t apply again. Instead, call our toll-free hotline at{' '}
        <va-telephone contact={CONTACTS.VA_BENEFITS} />. We’re here Monday
        through Friday, 8:00 am to 8:00 pm ET.
      </p>
      <h2 className="vads-u-font-size--h3">
        How can I check the status of my application?
      </h2>
      <div className="process schemaform-process vads-u-padding-bottom--0">
        <ol>
          <li className="process-step list-one vads-u-padding-bottom--1p5">
            <h3 className="vads-u-font-size--h5">Sign in to VA.gov</h3>
            <p>
              You can sign in with your existing <ServiceProvidersText />
              account. <ServiceProvidersTextCreateAcct isFormBased />
              now.
            </p>
          </li>
          <li className="process-step list-two vads-u-padding-bottom--1p5">
            <h3 className="vads-u-font-size--h5">
              If you haven't yet verified your identity, complete this process
              when prompted
            </h3>
            <p>
              This helps keep your information safe, and prevents fraud and
              identity theft. If you’ve already verified your identity with us,
              you won’t need to do this again.
            </p>
          </li>
          <li className="process-step list-three vads-u-padding-bottom--1p5">
            <h3 className="vads-u-font-size--h5">
              Go to your personalized My VA homepage
            </h3>
            <p>
              Once you’re signed in, you can go to your homepage by clicking on
              the My VA link near the top right of any VA.gov page. You’ll find
              your application status information in the Your Applications
              section of your homepage.
            </p>
            <p>
              Please note: Your application status may take some time to appear
              on our homepage. If you don’t see it there right away, please
              check back later.
            </p>
          </li>
        </ol>
      </div>
      <a
        href="https://va.gov"
        target="_self"
        className="usa-button-primary"
        role="button"
      >
        Go back to VA.gov
      </a>
      <h3 className="vads-u-margin-top--1p5">What if I have more questions?</h3>
      <p>
        Please call us at <va-telephone contact={CONTACTS.VA_BENEFITS} />. We’re
        here Monday through Friday, 8:00 am to 8:00 p.m. ET.
      </p>
    </div>
  );
}
