import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { focusElement } from 'platform/utilities/ui';
import { connect } from 'react-redux';
import SearchControls from '../components/search/SearchControls';
import SearchItem from '../components/search/SearchItem';
import { CHAPTER_3, URL, envUrl } from '../constants';
import { convertToLatLng } from '../utils/mapbox';

const facilities = { data: [] };

const YourVAHealthFacilityPage = props => {
  const { data, setFormData, goBack, goForward, searchQuery } = props;
  const [apiData, setApiData] = useState(facilities);
  const [isSearching, setIsSearching] = useState(false);
  const [pageURL, setPageURL] = useState('');
  const [validationError, setValidationError] = useState({
    searchInputError: false,
    radioError: null,
  });

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const getApiData = url => {
    setIsSearching(true);
    return apiRequest(url, options)
      .then(res => {
        setApiData(res);
        setIsSearching(false);
      })
      .catch(() => {
        setIsSearching(false);
      });
  };

  const getFacilitiesFromLocation = async input => {
    const url = `${envUrl}${URL.GET_HEALTH_FACILITY}?type=health&lat=${
      input[1]
    }&long=${input[0]}&radius=50`;
    await getApiData(url);
    setPageURL(url);
  };

  const getFacilities = async input => {
    const latLong = await convertToLatLng(input);
    const url = `${envUrl}${URL.GET_HEALTH_FACILITY}?lat=${latLong[1]}&long=${
      latLong[0]
    }&radius=50&type=health`;
    await getApiData(url);
    setPageURL(url);
  };

  const updateForm = selection => {
    setFormData({ ...data, yourHealthFacility: selection });
  };

  const checkInput = formData => {
    if (formData.yourHealthFacility) {
      goForward(formData);
    }

    if (searchQuery.length === 0) {
      focusElement('#street-city-state-zip');
      return setValidationError({ ...validationError, searchInputError: true });
    }

    focusElement('va-radio');
    return setValidationError({
      ...validationError,
      radioError: 'Please select a facility',
    });
  };

  return (
    <>
      <h3>{CHAPTER_3.YOUR_VA_HEALTH_FACILITY.TITLE}</h3>
      <form className="rjsf">
        <p className="vads-u-margin-top--3 vads-u-margin-bottom--2">
          {CHAPTER_3.YOUR_VA_HEALTH_FACILITY.DESCRIPTION}
        </p>
        <div className="facility-locator vads-u-margin-top--2">
          <SearchControls
            locateUser={getFacilitiesFromLocation}
            onSubmit={getFacilities}
            searchTitle="City or postal code"
            hasSearchInput={validationError.searchInputError}
          />
          {isSearching ? (
            <va-loading-indicator
              label="Loading"
              message="Loading..."
              set-focus
            />
          ) : (
            <SearchItem
              facilityData={apiData}
              pageURL={pageURL}
              getData={getApiData}
              onChange={updateForm}
              validationError={validationError.radioError}
            />
          )}
        </div>

        <FormNavButtons goBack={goBack} goForward={() => checkInput(data)} />
      </form>
    </>
  );
};

YourVAHealthFacilityPage.propTypes = {
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  onChange: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    searchQuery: state.askVA.searchLocationInput,
  };
}

export default connect(mapStateToProps)(YourVAHealthFacilityPage);
