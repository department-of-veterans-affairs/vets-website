import React, { useEffect } from 'react';
import {
  useLoaderData,
  useSearchParams,
  useNavigation,
  redirect,
} from 'react-router-dom';
import {
  VaLoadingIndicator,
  VaBreadcrumbs,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';
import api from '../utilities/api';
import {
  SEARCH_PARAMS,
  SORT_BY,
  SUBMISSION_DEFAULTS,
  SORT_DEFAULTS,
  submissionsBC,
  SUBMISSIONS_BC_LABEL,
} from '../utilities/constants';
import SortForm from '../components/SortForm';
import Pagination from '../components/Pagination';
import PaginationMeta from '../components/PaginationMeta';
import SubmissionsPageResults from '../components/SubmissionsPageResults';

const SubmissionsPage = title => {
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
  return (
    <section className="poa-request submissions">
      <VaBreadcrumbs
        breadcrumbList={submissionsBC}
        label={SUBMISSIONS_BC_LABEL}
        homeVeteransAffairs={false}
      />
      <h1
        data-testid="submissions-header"
        className="submissions__search-header"
      >
        Submissions
      </h1>
      <p className="submissions-subtext__copy vads-u-font-family--serif">
        Start here to submit VA forms for your claimants.
      </p>

      <div className="submissions__form-start">
        <h2 className="submissions__form-name vads-u-font-size--h3 vads-u-font-family--serif">
          VA Form 21-686c
        </h2>
        <p className="submissions__form-description vads-u-font-size--h4">
          Application Request to Add and/or Remove Dependents
        </p>
        <p className="submissions__subtext submissions__subtext">
          The form will be processed by VA Centralized Mail after submission.
        </p>
        <va-link-action
          href="/representative/representative-form-upload/submit-va-form-21-686c"
          text="Upload and submit VA Form 21-686c"
          type="secondary"
        />
      </div>

      <div className="submissions__form-start">
        <h2 className="submissions__form-name vads-u-font-size--h3 vads-u-font-family--serif submissions__margin-top">
          VA Form 21-526EZ
        </h2>
        <p className="submissions__form-description vads-u-font-size--h4">
          Application for Disability Compensation and Related Compensation
          Benefits
        </p>
        <p className="submissions__subtext submissions__subtext">
          The form will be processed by VA Centralized Mail after submission.
        </p>
        <va-link-action
          href="/representative/representative-form-upload/submit-va-form-21-526EZ"
          text="Upload and submit VA Form 21-526EZ"
          type="secondary"
        />
      </div>
      <div className="submissions__form-start">
        <h2 className="submissions__form-name vads-u-font-size--h3 vads-u-font-family--serif submissions__margin-top">
          VA Form 21-0966
        </h2>
        <p className="submissions__form-description vads-u-font-size--h4">
          Intent to File a Claim for Compensation and/or Pension, or Survivors
          Pension and/or DIC
        </p>
        <p className="submissions__subtext submissions__subtext">
          The intent to file will be recorded immediately after submission.
        </p>
        <va-link-action
          href="/representative/representative-form-upload/submit-va-form-21-0966/introduction"
          text="Submit online VA Form 21-0966"
          type="secondary"
        />
      </div>
      <hr />
      <h2 className="submissions__search-header">Recent Submissions</h2>
      <p className="submissions-subtext__copy--secondary vads-u-font-family--serif">
        This list shows only your submissions sent through this portal.
      </p>
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
      {meta && submissions ? (
        <PaginationMeta
          meta={meta}
          results={submissions}
          resultType="submissions"
          defaults={SORT_DEFAULTS}
        />
      ) : (
        ''
      )}
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
            <SubmissionsPageResults submissions={submissions} />
            <Pagination meta={meta} defaults={SUBMISSION_DEFAULTS} />
          </div>
        )}
      </div>
    </section>
  );
};

SubmissionsPage.loader = async ({ request }) => {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get(SEARCH_PARAMS.SORT);
  const size = searchParams.get(SEARCH_PARAMS.SIZE);
  const number = searchParams.get(SEARCH_PARAMS.NUMBER);
  if (!Object.values(SORT_BY).includes(sort)) {
    searchParams.set(SEARCH_PARAMS.SORT, SORT_BY.NEWEST);
    searchParams.set(SEARCH_PARAMS.SIZE, SUBMISSION_DEFAULTS.SIZE);
    searchParams.set(SEARCH_PARAMS.NUMBER, SUBMISSION_DEFAULTS.NUMBER);
    throw redirect(`?${searchParams}`);
  }

  // Wait for the Promise-based Response object
  const response = await api.getSubmissions(
    { sort, size, number },
    {
      signal: request.signal,
    },
  );

  // Returns the actual response so we can grab the `.submission` and `.meta` with the `useLoaderData()` hook
  return response?.json();
};

export default SubmissionsPage;
