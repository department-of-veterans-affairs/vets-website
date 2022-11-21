import React from 'react';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import environment from 'platform/utilities/environment';
import { format } from 'date-fns';

export const LETTER_ENDPOINT = `${environment.API_URL}/meb_api/v0/claim_letter`;

export const HasLetters = ({ claimStatus }) => {
  const receivedDate = format(
    new Date(claimStatus.receivedDate),
    'MMMM dd, yyyy',
  );

  return (
    <>
      <FormTitle title="Your VA education letter" />
      <p className="va-introtext">
        Download your VA education decision letter.
      </p>
      <h2>Letter available for you to download</h2>
      <div className="edu-certi-eligibility">
        <h3 className="vads-u-margin-top--2">Education decision letter</h3>
        <p>
          This letter is proof of your eligibility for VA education benefits. It
          shows details like which program you’re getting benefits through, the
          percentage of benefits you’re entitled to, and the time limit for
          using your benefits.
        </p>
        <div>
          <a className="vads-u-flex--1" download href={LETTER_ENDPOINT}>
            <i
              className="fa fa-download vads-u-display--inline-block vads-u-margin-right--1"
              aria-hidden="true"
            />
            Download Post-9/11 GI Bill decision letter (PDF)
          </a>
          <p>You applied for this on {receivedDate}</p>
        </div>
      </div>

      <h2 id="letter-isnt-listed">How do I download and open a letter?</h2>
      <p>
        First, you’ll need to make sure you have the latest version of Adobe
        Acrobat Reader installed on your computer.{' '}
        <a href="/">Download the latest version</a>. It’s free to download.
      </p>
      <p>
        <strong>
          Then, follow these steps to download and open a PDF letter:
        </strong>
      </p>
      <va-process-list>
        <li>
          <h3>
            Click on the link on this page for the letter you want to download.
          </h3>
          <p>
            The PDF will download to your Downloads folder. You can save it to a
            different folder if you’d like.
          </p>
          <p>
            <strong>Note: </strong>
            If the PDF form opens in your browser automatically or if you get a
            “Please wait” error message, you’ll need to take one more step to
            download the PDF: Click on the download icon in your browser. Save
            the PDF to your device.
          </p>
        </li>
        <li>
          <h3>Open Adobe Acrobat Reader.</h3>
        </li>
        <li>
          <h3>From the File menu, chose Open.</h3>
        </li>
        <li>
          <h3>
            Go to your Downloads folder or the location on your device where you
            saved the PDF. Select the PDF and your letter will open.
          </h3>
        </li>
      </va-process-list>

      <h2 id="letter-isnt-listed">What if I my letter isn’t listed here?</h2>
      <p>
        At this time, we only have letters available here that you received a
        decision on after August 20, 2022. To request a copy of an older letter,
        you can contact us through Ask VA.{' '}
        <a href="https://ask.va.gov/">
          Request your VA education letter through Ask VA.
        </a>
      </p>
    </>
  );
};

export const NoLetters = () => {
  return (
    <>
      <FormTitle title="VA education inbox" />
      <p className="va-introtext">
        Download important documents about your education benefits here,
        including your decision letters.{' '}
      </p>
      <va-alert close-btn-aria-label="Close notification" status="info" visible>
        <h3 slot="headline">
          We don’t have any letters available to you through this tool
        </h3>
        <div>
          <p>
            At this time, we only have letters available here that you received
            a decision on after August 20, 2022. To request a copy of an older
            letter, you can contact us through Ask VA.
          </p>
          <a href="https://ask.va.gov/">
            Request your VA education letter through Ask VA.
          </a>
        </div>
      </va-alert>
    </>
  );
};
