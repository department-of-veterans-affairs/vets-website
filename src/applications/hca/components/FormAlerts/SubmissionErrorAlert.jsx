import React, { useEffect } from 'react';
import { focusElement } from 'platform/utilities/ui';
import { Toggler } from '~/platform/utilities/feature-toggles';
import { CONTACTS } from '../../utils/imports';
import ApplicationDownloadLink from '../ApplicationDownloadLink';

const SubmissionErrorAlert = () => {
  useEffect(() => {
    focusElement('.hca-error-message');
  }, []);

  return (
    <div className="hca-error-message">
      <div className="vads-u-margin-y--4">
        <va-alert status="error" uswds>
          <h3 slot="headline">We didn’t receive your online application</h3>
          <div>
            <p className="vads-u-margin-y--0">
              We’re sorry. Something went wrong on our end. Try again later.
            </p>
          </div>
        </va-alert>
      </div>
      <va-card background className="vads-u-margin-top--4">
        <h4 className="vads-u-margin-y--0">Other ways to apply</h4>
        <ul>
          <li>
            Call us at <va-telephone contact={CONTACTS['222_VETS']} />, Monday
            through Friday, 8:00 a.m. to 8:00 p.m.{' '}
            <dfn>
              <abbr title="Eastern Time">ET</abbr>
            </dfn>
            {', '}
            <strong>or</strong>
          </li>
          <li>
            Mail us an application, <strong>or</strong>
          </li>
          <li>
            Bring your application in person to your nearest VA health facility.
          </li>
        </ul>
        <p>
          <va-link
            href="/health-care/how-to-apply/#you-can-also-apply-in-any-of-t"
            text="Learn more about how to apply by mail or in person"
          />
        </p>
        <Toggler toggleName={Toggler.TOGGLE_NAMES.hcaDownloadCompletedPdf}>
          <Toggler.Enabled>
            <p className="hca-application--download">
              <ApplicationDownloadLink />
            </p>
          </Toggler.Enabled>
        </Toggler>
      </va-card>
    </div>
  );
};

export default SubmissionErrorAlert;
