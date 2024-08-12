import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import React, { useState } from 'react';
import { URL, envUrl } from '../constants';
import { convertToLatLng } from '../utils/mapbox';
import SearchControls from './search/SearchControls';
import SearchItem from './search/SearchItem';

const facilities = { data: [] };

const MedicalFacilitySearch = ({ onChange }) => {
  const [apiData, setApiData] = useState(facilities);
  const [isSearching, setIsSearching] = useState(false);
  const [pageURL, setPageURL] = useState('');

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
    }&long=${input[0]}`;
    await getApiData(url);
    setPageURL(url);
  };

  const getFacilities = async input => {
    const latLong = await convertToLatLng(input);
    const url = `${envUrl}${URL.GET_HEALTH_FACILITY}?lat=${latLong[1]}&long=${
      latLong[0]
    }`;
    await getApiData(url);
    setPageURL(url);
  };

  return (
    <>
      <div className="facility-locator vads-u-margin-top--2">
        <SearchControls
          locateUser={getFacilitiesFromLocation}
          onSubmit={getFacilities}
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
            onChange={onChange}
          />
        )}
      </div>
    </>
  );
};

export default MedicalFacilitySearch;
