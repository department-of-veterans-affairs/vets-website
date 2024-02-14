import React, { useEffect } from 'react';
import { format } from 'date-fns';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import extraData from '../tests/fixtures/data/extra-data.json';
import testData from '../tests/fixtures/data/test-data.json';

const Confirmation = () => {
  useEffect(() => {
    focusElement('h2');
    scrollToTop('topScrollElement');
  });
  const { data } = testData;
  const { fullName } = extraData;

  const submitted = new Date();
  const issues = data.contestedIssues.map(issue => ({
    name: issue.attributes.ratingIssueSubjectText,
    date: issue.attributes.approxDecisionDate,
  }));

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
            After we’ve completed our review, we’ll mail you a decision packet
            with the details of our decision.
          </p>
        </va-alert>
        <div className="inset">
          <h3 className="vads-u-margin-top--0">
            Your information for this request
          </h3>
          <h4>Your name</h4>
          <span>
            {fullName.first} {fullName.middle} {fullName.last}
            {fullName.suffix ? `, ${fullName.suffix}` : null}
          </span>

          <h4>Date you filed your request</h4>
          <span>{format(submitted, 'MMMM d, yyyy')}</span>

          <h4>Issue(s) for review</h4>
          <ul>
            {issues.map(issue => (
              <li key={issue.name}>{issue.name}</li>
            ))}
          </ul>

          <h4>Get a copy of your Board Appeal request</h4>
          <p>
            <a
              href="/decision-reviews/submitted-appeal/view-appeal"
              className="vads-c-action-link--green"
            >
              View your submission and download a copy for your records
            </a>
          </p>
        </div>
        <h2 className="vads-u-font-size--h3">What to expect next</h2>
        <p>
          Your completed form will be submitted to the intake team. If your
          request is accurate and complete, you’ll be in line for review, and
          your request will show up in the status tool.
        </p>
        <p>
          If we need more information we’ll contact you to tell you what other
          information you’ll need to submit. We’ll also tell you if we need to
          schedule an exam or hearing for you.
        </p>
        <h2 className="vads-u-font-size--h3">
          How to contact us if you have questions
        </h2>
        <p>You can ask us a question online through Ask VA. </p>
        <p>
          {' '}
          <a href="https://ask.va.gov/">Contact us through Ask VA</a>
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
        <p>
          <strong>Note</strong>: You can request a hearing at any time during
          the decision review process.
        </p>
        <a href="/claim-or-appeal-status/" aria-describedby="delay-note">
          Check your claims and appeals status online
        </a>
        <p id="delay-note">
          <strong>Note</strong>: It may take 7 to 10 days for your Board Appeal
          request to appear online.
        </p>
      </div>
    </div>
  );
};

export default Confirmation;
