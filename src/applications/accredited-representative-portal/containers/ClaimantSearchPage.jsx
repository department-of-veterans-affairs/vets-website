import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  VaTextInput,
  VaDate,
  VaLoadingIndicator,
  VaBreadcrumbs,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import SsnField from 'platform/forms-system/src/js/web-component-fields/SsnField';
import { useSearchParams, useNavigation } from 'react-router-dom';
import { focusElement } from 'platform/utilities/ui';
import api from '../utilities/api';
import {
  SEARCH_BC_LABEL,
  findClaimantBC,
  requestsContainStatus,
} from '../utilities/poaRequests';
import { addStyleToShadowDomOnPages } from '../utilities/helpers';
import POARequestCard from '../components/POARequestCard';

const lastFour = ssn => {
  return ssn?.substring(5);
};

const poaFormLink = () => {
  return (
    <va-link
      href="/get-help-from-accredited-representative/appoint-rep/introduction/"
      text="VA Form 21-22 (on VA.gov)"
    />
  );
};

const poaStatusCta = claimant => {
  if (
    claimant.representative &&
    requestsContainStatus('declination', claimant.poaRequests)
  ) {
    return (
      <span>
        To change POA, have the claimant submit a new representation request
        online using {poaFormLink()}.
      </span>
    );
  }
  if (
    claimant.representative &&
    requestsContainStatus('pending', claimant.poaRequests)
  ) {
    return 'If you accept the pending request from the claimant, you will replace the current representative with the new one.';
  }
  if (requestsContainStatus('declined', claimant.poaRequests)) {
    return (
      <span>
        To establish POA, have the claimant submit a new representation request
        online using {poaFormLink()}.
      </span>
    );
  }
  if (requestsContainStatus('pending', claimant.poaRequests)) {
    return 'To establish POA, accept the pending request from the claimant.';
  }
  return null;
};

const SearchResults = ({ claimant, searchData }) => {
  if (!claimant) {
    return (
      <>
        <p data-testid="representation-requests-table-fetcher-no-poa-requests">
          No result found for <strong>"{searchData.first_name}"</strong>
          {', '}
          <strong>"{searchData.last_name}"</strong>
          {', '}
          <strong>"{searchData.dob}"</strong>
          {', '}
          <strong>
            "***-**-
            {lastFour(searchData.ssn)}"
          </strong>
        </p>
        <va-banner
          data-label="Info banner"
          headline="How to establish power of attorney"
          type="info"
          className="home__banner"
          visible
        >
          <p>
            This individual may exist in the system, but if they have not
            designated you as their representative, you cannot view their
            information. To establish POA, have the claimant submit a POA
            request online using {poaFormLink()}.
          </p>
        </va-banner>
      </>
    );
  }

  return (
    <>
      <p
        data-testid="representation-requests-table-fetcher-poa-requests"
        className="claimant-search-showing-results"
      >
        Showing result for <strong>"{searchData.first_name}"</strong>
        {', '}
        <strong>"{searchData.last_name}"</strong>
        {', '}
        <strong>"{searchData.dob}"</strong>
        {', '}
        <strong>
          "***-**-
          {lastFour(searchData.ssn)}"
        </strong>
      </p>
      <h2 className="claimant-name">
        {claimant.lastName}, {claimant.firstName}
      </h2>
      <p className="poa-request__card-field vads-u-margin-bottom--2">
        <span>{claimant.city}</span>
        <span>
          {claimant.city ? ', ' : ''}
          {claimant.state}
        </span>
        <span> {claimant.postalCode}</span>
      </p>
      {claimant.representative ? (
        <span>
          <strong>POA Status:</strong> {claimant.representative} has POA for
          this claimant.
        </span>
      ) : (
        <span>
          <strong>POA Status: </strong>
          <span>
            <va-icon size={3} icon="warning" class="yellow-warning" />
          </span>{' '}
          You do not have POA for this claimant.
        </span>
      )}
      {claimant.poaRequests?.length ? (
        <>
          <hr className="divider claimant-search" />
          <h3 className="claimant-search-recent-representation-requests">
            Recent representation requests
          </h3>
          <div className="poa-status-cta">{poaStatusCta(claimant)}</div>
          <ul
            data-testid="representation-requests-card"
            className="poa-request__list poa-request__list--search"
            sort-column={1}
          >
            {claimant.poaRequests.map((request, index) => (
              <POARequestCard poaRequest={request} key={index} />
            ))}
          </ul>
        </>
      ) : (
        ''
      )}
    </>
  );
};
SearchResults.propTypes = {
  claimant: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    postalCode: PropTypes.string,
    poaStatus: PropTypes.string,
    representative: PropTypes.string,
    icnTemporaryIdentifier: PropTypes.string,
    poaRequests: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  /* eslint-disable camelcase */
  searchData: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    dob: PropTypes.string,
    ssn: PropTypes.string,
  }),
  /* eslint-able camelcase */
};

