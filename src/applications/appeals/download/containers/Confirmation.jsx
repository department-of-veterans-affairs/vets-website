import React, { useEffect } from 'react';
import { format } from 'date-fns';

import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { srSubstitute } from 'platform/forms-system/src/js/utilities/ui/mask-string';

import extraData from '../tests/fixtures/data/extra-data.json';
import testData from '../tests/fixtures/data/test-data.json';

import { disagreeWith } from '../../testing/utils/areaOfDisagreement';
import { getIssueName, getIssueDate } from '../../shared/utils/issues';

// separate each number so the screenreader reads "number ending with 1 2 3 4"
// instead of "number ending with 1,234"
const maskVafn = number => {
  return srSubstitute(
    `●●●–●●–${number}`,
    `V A file number ending with ${number.split('').join(' ')}`,
  );
};

const Confirmation = () => {
  useEffect(() => {
    focusElement('h2');
    scrollToTop('topScrollElement');
  });
  const { data } = testData;
  const { fullName } = extraData;

  const submitted = new Date();
  const dateExpires = new Date();
  dateExpires.setDate(dateExpires.getDate() + 7);

  const borderLine = [
    'vads-u-border-bottom--1px',
    'vads-u-border-color--gray-light',
    'vads-u-padding-x--0',
    'vads-u-margin-bottom--0',
  ].join(' ');

  return (
    <div className="row">
      <div className="usa-width-two-thirds medium-8 columns vads-u-margin-bottom--4">
        <VaBreadcrumbs
          label="Decision reviews"
          breadcrumbList={[
            {
              href: '/',
              label: 'Home',
            },
            {
              href: '/decision-reviews',
              label: 'Decision reviews and appeals',
            },
            {
              href: '/decision-reviews/board-appeal',
              label: 'Board Appeals',
            },
            {
              href: '/decision-reviews/submitted-appeal',
              label: 'Request a Board Appeal',
            },
          ]}
          uswds
        />

        <FormTitle
          title="Request a Board Appeal"
          subTitle="VA Form 10182 (Notice of Disagreement)"
        />
        <va-alert status="success" uswds>
          <h2 slot="headline">You submitted your Board Appeal request</h2>
          <p>
            You’ll also receive a copy of your completed form in a confirmation
            email. After we’ve completed our review, we’ll mail you a decision
            packet with the details of our decision.
          </p>
        </va-alert>

        {/* <va-summary-box uswds class="vads-u-margin-y--2"> */}
        <div className="inset">
          <h3 slot="headline" className="vads-u-margin-top--0">
            Save a PDF copy of your Board Appeal
          </h3>
          <p>
            If you’d like a PDF copy of your completed Board Appeal, you can
            download it now. The download link is only available until
            <span> {format(dateExpires, 'MMMM d, yyyy')}</span>
          </p>

          <va-link
            download
            href="#"
            text="Download a copy of your Board Appeal (PDF)"
          />
        </div>
        {/* </va-summary-box> */}

        <h3 className="vads-u-margin-top--0">
          {`You submitted the following information for Board Appeal on ${format(
            submitted,
            'MMMM d, yyyy',
          )}`}
        </h3>

        <va-button
          class="screen-only vads-u-margin-top--2"
          onClick={window.print}
          text="Print this for your records"
          uswds
        />

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
        <span>{maskVafn(data.veteran.vaFileLastFour)}</span>
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
        <span>Subumit more evidence</span>
        <h5 className="vads-u-margin-top--2 vads-u-font-size--h6 vads-u-color--gray-medium">
          Uploaded evidence
        </h5>
        <div>103123_Medical-Records_Baker-H.pdf</div>

        <va-button
          class="screen-only vads-u-margin-top--4"
          onClick={window.print}
          text="Print this for your records"
          uswds
        />

        <h2>What to expect next</h2>
        <p>
          Your completed form will be submitted to the intake team. If your
          request is accurate and complete, you’ll be in line for review, and
          your request will show up in the status tool.
        </p>
        <p>
          If we need more information, we’ll contact you to tell you what other
          information you’ll need to submit. We’ll also tell you if we need to
          schedule an exam or hearing for you.
        </p>

        <a
          className="vads-c-action-link--green"
          href="/claim-or-appeal-status/"
          aria-describedby="delay-note"
        >
          Check your claims and appeals status online
        </a>
        <p>
          <strong>Note</strong>: It may take 7 to 10 days for your Board Appeal
          request to appear online.
        </p>

        <h2>How to contact us if you have questions</h2>
        <p>You can ask us a question online through Ask VA. </p>
        <p>
          <a href="https://ask.va.gov/">Contact us online through Ask VA</a>
        </p>
        <p>
          Or call us at <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
          <va-telephone contact={CONTACTS[711]} tty />
          ).
        </p>
        <p>
          <strong>
            If you don’t hear back from us about your Board Appeal,
          </strong>{' '}
          don’t file another claim or request another type of decision review.
          Contact us online or call us instead.
        </p>

        <p id="delay-note">
          <strong>Note</strong>: You can request a hearing at any time during
          the decision review process.
        </p>
      </div>
    </div>
  );
};

export default Confirmation;
