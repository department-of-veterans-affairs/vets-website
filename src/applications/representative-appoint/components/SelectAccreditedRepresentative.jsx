import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaButton,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { fetchRepresentatives } from '../api/fetchRepresentatives';
// import RepresentativeList from './RepresentativeList';

const SelectAccreditedRepresentative = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [representatives, setRepresentatives] = useState([]);

  // const listProps = useMemo(() => ({ ...props, representatives, query }), [
  //   representatives,
  //   props,
  //   query,
  // ]);

  const handleChange = e => {
    setQuery(e.target.value);
  };

  const handleClick = async () => {
    if (!query.trim()) {
      setError('Search for a representative');
      return;
    }

    setLoading(true);
    setError(null);
    setRepresentatives(null);

    try {
      const representativeResults = await fetchRepresentatives({ query });
      setRepresentatives(representativeResults);
    } catch (err) {
      setError(err.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const searchResults = () => {
    if (loading) {
      return <va-loading-indicator message="Loading..." set-focus />;
    }
    if (representatives?.length) {
      // result cards will go here
      return <>{JSON.stringify(representatives)}</>;
    }
    return null;
  };

  return (
    <>
      <va-card role="search">
        <label
          htmlFor="representative-search"
          id="representative-search-label"
          className="vads-u-margin-top--0 vads-u-margin-bottom--1p5"
        >
          <VaTextInput
            id="representative_search"
            name="representative_search"
            error={error}
            onInput={handleChange}
            required
          />
          <VaButton
            data-testid="representative-search-btn"
            text="Search"
            onClick={handleClick}
          />
        </label>
      </va-card>

      {searchResults()}
    </>
  );
};

SelectAccreditedRepresentative.propTypes = {
  fetchRepresentatives: PropTypes.func,
};

export default SelectAccreditedRepresentative;