const ClaimantSearchPage = title => {
  const [claimant, setClaimant] = useState({});
  const [searchData, setSearchData] = useState(false);
  const [lastSearchData, setLastSearchData] = useState(false);
  const [resetFormKey, setResetFormKey] = useState(0);
  const [validationPerformed, setValidationPerformed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const searchStatus = useSearchParams()[0].get('status');
  const navigation = useNavigation();
  useEffect(
    () => {
      document.title = title.title;
      focusElement('h1');
      // Insert CSS to hide 'For example: January 19 2000' hint on memorable dates
      // (can't be overridden by passing 'hint' to uiOptions):
      addStyleToShadowDomOnPages(
        [''],
        ['va-date'],
        'va-select::part(label), va-text-input::part(label) {margin-bottom:8px}',
      );
    },
    [title],
  );

  const allFieldsPresent = () =>
    searchData.first_name &&
    searchData.last_name &&
    searchData.dob &&
    searchData.ssn?.length === 9;

  const handleSubmit = e => {
    e.preventDefault();
    setValidationPerformed(true);
    if (allFieldsPresent()) {
      setLoading(true);
      api
        .claimantSearch({ ...searchData })
        .then(response => {
          response.json().then(json => {
            setClaimant(json.data);
          });
        })
        .catch(() => {
          setClaimant(null);
        })
        .finally(() => {
          setLastSearchData({ ...searchData });
          setSearchPerformed(true);
          setLoading(false);
          focusElement('div.representation-requests-page-table-container');
        });
    }
    return null;
  };

  const searchStatusText = () =>
    validationPerformed && !allFieldsPresent()
      ? 'Complete the required search fields and try the search again.'
      : '';

  const handleReset = e => {
    e.preventDefault();
    setSearchData({});
    setSearchPerformed(false);
    setValidationPerformed(false);
    // SsnField does not work properly as a controlled element,
    // so changing the key forces React to re-render it
    setResetFormKey(resetFormKey + 1);
    return null;
  };

  const handleChange = field => {
    return e => {
      const updatedSearchData = { ...searchData };
      if (field === 'ssn') {
        updatedSearchData[field] = e;
      } else {
        e.preventDefault();
        updatedSearchData[field] = e.target.value;
      }
      setSearchData(updatedSearchData);
    };
  };

  const searchResult = () =>
    searchPerformed ? (
      <div className="representation-requests-page-table-container">
        <div
          className={searchStatus}
          id={`tabpanel-${searchStatus}`}
          role="tabpanel"
          aria-labelledby={`tab-${searchStatus}`}
        >
          <SearchResults claimant={claimant} searchData={lastSearchData} />
        </div>
      </div>
    ) : (
      searchStatusText()
    );

  return (
    <section className="poa-search">
      <VaBreadcrumbs
        breadcrumbList={findClaimantBC}
        label={SEARCH_BC_LABEL}
        homeVeteransAffairs={false}
      />
      <h1
        data-testid="representation-requests-heading"
        className="poa-request__search-header"
      >
        Find claimant
      </h1>
      <div className="instructional-text va-introtext">
        Find a claimant you represent, or who has submitted a recent request for
        representation.
      </div>
      <form
        role="search"
        method="post"
        id="poa-request__search-form"
        action=""
        onSubmit={handleSubmit}
      >
        <VaTextInput
          label="First name"
          width="xl"
          name="first_name"
          required="required"
          value={searchData.first_name}
          onInput={handleChange('first_name')}
          error={
            validationPerformed && !searchData.first_name
              ? 'Enter a first name'
              : ''
          }
        />
        <VaTextInput
          label="Last name"
          width="xl"
          name="last_name"
          required="required"
          value={searchData.last_name}
          onInput={handleChange('last_name')}
          error={
            validationPerformed && !searchData.last_name
              ? 'Enter a last name'
              : ''
          }
        />
        <VaDate
          className="poa-request-search__date-field"
          label="Date of birth"
          name="dob"
          required="required"
          value={searchData.dob}
          onDateChange={handleChange('dob')}
          error={
            validationPerformed && !searchData.dob
              ? 'Enter a date of birth'
              : ''
          }
        />
        <SsnField
          key={`ssn-field-key-${resetFormKey}`}
          label="Social Security number"
          name="ssn"
          className="ssn-input"
          required="required"
          uiOptions={{ width: 'xl' }}
          error={
            validationPerformed && (searchData.ssn || '').length !== 9
              ? 'Please enter a valid 9 digit Social Security number (dashes allowed)'
              : ''
          }
          childrenProps={{
            formData: searchData.ssn,
            schema: '',
            idSchema: 'ssn',
            uiSchema: '',
            onChange: handleChange('ssn'),
            onBlur: () => {},
          }}
        />
        <div className="poa-request-search__form-buttons-container">
          <va-button
            text="Search"
            class="poa-request-search__form-submit"
            onClick={handleSubmit}
          />
          <va-button
            text="Clear search"
            class="poa-request-search__form-reset"
            onClick={handleReset}
            secondary
          />
        </div>
      </form>
      {navigation.state === 'loading' || loading ? (
        <VaLoadingIndicator message="Loading..." />
      ) : (
        searchResult()
      )}
    </section>
  );
};

ClaimantSearchPage.loader = async ({ request }) => {
  // Check authorization (403/401 handled by API wrapper)
  const res = await api.checkAuthorized({ signal: request.signal });
  if (res?.status === 401) throw res;
  return null;
};

export default ClaimantSearchPage;
