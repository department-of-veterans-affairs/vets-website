import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { focusElement } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import SearchControls from '../components/search/SearchControls';
import SearchItem from '../components/search/SearchItem';
import { getHealthFacilityTitle } from '../config/helpers';
import { CHAPTER_3, URL, envUrl, getMockTestingFlagforAPI } from '../constants';
import { convertToLatLng } from '../utils/mapbox';
import { mockHealthFacilityResponse } from '../utils/mockData';

const facilities = { data: [] };

const YourVAHealthFacilityPage = props => {
  const {
    data,
    setFormData,
    goBack,
    goForward,
    searchQuery,
    currentPath,
    facilityName,
  } = props;
  const [apiData, setApiData] = useState(facilities);
  const [isSearching, setIsSearching] = useState(false);
  const [pageURL, setPageURL] = useState('');
  const [previousSelection, setPreviousSelection] = useState(null);
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

    if (getMockTestingFlagforAPI()) {
      // Simulate API delay
      return new Promise(resolve => {
        setTimeout(() => {
          setApiData(mockHealthFacilityResponse);
          setIsSearching(false);
          resolve(mockHealthFacilityResponse);
        }, 500);
      });
    }

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
    setIsSearching(true);
    const latLong = await convertToLatLng(input);

    if (!latLong.length) {
      setIsSearching(false);
      setPageURL('/error');
      setApiData(facilities);
    } else {
      const url = `${envUrl}${URL.GET_HEALTH_FACILITY}?lat=${latLong[1]}&long=${
        latLong[0]
      }&radius=50&type=health`;
      await getApiData(url);
      setPageURL(url);
    }
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

  useEffect(
    () => {
      if (pageURL === '' && data.yourHealthFacility) {
        setPreviousSelection(facilityName);
      } else {
        setPreviousSelection(null);
        setFormData({ ...data, yourHealthFacility: null });
      }
    },
    [pageURL],
  );

  return (
    <>
      <h3>{getHealthFacilityTitle(data)}</h3>
      <div className="rjsf">
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
          {previousSelection && (
            <div className="vads-u-margin-top--3">
              <p className="vads-u-margin-bottom--0p5">Your selection:</p>
              <p className="vads-u-margin-top--0p5">
                <strong>{previousSelection}</strong>
              </p>
              <hr />
            </div>
          )}
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

        {currentPath !== '/review-then-submit' && (
          <FormNavButtons goBack={goBack} goForward={() => checkInput(data)} />
        )}
      </div>
    </>
  );
};

YourVAHealthFacilityPage.propTypes = {
  currentPath: PropTypes.string,
  data: PropTypes.object,
  facilityName: PropTypes.string,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  searchQuery: PropTypes.string,
  setFormData: PropTypes.func,
  onChange: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    searchQuery: state.askVA.searchLocationInput,
    facilityName: state.askVA.vaHealthFacility,
    currentPath: state.navigation.route.path,
  };
}

export default connect(mapStateToProps)(YourVAHealthFacilityPage);
