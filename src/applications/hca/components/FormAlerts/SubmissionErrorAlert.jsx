import React, { useEffect } from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { focusElement } from 'platform/utilities/ui';

const SubmissionErrorAlert = () => {
  useEffect(() => {
    focusElement('.hca-error-message');
  }, []);

  return (
    <div className="hca-error-message vads-u-margin-y--4">
      <va-alert status="error" uswds>
        <h3 slot="headline">We didn’t receive your online application</h3>
        <div>
          <p className="vads-u-margin-top--0">
            We’re sorry. Something went wrong on our end. Try again later.
          </p>
          <p>
            <strong>
              If you’re trying to apply based on our expansion of health care
              benefits starting on March 5, 2024
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
            </li>
            <li>Mail us an application.</li>
            <li>
              Or bring your application in person to your nearest VA health
              facility.
            </li>
          </ul>
          <p>
            <va-link
              href="/health-care/how-to-apply/#you-can-also-apply-in-any-of-t"
              text="Learn more about how to apply by phone, mail, or in person"
            />
          </p>
        </div>
      </va-alert>
    </div>
  );
};

export default SubmissionErrorAlert;
