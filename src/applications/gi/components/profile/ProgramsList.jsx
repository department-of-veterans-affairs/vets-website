import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  VaButton,
  VaPagination,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { formatProgramType } from '../../utils/helpers';
import { fetchInstitutionPrograms } from '../../actions';

const ProgramsList = ({ match }) => {
  const dispatch = useDispatch();
  const { institutionPrograms, loading, error } = useSelector(
    state => state.institutionPrograms,
  );
  const location = useLocation();
  const { institutionName } = location.state;

  const { programType } = match.params;
  const { facilityCode } = match.params;

  const formattedProgramType = formatProgramType(programType);
  // const institutionName = institutionPrograms[0]?.attributes?.institutionName;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [key, setKey] = useState(0);

  const [searchError, setSearchError] = useState(null);

  const filteredPrograms = institutionPrograms.filter(program =>
    program.attributes.description
      .toLowerCase()
      .includes(submittedQuery.toLowerCase()),
  );

  useEffect(
    () => {
      window.scrollTo(0, 0);
      if (facilityCode) {
        // TODO- NEED TO PASS PROGRAM TYPE, Add helper function to convert program type
        // IHL
        // NCD
        // OJT
        // FLGT
        // CORR
        dispatch(fetchInstitutionPrograms('3V000242', 'NCD'));
      }
    },
    [dispatch, facilityCode],
  );

  const handleSearchInput = e => {
    setSearchQuery(e.target.value);
    setSearchError(null);
  };

  const triggerRerender = () => {
    setKey(prevKey => prevKey + 1); // Changing the key forces a re-render
  };

  const handleSearchSubmit = e => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchError('Please fill in a program name and then select search.');
      return;
    }
    setSubmittedQuery(searchQuery);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery('');
    setSubmittedQuery('');
    setCurrentPage(1);
    triggerRerender();
    setSearchError(null);
  };

  // Calculate total pages and slice programs for pagination
  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);
  const currentPrograms = filteredPrograms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Calculate start and end indices for the displayed programs
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(
    currentPage * itemsPerPage,
    filteredPrograms.length,
  );

  const handlePageChange = page => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (error) {
    return (
      <div className="row vads-u-padding--1p5 mobile-lg:vads-u-padding--0">
        <h1 className="vads-u-margin-bottom--4">{institutionName}</h1>
        <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--4">
          {formattedProgramType}
        </h2>
        <va-alert status="error" data-e2e-id="alert-box">
          <h2 slot="headline">We can’t load the program list right now</h2>
          <p>
            We’re sorry. There’s a problem with our system. Try again later.
          </p>
        </va-alert>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="row vads-u-padding--1p5 mobile-lg:vads-u-padding--0">
        <va-loading-indicator
          label="Loading"
          message="Loading your programs..."
        />
      </div>
    );
  }

  return (
    <div className="row vads-u-padding--1p5 mobile-lg:vads-u-padding--0">
      <h1 className="vads-u-margin-bottom--4">{institutionName}</h1>
      <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--4">
        {formattedProgramType}
      </h2>
      <div
        key={key}
        className="search-container va-flex vads-u-align-items--flex-end"
      >
        <VaTextInput
          error={searchError}
          hint={null}
          label="Search for a program name:"
          message-aria-describedby="Search for a program name"
          name="search-input"
          onInput={handleSearchInput}
          onKeyDown={e => e.key === 'Enter' && handleSearchSubmit(e)}
          show-input-error
        />
        <VaButton onClick={handleSearchSubmit} text="Search" />
        {submittedQuery && (
          <VaButton
            onClick={handleReset}
            secondary
            text="Back to program list"
          />
        )}
      </div>
      {filteredPrograms.length > 0 ? (
        <p id="results-summary">
          {submittedQuery ? (
            <>
              {`Showing ${startIndex}-${endIndex} of ${
                filteredPrograms.length
              } results for `}
              "<strong>{submittedQuery}</strong>"
            </>
          ) : (
            <>
              {`Showing ${startIndex}-${endIndex} of ${
                filteredPrograms.length
              } programs`}
            </>
          )}
        </p>
      ) : (
        <p id="no-results-message">
          {`We didn’t find any results for `}"
          <strong>{`${submittedQuery}`}</strong>" . Please enter a valid program
          name.
        </p>
      )}
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ul className="remove-bullets" role="list">
        {currentPrograms.map(program => (
          <li className="vads-u-margin-bottom--2" key={program.id}>
            {program.attributes.description}
          </li>
        ))}
      </ul>
      <VaPagination
        page={currentPage}
        pages={totalPages}
        maxPageListLength={7}
        showLastPage
        onPageSelect={e => handlePageChange(e.detail.page)}
        className="vads-u-border-top--0 vads-u-padding-top--0 vads-u-padding-bottom--5"
      />
    </div>
  );
};

ProgramsList.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      programType: PropTypes.string.isRequired,
      facilityCode: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ProgramsList;
