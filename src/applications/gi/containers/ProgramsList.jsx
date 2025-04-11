import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  VaButton,
  VaPagination,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  formatProgramType,
  mapToAbbreviation,
  getAbbreviationsAsArray,
} from '../utils/helpers';
import { fetchInstitutionPrograms } from '../actions';

const ProgramsList = ({ match }) => {
  const dispatch = useDispatch();
  const { loading, error, institutionPrograms } = useSelector(
    state => state.institutionPrograms,
  );
  const institutionName = localStorage.getItem('institutionName');
  const { programType, facilityCode } = match.params;
  const formattedProgramType = formatProgramType(programType);
  const abbreviatedProgramTypes = mapToAbbreviation(programType);
  const abbreviatedList = getAbbreviationsAsArray(abbreviatedProgramTypes);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [searchError, setSearchError] = useState(null);
  const resultsSummaryRef = useRef(null);
  const noResultsMessageRef = useRef(null);

  const [key, setKey] = useState(0);

  const triggerRerender = () => {
    setKey(prevKey => prevKey + 1);
  };

  const filteredPrograms = institutionPrograms.filter(program =>
    program.attributes.description
      ?.toLowerCase()
      .includes(submittedQuery.toLowerCase()),
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchInstitutionPrograms(facilityCode, abbreviatedProgramTypes));
  }, [dispatch]);

  useEffect(() => {
    if (submittedQuery && !filteredPrograms.length) {
      setTimeout(() => {
        noResultsMessageRef.current?.focus();
      }, 0);
    }
  }, [submittedQuery]);

  const handleSearchInput = e => {
    setSearchQuery(e.target.value);
    setSearchError(null);
  };

  const handleSearchSubmit = e => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchError('Please fill in a program name and then select search.');
      return;
    }
    setSubmittedQuery(searchQuery);
    setCurrentPage(1);
    setTimeout(() => {
      if (resultsSummaryRef.current && filteredPrograms.length > 0) {
        resultsSummaryRef.current.focus();
      }
    }, 0);
  };

  const handleReset = () => {
    setSearchQuery('');
    setSubmittedQuery('');
    setCurrentPage(1);
    triggerRerender();
    setSearchError(null);
    setTimeout(() => {
      const vaTextInputEl = document.getElementById('search-input');
      if (vaTextInputEl) {
        const internalInput = vaTextInputEl.shadowRoot?.querySelector('input');
        internalInput?.focus();
      }
    }, 0);
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
    setTimeout(() => {
      if (resultsSummaryRef.current && filteredPrograms.length > 0) {
        resultsSummaryRef.current.focus();
      }
    }, 0);
  };

  if (error) {
    return (
      <div className="row vads-u-padding--1p5 mobile-lg:vads-u-padding--0">
        <h1 className="vads-u-margin-bottom--4">
          {formattedProgramType} programs
        </h1>
        <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--4">
          {institutionName}
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
    <div className="programs-list-container row vads-u-padding--1p5 mobile-lg:vads-u-padding--0">
      <h1 className="vads-u-margin-bottom--4">
        {formattedProgramType} programs
      </h1>
      <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--4">
        {institutionName}
      </h2>
      <div
        className={`${institutionPrograms.length < 21 &&
          'vads-u-margin-bottom--4'}`}
      >
        <h3
          className="vads-u-font-size--h4 abbreviations"
          data-testid="abbreviations-container"
        >
          Abbreviation(s)
        </h3>
        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
        <ul className="list-style" role="list">
          {abbreviatedList.map(abb => (
            <li className="vads-u-margin-bottom--0" key={abb}>
              {abb}
            </li>
          ))}
        </ul>
      </div>
      {institutionPrograms.length > 20 && (
        <div
          key={key}
          className="search-container va-flex vads-u-align-items--flex-end"
        >
          <VaTextInput
            id="search-input"
            error={searchError}
            className="search-input"
            label="Search for a program name:"
            message-aria-describedby="Search for a program name"
            name="search-input"
            onInput={handleSearchInput}
            onKeyDown={e => e.key === 'Enter' && handleSearchSubmit(e)}
            show-input-error
          />
          <VaButton
            className="search-btn"
            onClick={handleSearchSubmit}
            text="Search"
          />
          <VaButton
            className="reset-search"
            onClick={handleReset}
            secondary
            text="Reset search"
          />
        </div>
      )}
      {filteredPrograms.length > 0 ? (
        <p ref={resultsSummaryRef} tabIndex="-1" id="results-summary">
          {submittedQuery ? (
            <>
              {`Showing ${startIndex} - ${endIndex} of ${filteredPrograms.length} results for `}
              "<strong>{submittedQuery}</strong>"
            </>
          ) : (
            <>
              {`Showing ${startIndex} - ${endIndex} of ${
                filteredPrograms.length
              } ${filteredPrograms.length === 1 ? 'program' : 'programs'}`}
            </>
          )}
        </p>
      ) : (
        <p id="no-results-message" ref={noResultsMessageRef} tabIndex="-1">
          {`We didn’t find any results for `}"
          <strong>{`${submittedQuery}`}</strong>
          ." Please enter a valid program name.
        </p>
      )}
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ul className="remove-bullets" role="list">
        {currentPrograms.map(program => (
          <li
            className="vads-u-margin-bottom--2"
            data-testid="program-list-item"
            key={program.id}
          >
            {program.attributes.programType === 'OJT'
              ? `${program.attributes.ojtAppType} ${program.attributes.description}`
              : program.attributes.description}
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
