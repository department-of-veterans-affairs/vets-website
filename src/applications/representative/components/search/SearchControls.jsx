import React from 'react';
import PropTypes from 'prop-types';
import RepTypeSelector from './RepTypeSelector';
import LocationInput from './LocationInput';

const SearchControls = ({ handleSearch }) => {
  return (
    <>
      <div className="search-controls-container">
        <form id="facility-search-controls" onSubmit={e => handleSearch(e)}>
          <div className="columns">
            <LocationInput />
            <div id="search-controls-bottom-row">
              <RepTypeSelector />
              <input id="facility-search" type="submit" value="Search" />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

SearchControls.propTypes = {
  handleSearch: PropTypes.func.isRequired,
};

export default SearchControls;
