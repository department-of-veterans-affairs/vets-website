import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  VaButton,
  VaPagination,
  VaSearchInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { formatProgramType } from '../../utils/helpers';
import { fetchInstitutionPrograms } from '../../actions';

const ProgramsList = ({ match }) => {
  const dispatch = useDispatch();
  const { institutionPrograms, loading } = useSelector(
    state => state.institutionPrograms,
  );
  const { programType } = match.params;
  const { facilityCode } = match.params;

  const formatedProgramType = formatProgramType(programType);
  const institutionName = institutionPrograms[0]?.attributes?.institutionName;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [searchQuery, setSearchQuery] = useState('');
  const [key, setKey] = useState(0);

  const filteredPrograms = institutionPrograms.filter(program =>
    program.attributes.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
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
    setCurrentPage(1);
  };

  const triggerRerender = () => {
    setKey(prevKey => prevKey + 1); // Changing the key forces a re-render
  };
  const handleSearchSubmit = e => {
    e.preventDefault();
  };
  const handleReset = () => {
    setSearchQuery('');
    setCurrentPage(1);
    triggerRerender();
  };

  // Calculate total pages and slice programs for pagination
  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);
  const currentPrograms = filteredPrograms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  return (
    <div className="row vads-u-padding--1p5 mobile-lg:vads-u-padding--0">
      {loading && (
        <div>
          <va-loading-indicator
            label="Loading"
            message="Loading your programs..."
          />
        </div>
      )}
      {!loading && (
        <>
          <h1 className="vads-u-margin-bottom--4">{institutionName}</h1>
          <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--4">
            {formatedProgramType}
          </h2>
          <p className="vads-u-margin-bottom--1">Search for a program name:</p>
          <div key={key} className="va-flex">
            <VaSearchInput
              className="usa-width-three-fourths"
              buttonText="Search"
              label="Search Programs"
              onInput={handleSearchInput}
              onSubmit={handleSearchSubmit}
              value={searchQuery}
              type="text"
            />
            <VaButton onClick={handleReset} secondary text="Reset" />
          </div>
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
        </>
      )}
    </div>
  );
};

export default ProgramsList;
