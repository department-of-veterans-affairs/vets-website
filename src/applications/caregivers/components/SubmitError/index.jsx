import React, { useEffect, useState } from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { submitTransform } from 'applications/caregivers/helpers';
import formConfig from 'applications/caregivers/config/form';
import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import moment from 'moment';
import download from 'downloadjs';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/formation-react/Telephone';
import { focusElement } from 'platform/utilities/ui';

const SubmitError = props => {
  const [PDFLink, setPDFLink] = useState(null);
  useEffect(
    () => {
      focusElement('.caregivers-error-message');
      apiRequest(
        `${environment.API_URL}/v0/caregivers_assistance_claims/download_pdf`,
        {
          method: 'POST',
          body: submitTransform(formConfig, props.form),
          headers: {
            'Content-Type': 'application/json',
            'Source-App-Name': 'caregivers-10-10cg-',
          },
        },
      )
        .then(response => {
          return response.blob();
        })
        .then(blob => {
          const url = URL.createObjectURL(blob);
          setPDFLink(url);
        })
        .catch(err => console.error(err));
    },
    [props.form, setPDFLink],
  );

  const ErrorBody = () => {
    return (
      <section>
        <p>
          We’re sorry. Something went wrong when you tried to submit your
          application. You won't be able to resubmit the form online.
        </p>

        <div>
          <b className="vads-u-font-size--h5">What you can do now</b>

          <p>
            Please review your application to make sure you entered your
            information correctly. Then download, print, and sign a copy of your
            completed application.
          </p>
        </div>

        <div>
          <p>Mail your applicaiton to:</p>

          <p className="va-address-block vads-u-margin-bottom--2 vads-u-margin-x--0 vads-u-font-size--h4">
            <b className="vads-u-font-size--h5">
              Program of Comprehensive Assistance for Family Caregivers
            </b>
            <br />
            Health Eligibility Center <br />
            2957 Clairmont Road NE, Ste 200 <br />
            Atlanta, GA 30329-1647 <br />
          </p>
        </div>

        <div>
          If you have trouble downloading your application, call our
          <a className="vads-u-margin-x--0p5" href="VA.gov">
            VA.gov
          </a>
          help desk at <Telephone contact={CONTACTS.HELP_DESK} /> (TTY: 711).
          We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
        </div>

        <a href={PDFLink} target="_blank" rel="noreferrer noopener">
          <i
            aria-hidden="true"
            role="img"
            className="fas fa-download vads-u-padding-right--1"
          />
          Download your completed application
          <span className="sr-only">
            `dated ${moment(Date.now()).format('MMM D, YYYY')}`
          </span>{' '}
          <dfn>
            <abbr title="Portable Document Format">(PDF)</abbr>
          </dfn>
        </a>
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
