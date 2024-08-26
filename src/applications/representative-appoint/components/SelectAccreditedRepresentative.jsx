import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VaSearchInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { getRepresentatives as getRepresentativesAction } from '../actions';

const SelectAccreditedRepresentative = ({ getRepresentatives }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const handleInputChange = e => {
    setSearchInput(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setIsLoading(true);
    getRepresentatives(searchInput);
  };

  if (isLoading) {
    return (
      <va-loading-indicator
        message="Loading your secure messages..."
        setFocus
        data-testid="loading-indicator"
      />
    );
  }

  return (
    <>
      <h3>Select the accredited representative or VSO you’d like to appoint</h3>{' '}
      <VaSearchInput
        buttonText="Search"
        label="Enter a keyword, phrase, or question"
        onInput={handleInputChange}
        onSubmit={handleSubmit}
        value={searchInput}
      />
    </>
  );
};

const mapDispatchToProps = {
  getRepresentatives: getRepresentativesAction,
};

SelectAccreditedRepresentative.propTypes = {
  getRepresentatives: PropTypes.func.isRequired,
};

export default connect(
  null,
  mapDispatchToProps,
)(SelectAccreditedRepresentative);
