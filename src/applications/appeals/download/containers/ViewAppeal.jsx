import React, { useEffect } from 'react';
import { format } from 'date-fns';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';

import extraData from '../tests/fixtures/data/extra-data.json';
import testData from '../tests/fixtures/data/test-data.json';

import GetFormHelp from '../../10182/content/GetFormHelp';

import { disagreeWith } from '../../testing/utils/areaOfDisagreement';
import { getIssueName, getIssueDate } from '../../shared/utils/issues';

const ViewAppeal = () => {
  useEffect(() => {
    focusElement('h2');
    scrollToTop('topScrollElement');
  });

  const { data } = testData;
  const { fullName } = extraData;

  const submitted = new Date('2023-12-1');

  const borderLine = [
    'vads-u-border-bottom--1px',
    'vads-u-border-color--gray-light',
    'vads-u-padding-x--0',
    'vads-u-margin-bottom--0',
  ].join(' ');

  return (
    <div className="row vads-u-margin-bottom--4">
      <div className="usa-width-two-thirds medium-8 columns">
        <div name="topScrollElement" />
        <va-breadcrumbs>
          <a href="/">Home</a>
          <a href="/decision-reviews">Decision reviews and appeals</a>
          <a href="/decision-reviews/board-appeal">Board Appeals</a>
          <a href="/decision-reviews/submitted-appeal">
            Your submitted Board Appeal
          </a>
        </va-breadcrumbs>
        <h1>Your submitted Board Appeal</h1>
        <div className="schemaform-subtitle">
          VA Form 10182 (Notice of Disagreement)
        </div>

        <h2 className="vads-u-font-size--h3">
          Board Appeal submitted on{' '}
          <span>{format(submitted, 'MMMM d, yyyy')}</span>
        </h2>
        <p>
          You can review the answers you’ve submitted. Bookmark this page for
          your records.
        </p>

        <div className="inset">
          <h3 className="vads-u-margin-top--0 vads-u-font-size--h4">
            Download a copy of your Board Appeal (PDF)
          </h3>
          <p>
            If you’d like a PDF copy of your completed Board Appeal, you can
            download it now. The download link is only available until December
            8, 2023.
          </p>

          <va-link
            download
            href="#"
            text="Download a copy of your Board Appeal (PDF)"
          />
        </div>

        <h3 className="vads-u-margin-top--0">
          You submitted the following information for Board Appeal
        </h3>

        <h4 className={borderLine}>Personal Information</h4>
        <h5 className="vads-u-margin-top--2 vads-u-font-size--h6 vads-u-color--gray-medium">
          Name
        </h5>
        <span>
          {fullName.first} {fullName.middle} {fullName.last}
          {fullName.suffix ? `, ${fullName.suffix}` : null}
        </span>

        <h5 className="vads-u-margin-top--2 vads-u-font-size--h6 vads-u-color--gray-medium">
          VA File Number
        </h5>
        <span>
          ***-**-
          {data.veteran.vaFileLastFour}
        </span>
        <h5 className="vads-u-margin-top--2 vads-u-font-size--h6 vads-u-color--gray-medium">
          Date of birth
        </h5>
        <span>March 4, 1986</span>
        <h5 className="vads-u-margin-top--2 vads-u-font-size--h6 vads-u-color--gray-medium">
          Are you experiencing homelessness?
        </h5>
        <span>{data.homeless ? 'Yes' : 'No'}</span>
        <h5 className="vads-u-margin-top--2 vads-u-font-size--h6 vads-u-color--gray-medium">
          Mobile phone number
        </h5>
        <span>401-226-1234</span>
        <h5 className="vads-u-margin-top--2 vads-u-font-size--h6 vads-u-color--gray-medium">
          Email address
        </h5>
        <span>{data.veteran.email}</span>
        <h5 className="vads-u-margin-top--2 vads-u-font-size--h6 vads-u-color--gray-medium">
          Mailing address
        </h5>
        <div>{data.veteran.address.addressLine1}</div>
        <div>
          {data.veteran.address.city}, {data.veteran.address.stateCode}{' '}
          {data.veteran.address.zipCode}
        </div>
        <h5 className="vads-u-margin-top--2 vads-u-font-size--h6 vads-u-color--gray-medium">
          Primary Number
        </h5>
        <span>Mobile</span>

        <h4 className={borderLine}>Issues for review</h4>
        <h5 className="vads-u-margin-top--2 vads-u-font-size--h6 vads-u-color--gray-medium">
          Are you requesting an extension?
        </h5>
        <span>{data.requestingExtension ? 'Yes' : 'No'}</span>
        <h5 className="vads-u-margin-top--2 vads-u-font-size--h6 vads-u-color--gray-medium">
          Reason for extension
        </h5>
        <span>{data.extensionReason}</span>
        <h5 className="vads-u-margin-top--2 vads-u-font-size--h6 vads-u-color--gray-medium">
          Are you appealing denial of VA health care benefits?
        </h5>
        <span>{data.appealingVHADenial ? 'Yes' : 'No'}</span>
        <h5 className="vads-u-margin-top--2 vads-u-font-size--h6 vads-u-color--gray-medium">
          The issues you’re asking the board to review:
        </h5>

        <ul className="disagreement-list vads-u-padding--0">
          {data.areaOfDisagreement.map((issue, index) => (
            <li key={index}>
              <strong>{getIssueName(issue)}</strong>
              <div>
                Decision date:{' '}
                {format(new Date(getIssueDate(issue)), 'MMMM d, yyyy')}
              </div>
              <div>{disagreeWith(issue)}</div>
            </li>
          ))}
        </ul>

        <h4 className={borderLine}>Board Review Options</h4>
        <h5 className="vads-u-margin-top--2 vads-u-font-size--h6 vads-u-color--gray-medium">
          Select a Board review option:
        </h5>
        <span>Direct review by the Board</span>
        <h5 className="vads-u-margin-top--2 vads-u-font-size--h6 vads-u-color--gray-medium">
          Uploaded evidence
        </h5>
        <span>filename.pdf</span>
        <p />
        <va-button
          class="screen-only"
          onClick={window.print}
          text="Print this page for your records"
        />
        <h2 className="help-heading vads-u-padding-top--2">Need help?</h2>
        <GetFormHelp />
      </div>
    </div>
  );
};

export default ViewAppeal;
