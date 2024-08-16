import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaButton,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { fetchMapBoxGeocoding } from '../../actions/fetchMapBoxGeocoding';
import { fetchFacilities } from '../../actions/fetchFacilities';
import FacilityList from './FacilityList';
import content from '../../locales/en/content.json';

const FacilitySearch = props => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [facilities, setFacilities] = useState([]);

  const facilityListProps = useMemo(
    () => {
      const { onChange, ...restOfProps } = props;
      const setSelectedFacilities = facilityId => {
        const facility = facilities.find(f => f.id === facilityId);
        onChange({ veteranSelected: facility });
      };
      return {
        ...restOfProps,
        value: restOfProps?.formData?.veteranSelected?.id,
        onChange: setSelectedFacilities,
        facilities,
        query,
      };
    },
    [facilities, props, query],
  );

  const handleChange = e => {
    setQuery(e.target.value);
  };

  const handleClick = async () => {
    if (!query.trim()) {
      setError(content['validation-facilities--search-required']);
      return;
    }

    setLoading(true);
    setError(null);
    setFacilities([]);

    const mapboxResponse = await fetchMapBoxGeocoding(query);
    if (mapboxResponse.errorMessage) {
      setError(mapboxResponse.errorMessage);
      setLoading(false);
      return;
    }

    const facilitiesResponse = await fetchFacilities(mapboxResponse.center);
    if (facilitiesResponse.errorMessage) {
      setError(facilitiesResponse.errorMessage);
      setLoading(false);
      return;
    }

    setFacilities(facilitiesResponse);
    setLoading(false);
  };

  const searchResults = () => {
    if (loading) {
      return (
        <va-loading-indicator
          label={content['app-loading-generic-text']}
          message={content['facilities-loading-text']}
          set-focus
        />
      );
    }
    if (facilities?.length) {
      return <FacilityList {...facilityListProps} />;
    }
    return null;
  };

  return (
    <>
      <va-card role="search">
        <label
          htmlFor="facility-search"
          id="facility-search-label"
          className="vads-u-margin-top--0 vads-u-margin-bottom--1p5"
        >
          {content['form-facilities-search-label']}
          <VaTextInput
            id="root_caregivers_facility_search"
            name="root_caregivers_facility_search"
            hint={content['form-facilities-search-hint']}
            error={error}
            onInput={handleChange}
            required
          />
          <VaButton
            data-testid="caregivers-search-btn"
            text={content['button-search']}
            onClick={handleClick}
          />
        </label>
      </va-card>

      {searchResults()}
    </>
  );
};

FacilitySearch.propTypes = {
  value: PropTypes.string,
};

export default FacilitySearch;
