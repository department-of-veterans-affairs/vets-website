import React from 'react';
import PropTypes from 'prop-types';
import RepTypeSelector from './RepTypeSelector';
import LocationInput from './LocationInput';

const SearchControls = props => {
  const { onSubmit } = props;

  return (
    <>
      <div className="search-controls-container clearfix">
        <form id="representative-search-controls" onSubmit={e => onSubmit(e)}>
          <div className="columns">
            <div id="search-controls-bottom-row">
              <RepTypeSelector />
            </div>
            <LocationInput {...props} />
            <button id="representative-search" type="submit" value="Search">
              <i className="fas fa-search" /> Search
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

LocationInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default SearchControls;
