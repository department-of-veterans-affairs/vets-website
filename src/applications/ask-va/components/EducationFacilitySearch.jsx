import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { URL, envUrl } from '../constants';
import { convertLocation } from '../utils/mapbox';
import EducationSearchItem from './search/EducationSearchItem';
import SearchControls from './search/SearchControls';

const facilities = {
  data: [],
};

const EducationFacilitySearch = ({ onChange }) => {
  const [apiData, setApiData] = useState(facilities);
  const [isSearching, setIsSearching] = useState(false);
  const [pageURL, setPageURL] = useState('');
  const [fetchDataError, setFetchDataError] = useState({ hasError: false });

  const getApiData = url => {
    const searchURL = url.split('?');
    const isCodeSearch = searchURL.length === 1;
    setIsSearching(true);
    return apiRequest(url)
      .then(res => {
        if (!Array.isArray(res.data)) res.data = [res.data];
        setApiData(res);
        setIsSearching(false);
        if (res.data.length === 0) {
          setFetchDataError({
            hasError: true,
            errorMessage: isCodeSearch
              ? 'Check the school code you entered and try searching again'
              : "Check the spelling of the school's name or city you entered",
          });
        } else {
          setFetchDataError({ hasError: false, errorMessage: '' });
        }
      })
      .catch(() => {
        setIsSearching(false);
        setFetchDataError({
          hasError: true,
          errorMessage: isCodeSearch
            ? 'Check the school code you entered and try searching again'
            : "Check the spelling of the school's name or city you entered",
        });
      });
  };

  const getFacilitiesFromLocation = async input => {
    const place = await convertLocation(input);
    const getLocation = place.zipCode[0].text;
    const url = `${envUrl}${URL.GET_SCHOOL}search?name=${getLocation}`;
    await getApiData(url);
    setPageURL(url);
  };

  const getFacilities = async input => {
    const url = `${envUrl}${URL.GET_SCHOOL}search?name=${input}`;
    await getApiData(url);
    setPageURL(url);
  };

  const getFacilitiesByCode = async input => {
    const url = `${envUrl}${URL.GET_SCHOOL}${input}`;
    await getApiData(url);
    setPageURL(url);
  };

  const checkInput = input => {
    const searchInput = parseInt(input, 10);
    if (isNaN(searchInput)) {
      return getFacilities(input);
    }
    return getFacilitiesByCode(input);
  };

  return (
    <>
      <div className="facility-locator vads-u-margin-top--2">
        <SearchControls
          locateUser={getFacilitiesFromLocation}
          onSubmit={checkInput}
          searchTitle="Search for your school"
          searchHint="You can search by school name, code or location."
        />
        {isSearching ? (
          <va-loading-indicator
            label="Loading"
            message="Loading..."
            set-focus
          />
        ) : (
          <EducationSearchItem
            facilityData={apiData}
            pageURL={pageURL}
            getData={getApiData}
            onChange={onChange}
            dataError={fetchDataError}
          />
        )}
      </div>
    </>
  );
};

function mapStateToProps(state) {
  return {
    usersLocation: state.askVA.searchLocationInput,
  };
}

export default connect(mapStateToProps)(EducationFacilitySearch);
