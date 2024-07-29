import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaButton,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { fetchMapBoxBBoxCoordinates } from '../../actions/fetchMapBoxBBoxCoordinates';
import { fetchFacilities } from '../../actions/fetchFacilities';
import FacilityList from './FacilityList';
import content from '../../locales/en/content.json';

const FacilitySearch = props => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [facilities, setFacilities] = useState([]);

  const listProps = useMemo(() => ({ ...props, facilities, query }), [
    facilities,
    props,
    query,
  ]);

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
    setFacilities(null);

    try {
      const coordinates = await fetchMapBoxBBoxCoordinates(query);
      const facilityList = await fetchFacilities(coordinates);
      setFacilities(facilityList);
    } catch (err) {
      setError(err.errorMessage);
    } finally {
      setLoading(false);
    }
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
      return <FacilityList {...listProps} />;
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
