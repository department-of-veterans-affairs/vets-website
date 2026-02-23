import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import ClaimantDetailsWrapper from '../components/ClaimantDetailsWrapper';

const SUBMISSION_HISTORY_BC_LABEL = 'submission history breadcrumb';

const submissionHistoryBreadcrumbs = [
  {
    href: '/representative',
    label: 'ARP Home',
  },
  {
    href: '/representative/find-claimant',
    label: 'Find claimant',
  },
  {
    href: window.location.href,
    label: 'Submission history',
  },
];

const ClaimantSubmissionHistoryPage = () => {
  return (
    <section className="vads-u-width--full">
      <VaBreadcrumbs
        breadcrumbList={submissionHistoryBreadcrumbs}
        label={SUBMISSION_HISTORY_BC_LABEL}
        homeVeteransAffairs={false}
      />
      <ClaimantDetailsWrapper firstName="firstName" lastName="lastName">
        <h2
          data-testid="submission-history-page-heading"
          className="vads-u-margin-y--0"
        >
          Submission history
        </h2>
        <p className="va-introtext">
          This list shows all submissions sent through the portal for this
          claimant form the past 60 days.
        </p>
        <va-link-action
          href="/representative/submissions"
          text="Submit form"
          type="primary"
        />
        {/* todo integrate with api and show submission history. just show no submissions for now */}
        <p>No submissions found.</p>
      </ClaimantDetailsWrapper>
    </section>
  );
};

export default ClaimantSubmissionHistoryPage;
