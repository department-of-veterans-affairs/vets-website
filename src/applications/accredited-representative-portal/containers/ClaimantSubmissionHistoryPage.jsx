import React, { useEffect } from 'react';
import {
  useLoaderData,
  useSearchParams,
  useNavigation,
  redirect,
} from 'react-router-dom';
import {
  VaBreadcrumbs,
  VaLoadingIndicator,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';
import SortForm from '../components/SortForm';
import SubmissionsPageResults from '../components/SubmissionsPageResults';
import ClaimantDetailsWrapper from '../components/ClaimantDetailsWrapper';
import { submissionHistoryBC } from '../utilities/poaRequests';

const SUBMISSION_HISTORY_BC_LABEL = 'submission history breadcrumb';
import api from '../utilities/api';
import {
  SEARCH_PARAMS,
  SORT_BY,
  SUBMISSION_DEFAULTS,
  SORT_DEFAULTS,
  submissionsBC,
  SUBMISSIONS_BC_LABEL,
} from '../utilities/constants';

const ClaimantSubmissionHistoryPage = title => {
  useEffect(
    () => {
      focusElement('h1.submissions__search-header');
      document.title = title.title;
    },
    [title],
  );
  const submissions = useLoaderData().data || [];
  const meta = useLoaderData().meta || {};
  const searchStatus = useSearchParams()[0].get('status');
  const navigation = useNavigation();
  const { firstName, lastName } = useLoaderData().claimant;

  return (
    <section className="vads-u-width--full claimant-details-submission-history">
      <VaBreadcrumbs
        breadcrumbList={submissionHistoryBC}
        label={SUBMISSION_HISTORY_BC_LABEL}
        homeVeteransAffairs={false}
      />
      <ClaimantDetailsWrapper firstName={firstName} lastName={lastName}>
        <h2
          data-testid="submission-history-page-heading"
          className="vads-u-margin-y--0"
        >
          Submission history
        </h2>
        <p className="va-introtext">
          This list shows all submissions sent through the portal for this
          claimant from the past 60 days.
        </p>
        <va-link-action
          href="/representative/submissions"
          text="Submit forms"
          type="primary"
        />
        <SortForm
          options={[
            {
              sort: 'newest',
              label: 'Submitted date (newest)',
            },
            {
              sort: 'oldest',
              label: 'Submitted date (oldest)',
            },
          ]}
          defaults={SORT_DEFAULTS}
        />
        <div className="submissions-page-table-container">
          {navigation.state === 'loading' ? (
            <VaLoadingIndicator message="Loading..." />
          ) : (
            <div
              className={searchStatus}
              id={`tabpanel-${searchStatus}`}
              role="tabpanel"
              aria-labelledby={`tab-${searchStatus}`}
            >
              <SubmissionsPageResults submissions={submissions} omitClaimantName={true} />
            </div>
          )}
        </div>
      </ClaimantDetailsWrapper>
    </section>
  );
};

ClaimantSubmissionHistoryPage.loader = async ({ request }) => {
  const url = new URL(request.url);
  const { searchParams } = url;
  const sort = searchParams.get(SEARCH_PARAMS.SORT);
  const size = searchParams.get(SEARCH_PARAMS.SIZE);
  const number = searchParams.get(SEARCH_PARAMS.NUMBER);
  const path = url.pathname.split('/');
  const identifier = path[path.length - 1];
  if (!Object.values(SORT_BY).includes(sort)) {
    searchParams.set(SEARCH_PARAMS.SORT, SORT_BY.NEWEST);
    searchParams.set(SEARCH_PARAMS.SIZE, SUBMISSION_DEFAULTS.SIZE);
    searchParams.set(SEARCH_PARAMS.NUMBER, SUBMISSION_DEFAULTS.NUMBER);
    throw redirect(`?${searchParams}`);
  }

  // Wait for the Promise-based Response object
  const response = await api.getSubmissions(
    { sort, size, number, identifier },
    {
      signal: request.signal,
    },
  );

  // Returns the actual response so we can grab the `.submission` and `.meta` with the `useLoaderData()` hook
  return response?.json();
};

export default ClaimantSubmissionHistoryPage;
