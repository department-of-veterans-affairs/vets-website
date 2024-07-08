import React from 'react';
// import { capitalize } from 'lodash';
import {
  VaCard,
  VaIcon,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
// import { mask, getFileSize } from '../helpers';

export const PrimaryActionLink = ({ href = '/', children, onClick = null }) => (
  <div className="action-bar-arrow">
    <div className="vads-u-background-color--primary vads-u-padding--1">
      <a className="vads-c-action-link--white" href={href} onClick={onClick}>
        {children}
      </a>
    </div>
  </div>
);

export const TITLE = 'Upload VA Form 21-0779';
export const SUBTITLE =
  'Request for Nursing Home Information in Connection with Claim for Aid and Attendance';

export const workInProgressContent = {
  description:
    'We’re rolling out Submit a Statement to Support a Claim (VA Form 21-4138) in stages. It’s not quite ready yet. Please check back again soon.',
  redirectLink: '/',
  redirectText: 'Return to VA home page',
};

export const UPLOAD_GUIDELINES = Object.freeze(
  <>
    <p className="vads-u-margin-top--0">
      You’ll need to scan your document onto the device you’re using to submit
      this application, such as your computer, tablet, or mobile phone. You can
      upload your document from there.
    </p>
    <div>
      <p>Guidelines for uploading a file:</p>
      <ul>
        <li>You can upload a .pdf, .jpeg, or .png file</li>
        <li>Your file should be no larger than 25MB</li>
      </ul>
    </div>
  </>,
);

export const USER_INFO_REVIEW = Object.freeze(
  <>
    <p className="vads-u-margin-top--0">
      When you submit your form, we’ll include the following personal
      information so that you can track your submission’s status.
    </p>
    <div className="vads-u-border-left--4px vads-u-border-color--primary vads-u-padding-left--1">
      <p>
        <b>
          {/* {capitalize(fullName.first)} {capitalize(fullName.last)} */}
          JOHN SMITH
        </b>
      </p>
      {/* {veteran && (
        <>
          <p>
            Social Security number:{' '}
            <span
              className="dd-privacy-mask"
              data-dd-action-name="Veteran's SSN"
            >
              {mask(veteran.ssn)}
            </span>
          </p>
          <p>Zip code: {veteran.address?.postalCode}</p>
        </>
      )} */}
      <>
        <p>
          Social Security number:{' '}
          <span className="dd-privacy-mask" data-dd-action-name="Veteran's SSN">
            123-12-1234
          </span>
        </p>
        <p>Zip code: 55555</p>
      </>
    </div>
    <p className="vads-u-margin-bottom--5">
      <b>Note:</b> If you need to update your personal information, call us at
      800-827-1000 (TTY:711). We’re here Monday through Friday, 8:00am to 9:00pm
      ET.
    </p>
  </>,
);

export const SUBMIT_PAGE_CONTENT = Object.freeze(
  <>
    <div className="vads-u-margin-top--2">
      <div className="vads-u-margin-y--1 vads-u-color--gray">Your file</div>
      <VaCard style={{ maxWidth: '50%' }}>
        <div className="vads-u-display--flex vads-u-flex-direction--row">
          <span className="vads-u-color--primary">
            <VaIcon
              size={6}
              icon="file_present"
              className="vads-u-margin-right--1"
              srtext="icon representing a file"
              aria-hidden="true"
            />
          </span>
          <div className="vads-u-display--flex vads-u-flex-direction--column">
            <span className="vads-u-font-weight--bold">
              UPLOADED FILE
              {/* file?.name */}
            </span>{' '}
            <span className="vads-u-color--gray-darker">
              25K
              {/* getFileSize(file?.size) */}
            </span>
          </div>
        </div>
      </VaCard>
    </div>
    <div className="vads-u-border-bottom--1px vads-u-margin-top--1 vads-u-margin-bottom--4">
      <h3>Your personal information</h3>
    </div>
    <div className="vads-u-border-left--4px vads-u-border-color--primary vads-u-padding-left--1">
      <p>
        <b>
          JOHN SMITH
          {/* capitalize(fullName.first)} {capitalize(fullName.last) */}
        </b>
      </p>
      {/* {veteran && (
        <>
          <p>
            Social Security number:{' '}
            <span
              className="dd-privacy-mask"
              data-dd-action-name="Veteran's SSN"
            >
              {mask(veteran.ssn)}
            </span>
          </p>
          <p>Zip code: {veteran.address?.postalCode}</p>
        </>
      )} */}
    </div>
    <p className="vads-u-margin-bottom--5">
      <b>Note:</b> If you need to update your personal information, please call
      us at 800-827-1000. We’re here Monday through Friday, 8:00am to 9:00pm ET.
    </p>
  </>,
);
