import React, { useState } from 'react';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { URL } from '../constants';
import SearchItem from './search/SearchItem';
import { convertToLatLng } from '../utils/mapbox';
import SearchControls from './search/SearchControls';

const facilities = {
  data: [],
};

const MedicalFacilitySearch = ({ onChange }) => {
  const [apiData, setApiData] = useState(facilities);
  const [isSearching, setIsSearching] = useState(false);
  const [pageURL, setPageURL] = useState('');

  const getApiData = url => {
    setIsSearching(true);
    return apiRequest(url)
      .then(res => {
        setApiData(res);
        setIsSearching(false);
      })
      .catch(() => {
        setIsSearching(false);
      });
  };

  const getFacilitiesFromLocation = async input => {
    const url = `${environment.API_URL}${
      URL.GET_HEALTH_FACILITY
    }?type=health&lat=${input[1]}&long=${input[0]}`;
    await getApiData(url);
    setPageURL(url);
  };

  const getFacilities = async input => {
    const latLong = await convertToLatLng(input);
    const url = `${environment.API_URL}${
      URL.GET_HEALTH_FACILITY
    }?type=health&lat=${latLong[1]}&long=${latLong[0]}`;
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
