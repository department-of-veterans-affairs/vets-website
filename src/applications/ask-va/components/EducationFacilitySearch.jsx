import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';

import { VaRadioOption } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { URL, envApiUrl } from '../constants';
import { convertLocation } from '../utils/mapbox';
import EducationSearchItem from './search/EducationSearchItem';
import SearchControls from './search/SearchControls';

const facilities = {
  data: [],
};

export default function EducationFacilitySearch({ onChange }) {
  const school = useSelector(state => state.form?.data?.school);
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
    const url = `${envApiUrl}${URL.GET_SCHOOL}search?name=${getLocation}`;
    await getApiData(url);
    setPageURL(url);
  };

  const getFacilities = async input => {
    const url = `${envApiUrl}${URL.GET_SCHOOL}search?name=${input}`;
    await getApiData(url);
    setPageURL(url);
  };

  const getFacilitiesByCode = async input => {
    const url = `${envApiUrl}${URL.GET_SCHOOL}${input}`;
    await getApiData(url);
    setPageURL(url);
  };

  const checkInput = input => {
    const searchInput = parseInt(input, 10);
    if (Number.isNaN(searchInput)) {
      return getFacilities(input);
    }
    return getFacilitiesByCode(input);
  };

  const showInitialValue = school && !isSearching && !apiData.data?.length;

  return (
    <div className="facility-locator vads-u-margin-top--2">
      <SearchControls
        locateUser={getFacilitiesFromLocation}
        onSubmit={checkInput}
        searchTitle="Search for your school"
        searchHint="You can search by school name, code or location."
      />
      {showInitialValue && <VaRadioOption label={school} checked />}
      {isSearching ? (
        <va-loading-indicator label="Loading" message="Loading..." set-focus />
      ) : (
        <EducationSearchItem
          facilityData={apiData}
          pageURL={pageURL}
          getData={getApiData}
          onChange={onChange}
          dataError={fetchDataError}
          defaultValue={school}
        />
      )}
    </div>
  );
}

EducationFacilitySearch.propTypes = {
  onChange: PropTypes.func,
};
