import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import React, { useState } from 'react';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import SearchControls from '../components/search/SearchControls';
import SearchItem from '../components/search/SearchItem';
import { CHAPTER_3, URL, envUrl } from '../constants';
import { convertToLatLng } from '../utils/mapbox';

const facilities = { data: [] };

// Mock facilities api call locally
// const facilities = healthFacilityMockData;

const YourVAHealthFacilityPage = ({ onChange, goBack, goForward }) => {
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
    }&radius=75&type=health`;
    await getApiData(url);
    setPageURL(url);
  };

  return (
    <>
      <h3>{CHAPTER_3.YOUR_VA_HEALTH_FACILITY.TITLE}</h3>
      <form className="rjsf">
        <p className="vads-u-margin-top--5 vads-u-margin-bottom--2">
          {CHAPTER_3.YOUR_VA_HEALTH_FACILITY.DESCRIPTION}
        </p>
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

        <FormNavButtons goBack={goBack} goForward={goForward} />
      </form>
    </>
  );
};

export default YourVAHealthFacilityPage;
