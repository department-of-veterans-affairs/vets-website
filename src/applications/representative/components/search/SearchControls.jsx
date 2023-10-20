import React from 'react';
import PropTypes from 'prop-types';
import RepTypeSelector from './RepTypeSelector';
import LocationInput from './LocationInput';

const SearchControls = ({ handleSearch }) => {
  return (
    <>
      <div className="search-controls-container clearfix">
        <form
          id="representative-search-controls"
          onSubmit={e => handleSearch(e)}
        >
          <div className="columns">
            <div id="search-controls-bottom-row">
              <RepTypeSelector />
            </div>
            <LocationInput />
            <button id="representative-search" type="submit" value="Search">
              <i className="fas fa-search" /> Search
            </button>
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
