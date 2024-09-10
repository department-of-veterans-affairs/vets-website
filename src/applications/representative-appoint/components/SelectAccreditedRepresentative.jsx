import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaButton,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { fetchRepresentatives } from '../api/fetchRepresentatives';
import SearchResult from './SearchResult';

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
      return (
        <>
          {representatives.map((rep, index) => {
            const representative = rep.data;
            return (
              <SearchResult
                representativeName={
                  representative.attributes.fullName ||
                  representative.attributes.name
                }
                key={index}
                type={representative.type}
                addressLine1={representative.attributes.addressLine1}
                addressLine2={representative.attributes.addressLine2}
                addressLine3={representative.attributes.addressLine3}
                city={representative.attributes.city}
                stateCode={representative.attributes.stateCode}
                zipCode={representative.attributes.zipCode}
                phone={representative.attributes.phone}
                email={representative.attributes.email}
                representativeId={representative.id}
              />
            );
          })}
        </>
      );
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
