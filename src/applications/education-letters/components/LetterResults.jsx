import React from 'react';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import environment from 'platform/utilities/environment';
import { format } from 'date-fns';

export const LETTER_ENDPOINT = `${environment.API_URL}/meb_api/v0/claim_letter`;

export const HasLetters = ({ claimStatus }) => {
  const receivedDate = () => {
    const [year, month, day] = claimStatus?.receivedDate?.split('-');
    return format(new Date(`${month}-${day}-${year}`), 'MMMM dd, yyyy');
  };

  return (
    <>
      <FormTitle title="Download your VA education decision letter" />
      <p className="va-introtext">
        Check this page for your decision letter for Post-9/11 GI Bill benefits.
      </p>
      <h2>Your decision Letter</h2>
      <div className="vads-u-margin-bottom--4">
        <h3 className="vads-u-margin-top--2">
          Your decision letter is available
        </h3>
        <p>
          This letter contains our decision on your original application for
          Post-9/11 GI Bill benefits.
        </p>
        <p>You applied for this on {receivedDate()}</p>
        <div>
          <a className="vads-u-flex--1" download href={LETTER_ENDPOINT}>
            <i
              className="fa fa-download vads-u-display--inline-block vads-u-margin-right--1"
              aria-hidden="true"
            />
            Download your education decision letter (PDF)
          </a>
        </div>
        <p>
          <strong>Note: </strong>
          If we asked you for more information or you requested a decision
          review, we’ll send you a new decision letter by mail. You can’t
          download the new decision letter in this tool.
        </p>
      </div>

      <va-alert close-btn-aria-label="Close notification" status="info" visible>
        <h2 id="track-your-status-on-mobile" slot="headline">
          Education Decision Letter Update
        </h2>
        <div>
          <p className="vads-u-margin-y--0">
            The letter displayed here may not be the most recent decision letter
            issued. If your claim requires further clarification, a follow-up
            decision letter will be sent to you by mail. If you have additional
            questions, you can contact us through{' '}
            <a target="_blank" href="https://ask.va.gov/" rel="noreferrer">
              {' '}
              Ask VA.
            </a>
          </p>
        </div>
      </va-alert>

      <h2>How do I download and open a letter?</h2>
      <p>
        First, you’ll need to make sure you have the latest version of Adobe
        Acrobat Reader installed on your computer. It’s free to download.{' '}
        <a href="/">Download the latest version</a>.
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
            The PDF will save to your Downloads folder. You can save it to a
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
          <h3>From the File menu, and click Open.</h3>
        </li>
        <li>
          <h3>
            Go to your Downloads folder or the location on your device where you
            saved the PDF. Select the PDF and your letter will open.
          </h3>
        </li>
      </va-process-list>

      <h2 id="letter-isnt-listed">What if my letter isn’t listed here?</h2>
      <p>
        This tool only shows letters for decisions we made on or after August
        20, 2022.
      </p>
      <p>
        To request a different letter, you’ll need to contact us through Ask VA.{' '}
        <a target="_blank" href="https://ask.va.gov/" rel="noreferrer">
          Request a decision letter through Ask VA.
        </a>
      </p>
    </>
  );
};

export const NoLetters = () => {
  return (
    <>
      <FormTitle title="Download your education decision letter" />
      <p className="va-introtext">
        Check this page for your decision letter for Post-9/11 GI Bill benefits.{' '}
      </p>
      <va-alert close-btn-aria-label="Close notification" status="info" visible>
        <h2 slot="headline">Your decision letter</h2>
        <p className="va-introtext">
          Your decision letter isn’t available online{' '}
        </p>
        <div>
          <p>
            Your letter won’t be here if 1 of these situations is true for you:
          </p>
          <ul>
            <li>
              {' '}
              You did not receive an immediate decision on your most recent
              Post-9/11 GI Bill benefits application. A decision can take up to
              30 days after you submitted your application. Please return to
              this page to check for your decision letter.{' '}
            </li>
            <li>
              {' '}
              We made a decision on your Post-9/11 GI Bill benefits before
              August 20, 2022
            </li>
            <li>You’re a family member or a dependent of a Veteran</li>
          </ul>
          <p>
            {' '}
            You’ll need to contact us through Ask VA to request your decision
            letter.
          </p>
          <p>
            Request your VA education letter through{' '}
            <a target="_blank" href="https://ask.va.gov/" rel="noreferrer">
              {' '}
              Ask VA.
            </a>
          </p>
        </div>
      </va-alert>
    </>
  );
};
