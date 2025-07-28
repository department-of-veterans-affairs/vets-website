import React, { useEffect, useState } from 'react';
import {
  useLoaderData,
  useSearchParams,
  useNavigation,
  redirect,
} from 'react-router-dom-v5-compat';
import {
  VaLoadingIndicator,
  VaBreadcrumbs,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Toggler } from 'platform/utilities/feature-toggles';
import { focusElement } from 'platform/utilities/ui';
import api from '../utilities/api';
import {
  SUBMISSIONS_BC_LABEL,
  submissionsBC,
  SORT_DEFAULTS,
} from '../utilities/submissions';
import { SORT_BY, PENDING_SORT_DEFAULTS } from '../utilities/poaRequests';
import { SEARCH_PARAMS } from '../utilities/constants';
import SortForm from '../components/SortForm';
import Pagination from '../components/Pagination';
import PaginationMeta from '../components/PaginationMeta';
import SubmissionsPageResults from '../components/SubmissionsPageResults';

const SubmissionsPage = title => {
  const [visibleAlert, setVisibleAlert] = useState(true);
  useEffect(
    () => {
      focusElement('h1.submissions__search-header');
      document.title = title.title;
    },
    [title],
  );
  const submissions = useLoaderData().data || [];
  const meta = useLoaderData().meta.page || {};
  const searchStatus = useSearchParams()[0].get('status');
  const navigation = useNavigation();
  return (
    <Toggler
      toggleName={
        Toggler.TOGGLE_NAMES.accreditedRepresentativePortalSubmissions
      }
    >
      <Toggler.Enabled>
        <section className="poa-request submissions">
          <VaBreadcrumbs
            breadcrumbList={submissionsBC}
            label={SUBMISSIONS_BC_LABEL}
            homeVeteransAffairs={false}
          />
          <VaAlert
            close-btn-aria-label="Close notification"
            status="info"
            closeable
            uswds
            onCloseEvent={() => setVisibleAlert(false)}
            visible={visibleAlert}
          >
            <h2 id="track-your-status-on-mobile" slot="headline">
              We are working to improve this tool.
            </h2>
            <p className="vads-u-margin-y--0">
              This early version of the Accredited Representative Portal has
              limited functionality.
            </p>
          </VaAlert>
          <h1
            data-testid="submissions-header"
            className="submissions__search-header"
          >
            Submissions
          </h1>
          <p className="submissions-subtext__copy vads-u-font-family--serif">
            Start here to submit VA forms for your claimants.
          </p>
          <p className="submissions__form-name vads-u-font-size--h3 vads-u-font-family--serif">
            Form 21-686c
          </p>
          <h2 className="submissions__form-description vads-u-font-size--h4">
            Application Request to Add and/or Remove Dependents
          </h2>
          <p className="submissions__subtext submissions__subtext">
            The form will be processed by VA Centralized Mail after you submit
            it.
            <va-link-action
              href="/representative/representative-form-upload/21-686c"
              text="Upload and submit VA Form 21-686c"
            />
          </p>
          <hr />

          <h2 className="submissions__search-header">Recent Submissions</h2>
          <p className="submissions-subtext__copy--secondary vads-u-font-family--serif">
            This list shows only your submissions sent through this portal from
            the past 60 days.
          </p>
          <SortForm
            options={[
              {
                sortBy: 'created_at',
                sortOrder: 'desc',
                label: 'Submitted date (newest)',
              },
              {
                sortBy: 'created_at',
                sortOrder: 'asc',
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
                <Pagination meta={meta} />
              </div>
            )}
          </div>
        </section>
      </Toggler.Enabled>
    </Toggler>
  );
};

SubmissionsPage.loader = async ({ request }) => {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get(SEARCH_PARAMS.SORTORDER);
  const sortBy = searchParams.get(SEARCH_PARAMS.SORTBY);
  const size = searchParams.get(SEARCH_PARAMS.SIZE);
  const number = searchParams.get(SEARCH_PARAMS.NUMBER);
  if (!Object.values(SORT_BY).includes(sortBy)) {
    searchParams.set(SEARCH_PARAMS.SORTORDER, SORT_BY.DESC);
    searchParams.set(SEARCH_PARAMS.SORTBY, SORT_BY.CREATED);
    searchParams.set(SEARCH_PARAMS.SIZE, PENDING_SORT_DEFAULTS.SIZE);
    searchParams.set(SEARCH_PARAMS.NUMBER, PENDING_SORT_DEFAULTS.NUMBER);
    throw redirect(`?${searchParams}`);
  }

  // Wait for the Promise-based Response object
  const response = await api.getSubmissions(
    { sort, size, number, sortBy },
    {
      signal: request.signal,
    },
  );

  // Returns the actual response so we can grab the `.submission` and `.meta` with the `useLoaderData()` hook
  return response?.json();
};

export default SubmissionsPage;
