import React, { useEffect } from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { focusElement } from 'platform/utilities/ui';

const SubmissionErrorAlert = () => {
  useEffect(() => {
    focusElement('.hca-error-message');
  }, []);

  return (
    <div className="hca-error-message vads-u-margin-bottom--4">
      <va-alert status="error">
        <h3 slot="headline">We didn’t receive your online application</h3>
        <p>
          We’re sorry. Something went wrong when you tried to submit your
          application. Try again later.
        </p>

        <p>
          <strong>
            If you’re trying to apply by the September 30th special enrollment
            deadline for certain combat Veterans
          </strong>
          , you can also apply in other ways:
        </p>
        <ul>
          <li>
            Call us at <va-telephone contact={CONTACTS['222_VETS']} />, Monday
            through Friday, 8:00 a.m. to 8:00 p.m.{' '}
            <dfn>
              <abbr title="Eastern Time">ET</abbr>
            </dfn>
            .
          </li>
          <li>Mail us an application postmarked by September 30, 2023.</li>
          <li>
            Or bring your application in person to your nearest VA health
            facility.
          </li>
        </ul>
        <p>
          <a href="/health-care/how-to-apply/">
            Learn more about how to apply by phone, mail, or in person
          </a>
          .
        </p>
      </va-alert>
    </div>
  );
};

export default SubmissionErrorAlert;
