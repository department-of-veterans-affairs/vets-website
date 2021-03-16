import React, { useEffect } from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';
import { focusElement } from 'platform/utilities/ui';

import DownLoadLink from './DownloadLink';

const SubmitError = ({ form }) => {
  useEffect(() => {
    focusElement('.caregivers-error-message');
  }, []);

  const ErrorBody = () => {
    return (
      <section>
        <p>
          We’re sorry. Something went wrong when you tried to submit your
          application. You won't be able to resubmit the form online.
        </p>

        <div>
          <strong className="vads-u-font-size--h5">What you can do now</strong>

          <p>
            Please review your application to make sure you entered your
            information correctly. Then download, print, and sign a copy of your
            completed application.
          </p>
        </div>

        <div>
          <p className="vads-u-margin-top--1p5">Mail your application to:</p>

          <p className="va-address-block vads-u-margin-bottom--2 vads-u-margin-x--0 vads-u-font-size--h4">
            <strong className="vads-u-font-size--h5">
              Program of Comprehensive Assistance for Family Caregivers
            </strong>
            <br />
            Health Eligibility Center <br />
            2957 Clairmont Road NE, Ste 200 <br />
            Atlanta, GA 30329-1647 <br />
          </p>
        </div>

        <div>
          If you have trouble downloading your application, call our
          <a className="vads-u-margin-x--0p5" href="https://www.va.gov/">
            VA.gov
          </a>
          help desk at <Telephone contact={CONTACTS.HELP_DESK} /> (TTY: 711).
          We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
        </div>

        <DownLoadLink form={form} />
      </section>
    );
  };

  return (
    <AlertBox
      className="caregivers-error-message"
      headline="We didn't receive your online application"
      content={ErrorBody()}
      status="error"
    />
  );
};

export default SubmitError;
