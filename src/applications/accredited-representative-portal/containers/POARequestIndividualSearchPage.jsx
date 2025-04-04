import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaTextInput,
  VaDate,
  VaLoadingIndicator,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import SsnField from 'platform/forms-system/src/js/web-component-fields/SsnField';
import { useSearchParams, useNavigation } from 'react-router-dom';
import api from '../utilities/api';
import POARequestSearchCard from '../components/POARequestSearchCard';

const SearchResults = ({ poaRequests, searchData }) => {
  if (poaRequests.length === 0) {
    return (
      <p data-testid="poa-requests-table-fetcher-no-poa-requests">
        We did not find an individual “{searchData.first_name}{' '}
        {searchData.last_name}
        ”, “{searchData.dob}
        ”, “{searchData.ssn}” who has submitted a power of attorney request in
        the past 60 days to you or your organizations.
      </p>
    );
  }

  return (
    <ul
      data-testid="poa-requests-card"
      className="poa-request__list"
      sort-column={1}
    >
      {poaRequests.map((request, index) => {
        return <POARequestSearchCard poaRequest={request} key={index} />;
      })}
    </ul>
  );
};
SearchResults.propTypes = {
  poaRequests: PropTypes.arrayOf(PropTypes.shape({})),
  /* eslint-disable camelcase */
  searchData: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    dob: PropTypes.string,
    ssn: PropTypes.string,
  }),
  /* eslint-able camelcase */
};

const POARequestIndividualSearchPage = () => {
  const [poaRequests, setPoaRequests] = useState([]);
  const [searchData, setSearchData] = useState(false);
  const [resetFormKey, setResetFormKey] = useState(0);
  const [validationPerformed, setValidationPerformed] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const searchStatus = useSearchParams()[0].get('status');
  const navigation = useNavigation();

  const allFieldsPresent = () =>
    searchData.first_name &&
    searchData.last_name &&
    searchData.dob &&
    searchData.ssn?.length === 9;

  const handleSubmit = e => {
    e.preventDefault();
    setValidationPerformed(true);
    if (allFieldsPresent()) {
      api
        .claimantSearch({ ...searchData })
        .then(response => {
          return response.json();
        })
        .then(function(data) {
          setSearchPerformed(true);
          setPoaRequests(data);
        });
    }
  };

  const searchStatusText = () =>
    validationPerformed && !allFieldsPresent()
      ? 'Complete the required search fields and try the search again.'
      : 'This search returns power of attorney information about the individual, if you or your organization received a power of attorney request from the individual in the past 60 days.';

  const handleReset = e => {
    e.preventDefault();
    setSearchData({});
    setSearchPerformed(false);
    setValidationPerformed(false);
    // SsnField does not work properly as a controlled element,
    // so changing the key forces React to re-render it
    setResetFormKey(resetFormKey + 1);
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

  return (
    <section className="poa-request">
      <h1
        data-testid="poa-requests-heading"
        className="poa-request__search-header"
      >
        Search people
      </h1>
      <form
        role="search"
        method="post"
        id="poa-request__search-form"
        action=""
        onSubmit={handleSubmit}
      >
        <VaTextInput
          label="First name"
          width="2xl"
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
          width="2xl"
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
          uiOptions={{ width: '2xl' }}
          error={
            validationPerformed && (searchData.ssn || '').length < 9
              ? 'Enter a Social Security number'
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
      {searchPerformed ? (
        <div className="poa-requests-page-table-container">
          <h2
            data-testid="poa-search-results"
            className="poa-request__search-header"
          >
            Search Results
          </h2>
          {navigation.state === 'loading' ? (
            <VaLoadingIndicator message="Loading..." />
          ) : (
            <div
              className={searchStatus}
              id={`tabpanel-${searchStatus}`}
              role="tabpanel"
              aria-labelledby={`tab-${searchStatus}`}
            >
              <SearchResults
                poaRequests={poaRequests}
                searchData={searchData}
              />
            </div>
          )}
        </div>
      ) : (
        searchStatusText()
      )}
    </section>
  );
};

export default POARequestIndividualSearchPage;
