import React from 'react';
import PropTypes from 'prop-types';
import { startCase } from 'lodash';

const CondensedSearchForm = props => {
  const { searchIn } = props.query;

  return (
    <div className="condensed-search-form">
      {searchIn && (
        <div className="search-in-description">
          You searched the "{startCase(searchIn)}" folder
        </div>
      )}

      <va-search-input
        onInput={function noRefCheck() {}}
        onSubmit={function noRefCheck() {}}
        value=""
      />

      <button
        type="button"
        className="link-button condensed-advanced-search-button"
      >
        Advanced search
      </button>
    </div>
  );
};

CondensedSearchForm.propTypes = {
  query: PropTypes.object,
};

export default CondensedSearchForm;
