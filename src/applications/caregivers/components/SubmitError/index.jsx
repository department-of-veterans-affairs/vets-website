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

const readStream = stream => {
  const reader = stream.getReader();
  let result = '';
  reader.read().then(function processText({ done, value }) {
    // Result objects contain two properties:
    // done  - true if the stream has already given you all its data.
    // value - some data. Always undefined when done is true.
    if (done()) {
      return;
    }
    result += value;
    // Read some more, and call this function again
    return reader.read().then(processText());
  });
  return result;
};

const SubmitError = props => {
  const [PDFData, savePDF] = useState(null);

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
      ).then(response => {
        savePDF(`${response.body}`);
        console.log('response', readStream(response.body));
        console.log('PDFData: ', PDFData);
      });
    },
    [props.form, savePDF],
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

        <a
          onClick={() => download(PDFData, '1010cg-pdf', 'application/pdf')}
          download="Voices_Of_Veterans.pdf"
          type="application/pdf"
          rel="noreferrer noopener"
          target="_blank"
          className="vads-u-margin-top--2"
        >
          <i
            aria-hidden="true"
            className="fas fa-download vads-u-padding-right--1"
            role="img"
          />
          Download your completed application
        </a>

        <a
          download={`1010cg dated ${moment(Date.now()).format('MMM D, YYYY')}`}
          href={`${
            environment.API_URL
          }/v0/caregivers_assistance_claims/download_pdf`}
        >
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
