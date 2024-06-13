import React, { useState } from 'react';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { connect } from 'react-redux';
import { URL, envUrl } from '../constants';
import EducationSearchItem from './search/EducationSearchItem';
import { convertLocation } from '../utils/mapbox';
import SearchControls from './search/SearchControls';

const facilities = {
  data: [],
};

const EducationFacilitySearch = ({ onChange }) => {
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
    const place = await convertLocation(input);
    const getLocation = place.zipCode[0].text;
    const url = `${envUrl}${URL.GET_SCHOOL}${getLocation}`;
    await getApiData(url);
    setPageURL(url);
  };

  const getFacilities = async input => {
    const url = `${envUrl}${URL.GET_SCHOOL}${input}`;
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
          <EducationSearchItem
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

function mapStateToProps(state) {
  return {
    usersLocation: state.askVA.searchLocationInput,
  };
}

export default connect(mapStateToProps)(EducationFacilitySearch);
