import React, { useEffect } from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { focusElement } from 'platform/utilities/ui';

const SubmissionErrorAlert = () => {
  useEffect(() => {
    focusElement('.hca-error-message');
  }, []);

  return (
    <div className="hca-error-message vads-u-margin-bottom--4">
      <va-alert status="error" uswds>
        <h3 slot="headline">We didn’t receive your online application</h3>
        <div>
          <p className="vads-u-margin-top--0">
            We’re sorry. Something went wrong when you tried to submit your
            application. If you were signed in, you can try to submit your
            application again later. If you were not signed in, you may need to
            fill out and submit the online application again.
          </p>

          <h4 className="vads-u-font-size--h5">Other ways to apply</h4>
          <ul>
            <li>
              You can call our toll-free hotline at{' '}
              <va-telephone contact={CONTACTS['222_VETS']} /> to apply by phone,
              Monday through Friday, 8:00 a.m. to 8:00 p.m.{' '}
              <dfn>
                <abbr title="Eastern Time">ET</abbr>
              </dfn>
              , <strong>or</strong>
            </li>
            <li>
              You can download and fill out the application. Send your completed
              application here:
            </li>
          </ul>
          <p className="va-address-block vads-u-margin-bottom--2 vads-u-margin-x--0">
            Health Eligibility Center <br />
            2957 Clairmont Road NE, Ste 200 <br />
            Atlanta, GA 30329-1647 <br />
          </p>
          <p>
            If you have trouble downloading your application, call us at{' '}
            <va-telephone contact={CONTACTS.HELP_DESK} /> (
            <va-telephone contact={CONTACTS['711']} tty />
            ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m.{' '}
            <dfn>
              <abbr title="Eastern Time">ET</abbr>
            </dfn>
            .
          </p>

          <a
            href="https://www.va.gov/vaforms/medical/pdf/10-10EZ-fillable.pdf"
            aria-label="Download VA Form 10-10EZ - Opens in new window"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="hca-fillable-pdf-link"
          >
            <i
              className="fas fa-download vads-u-margin-right--1"
              aria-hidden="true"
              role="img"
            />
            Download VA Form 10-10EZ (
            <dfn>
              <abbr title="Portable Document Format">PDF</abbr>
            </dfn>
            )
          </a>
        </div>
      </va-alert>
    </div>
  );
};

export default SubmissionErrorAlert;
