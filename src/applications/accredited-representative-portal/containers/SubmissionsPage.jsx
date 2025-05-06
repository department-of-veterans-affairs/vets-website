import React, { useEffect } from 'react';
import {
  useLoaderData,
  useSearchParams,
  redirect,
  useNavigation,
} from 'react-router-dom';
import {
  VaLoadingIndicator,
  VaBreadcrumbs,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Toggler } from 'platform/utilities/feature-toggles';
import { focusElement } from 'platform/utilities/ui';
import api from '../utilities/api';
import {
  SUBMISSIONS_BC_LABEL,
  submissionsBC,
  SORT_BY,
  PENDING,
  STATUSES,
} from '../utilities/submissions';
import { SEARCH_PARAMS } from '../utilities/constants';
import SortForm from '../components/SortForm';
import Pagination from '../components/Pagination';
import PaginationMeta from '../components/PaginationMeta';
import SubmissionCard from '../components/SubmissionCard';

const SearchResults = ({ submissions }) => {
  if (submissions.length === 0) {
    return (
      <p data-testid="submissions-table-fetcher-empty">
        No form submissions found
      </p>
    );
  }

  return (
    <ul
      data-testid="submissions-card"
      className="submissions__list"
      sort-column={1}
    >
      {submissions.map((submission, index) => {
        return <SubmissionCard submission={submission} key={index} />;
      })}
    </ul>
  );
};

const SubmissionsPage = title => {
  useEffect(
    () => {
      focusElement('h1.submissions__search-header');
      document.title = title.title;
    },
    [title],
  );
  const submissions = useLoaderData().data;
  const meta = useLoaderData().meta.page;
  const searchStatus = useSearchParams()[0].get('status');
  const navigation = useNavigation();

  return (
    <Toggler
      toggleName={
        Toggler.TOGGLE_NAMES.accreditedRepresentativePortalSubmissions
      }
    >
      <Toggler.Enabled>
        <section className="poa-request">
          <VaBreadcrumbs
            breadcrumbList={submissionsBC}
            label={SUBMISSIONS_BC_LABEL}
            homeVeteransAffairs={false}
          />
          <va-banner
            data-label="Info banner"
            headline="We are working to improve this tool."
            type="info"
            className="home__banner"
            visible
          >
            <p>
              This early version of the Accredited Representative Portal has
              limited functionality.
            </p>
          </va-banner>
          <h1
            data-testid="submissions-header"
            className="submissions__search-header"
          >
            Submissions
          </h1>
          <p className="submissions-subtext__copy">
            Start here to submit VA forms for your claimants.
          </p>
          <p className="submissions-21-686-c__form-name">Form 21-686c</p>
          <h3>Application Request to Add and/or Remove Dependents</h3>
          <p className="submissions-21-686-c__subtext">
            The form will be processed by VA Centralized Mail after you submit
            it.
            <va-link-action
              href="/find-forms/about-form-21-686c/"
              text="Upload and submit VA Form 21-686c"
            />
          </p>
          <hr />

          <h1>Recent Submissions</h1>
          <p className="submissions-subtext__copy">
            This list shows only your submissions sent through this portal from
            the past 60 days.
          </p>
          <SortForm
            api={api.getFormSubmissions}
            asc={SORT_BY.ASC}
            desc={SORT_BY.DESC}
            ascOption={PENDING.ASC_OPTION}
            descOption={PENDING.DESC_OPTION}
          />
          <PaginationMeta meta={meta} results={submissions} />
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
                <SearchResults submissions={submissions} />
                <Pagination meta={meta} />
              </div>
            )}
          </div>
        </section>
      </Toggler.Enabled>
    </Toggler>
  );
};

SubmissionsPage.loader = ({ request }) => {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get(SEARCH_PARAMS.STATUS);
  const sort = searchParams.get(SEARCH_PARAMS.SORTORDER);
  const sortBy = searchParams.get(SEARCH_PARAMS.SORTBY);
  const size = searchParams.get(SEARCH_PARAMS.SIZE);
  const number = searchParams.get(SEARCH_PARAMS.NUMBER);
  if (
    !Object.values(STATUSES).includes(status) &&
    !Object.values(STATUSES).includes(sort)
  ) {
    searchParams.set(SEARCH_PARAMS.STATUS, STATUSES.PENDING);
    searchParams.set(SEARCH_PARAMS.SORTORDER, SORT_BY.CREATED);
    searchParams.set(SEARCH_PARAMS.SORTBY, SORT_BY.DESC);
    searchParams.set(SEARCH_PARAMS.SIZE, STATUSES.SIZE);
    searchParams.set(SEARCH_PARAMS.NUMBER, STATUSES.NUMBER);
    throw redirect(`?${searchParams}`);
  }

  return api.getSubmissions(
    { status, sort, size, number, sortBy },
    {
      signal: request.signal,
    },
  );
};

export default SubmissionsPage;
