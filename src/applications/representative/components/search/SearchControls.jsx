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
          <div className="usa-width-two-thirds">
            <RepTypeSelector />
            <div style={{ marginBottom: '2em' }}>
              <LocationInput {...props} />
            </div>
            <va-alert
              background-only
              class="vads-u-margin-bottom--1"
              close-btn-aria-label="Close notification"
              disable-analytics="false"
              full-width="false"
              status="warning"
              visible="true"
            >
              <div>
                <p className="vads-u-margin-y--0 vads-u-margin-bottom--2">
                  Keep in mind, appointing a new representative will replace
                  your current representative.
                </p>
              </div>
            </va-alert>
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
  onSubmit: PropTypes.func.isRequired,
};

export default SearchControls;
