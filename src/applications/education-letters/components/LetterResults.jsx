import React from 'react';
import PropTypes from 'prop-types';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import environment from 'platform/utilities/environment';
import { format } from 'date-fns';

export const LETTER_ENDPOINT = `${environment.API_URL}/meb_api/v0/claim_letter`;

export const HasLetters = ({ claimStatus, showMebLettersMaintenanceAlert }) => {
  const receivedDate = () => {
    const [year, month, day] = claimStatus?.receivedDate?.split('-');
    return format(new Date(`${month}-${day}-${year}`), 'MMMM dd, yyyy');
  };

  return (
    <>
      <FormTitle title="Your VA education letter" />
      <p className="va-introtext">
        Check this page for your education decision letter for Post-9/11 GI Bill
        benefits.{' '}
      </p>
      {showMebLettersMaintenanceAlert && (
        <va-alert
          close-btn-aria-label="Close notification"
          status="error"
          visible
        >
          <h2 slot="headline">System Maintenance</h2>
          <p>
            We’re currently making updates to the My Education Benefits
            platform. We apologize for the inconvenience. Please check back
            soon.{' '}
          </p>
        </va-alert>
      )}
      <h2>Your education decision letter is available</h2>
      <div className="vads-u-margin-bottom--4">
        <p>
          This decision letter is for the claim you submitted for Post-9/11 GI
          Bill benefits on the date listed here.
        </p>
        <p>You applied for benefits on {receivedDate()}</p>
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
          If we asked you for more information and you’ve submitted it, this may
          not be the most recent decision letter. We’ll send you a new decision
          letter by mail.
        </p>
      </div>
      <h2>How do I download and open my education decision letter?</h2>
      <p>
        First, you’ll need to make sure you have the latest version of Adobe
        Acrobat Reader on your computer. It’s free to download.{' '}
      </p>
      <p>
        <a href="https://get.adobe.com/reader/">Download the latest version</a>{' '}
        of Adobe Acrobat Reader.
      </p>
      <p>
        <strong>
          Then follow these steps to download and open a PDF letter:
        </strong>
      </p>

      <p>
        1. Click on the link on this page for the letter you want to download.
      </p>
      <p>
        The PDF will download to your Downloads folder. You can save it to a
        different folder if you’d like.
      </p>
      <p>
        Note: If the PDF letter opens in your browser automatically or if you
        get a “Please wait” error message, you’ll need to take one more step to
        download the PDF: Click on the download icon in your browser. Save the
        PDF to your device.
      </p>

      <p>2. Open Adobe Acrobat Reader.</p>

      <p>3. Click on the File menu, and click Open.</p>

      <p>
        4. Go to your Downloads folder or the location on your device where you
        saved the PDF. Select the PDF and your letter will open.
      </p>

      <h2 id="letter-isnt-listed">
        What if my education decision letter isn’t here?
      </h2>
      <p>
        This tool has decision letters for decisions we made on or after August
        20, 2022. If we decided your claim before this date or if you want to
        request a different type of letter, contact us through{' '}
        <a href="https://ask.va.gov/" target="_blank" rel="noreferrer">
          Ask VA
        </a>
        .
      </p>
    </>
  );
};

HasLetters.propTypes = {
  claimStatus: PropTypes.shape({
    receivedDate: PropTypes.string,
    claimStatus: PropTypes.string,
  }),
  showMebLettersMaintenanceAlert: PropTypes.bool,
};

export const NoLetters = ({ showMebLettersMaintenanceAlert }) => {
  return (
    <>
      <FormTitle title="Your VA education letter" />
      <p className="va-introtext">
        Check this page for your education decision letter for Post-9/11 GI Bill
        benefits.{' '}
      </p>
      {!showMebLettersMaintenanceAlert && (
        <va-alert
          close-btn-aria-label="Close notification"
          status="info"
          visible
        >
          <h2 slot="headline">
            Your education decision letter isn’t available
          </h2>
        </va-alert>
      )}
      {showMebLettersMaintenanceAlert && (
        <va-alert
          close-btn-aria-label="Close notification"
          status="error"
          visible
        >
          <h2 slot="headline">System Maintenance</h2>
          <p>
            We’re currently making updates to the My Education Benefits
            platform. We apologize for the inconvenience. Please check back
            soon.{' '}
          </p>
        </va-alert>
      )}
      <div>
        <p>
          If you applied for Post-9/11 GI Bill benefits on VA.gov but didn’t
          receive an instant decision, your decision letter may not be available
          here yet. It can take us up to 30 days to make a decision after you
          submit your application. Check back soon to find out if your decision
          letter is available.
        </p>
        <p>
          You won’t be able to get your decision letter through this tool if 1
          of these is true for you:
        </p>
        <ul>
          <li>
            {' '}
            We made a decision on your Post-9/11 GI Bill benefits before August
            20, 2022, or{' '}
          </li>
          <li>You’re a family member or a dependent of a Veteran</li>
        </ul>
        <p>
          {' '}
          You can get your decision letter by contacting us online through{' '}
          <a href="https://ask.va.gov/" target="_blank" rel="noreferrer">
            Ask VA
          </a>{' '}
          instead.
        </p>
      </div>
      <h2 id="letter-isnt-listed">What if I have other questions?</h2>
      <p>
        You can contact us online through{' '}
        <a href="https://ask.va.gov/" target="_blank" rel="noreferrer">
          Ask VA
        </a>
        .
      </p>
      <p />
    </>
  );
};

NoLetters.propTypes = {
  showMebLettersMaintenanceAlert: PropTypes.bool,
};
