import React, { useEffect } from 'react';
import {
  useLoaderData,
  useSearchParams,
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
  SORT_DEFAULTS,
} from '../utilities/submissions';
import { SEARCH_PARAMS } from '../utilities/constants';
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

          <h2 className="submissions__search-header vads-u-font-size--h1">
            Recent Submissions
          </h2>
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
  let sort = searchParams.get(SEARCH_PARAMS.SORTORDER);
  let sortBy = searchParams.get(SEARCH_PARAMS.SORTBY);
  let size = searchParams.get(SEARCH_PARAMS.SIZE);
  let number = searchParams.get(SEARCH_PARAMS.NUMBER);
  if (!['asc', 'desc'].includes(sort)) {
    sort = SORT_DEFAULTS.SORT_ORDER;
    sortBy = SORT_DEFAULTS.SORT_BY;
    size = SORT_DEFAULTS.SIZE;
    number = SORT_DEFAULTS.NUMBER;
  }
  if (size === '0') {
    size = SORT_DEFAULTS.SIZE;
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
