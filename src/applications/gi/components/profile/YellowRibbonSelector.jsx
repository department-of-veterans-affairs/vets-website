import React, { useState, useEffect } from 'react';
import {
  VaSelect,
  VaButton,
  VaPagination,
  VaCard,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { yellowRibbonDegreeLevelTypeHash } from '../../constants';
import { deriveEligibleStudents, deriveMaxAmount } from '../../utils/helpers';

const ProgramCard = ({ program }) => {
  return (
    <VaCard
      background
      key={program.divisionProfessionalSchool}
      className="degree-level-card"
    >
      <div>
        <p className="vads-u-font-weight--bold vads-u-margin-bottom--0">
          College or professional school
        </p>
        <p className="vads-u-margin-top--0">
          {program.divisionProfessionalSchool}
        </p>
      </div>
      <div>
        <p className="vads-u-font-weight--bold vads-u-margin-bottom--0">
          Funding available
        </p>
        <p className="vads-u-margin-top--0">
          <span>{deriveEligibleStudents(program.numberOfStudents)}</span>
        </p>
      </div>
      <div>
        <p className="vads-u-font-weight--bold vads-u-margin-bottom--0">
          Max school contribution
        </p>
        <p className="vads-u-margin-top--0">
          <span>{deriveMaxAmount(program.contributionAmount)}</span>
        </p>
      </div>
    </VaCard>
  );
};

const YellowRibbonSelector = ({ programs }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [activeOption, setActiveOption] = useState('');
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const degreeLevelOrder = [
    'All',
    'Certificate',
    'Associates',
    'Bachelors',
    'Undergraduate',
    'Masters',
    'Doctoral',
    'Graduate',
    'Other',
  ];

  const getDegreeLevels = degreeLevelKey => {
    return yellowRibbonDegreeLevelTypeHash[degreeLevelKey] || [];
  };

  const degreeLevelOptions = [
    ...new Set(
      programs.reduce((acc, program) => {
        const degreeLevels = getDegreeLevels(program.degreeLevel);
        return acc.concat(degreeLevels);
      }, []),
    ),
  ].sort((a, b) => degreeLevelOrder.indexOf(a) - degreeLevelOrder.indexOf(b));

  const filterPrograms = degreeLevel => {
    const filtered = programs.filter(program =>
      getDegreeLevels(program.degreeLevel).includes(degreeLevel),
    );
    setFilteredPrograms(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (degreeLevelOptions.length === 1) {
      const autoSelectOption = degreeLevelOptions[0];
      setSelectedOption(autoSelectOption);
      setActiveOption(autoSelectOption);
      filterPrograms(autoSelectOption);
    }
  }, []);

  const handleSelectionChange = event => {
    setSelectedOption(event.target.value);
  };

  const handleDisplayResults = () => {
    setActiveOption(selectedOption);
    filterPrograms(selectedOption);
  };

  const handlePageChange = page => {
    setCurrentPage(page);
  };

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

  return (
    <div className="yellow-ribbon-selector-container">
      {degreeLevelOptions.length > 1 && (
        <div>
          <p className="vads-u-font-weight--bold vads-u-margin-bottom--0">
            Select a degree level to get started.
          </p>
          <div className="selector-wrapper vads-u-display--flex vads-u-align-items--flex-end ">
            <VaSelect
              className="degree-selector "
              id="degree"
              name="degree"
              label="Degree level"
              value={selectedOption}
              onVaSelect={handleSelectionChange}
              uswds
            >
              {degreeLevelOptions.map(degreeLevel => (
                <option key={degreeLevel} value={degreeLevel}>
                  {degreeLevel}
                </option>
              ))}
            </VaSelect>

            <VaButton
              onClick={handleDisplayResults}
              secondary
              text="Display Results"
              className="degree-selector-btn vads-u-margin-left--2p5"
            />
          </div>
        </div>
      )}

      <div className="vads-u-margin-bottom--0">
        {filteredPrograms.length > 0 && (
          <p
            id="results-summary"
            className="vads-u-margin-top--3 vads-u-margin-bottom--3"
          >
            {activeOption &&
              (() => {
                let activeOptionLabel;
                if (activeOption === 'All' || activeOption === 'Other') {
                  activeOptionLabel = `${activeOption} degree levels`;
                } else if (degreeLevelOptions.length === 1) {
                  activeOptionLabel = `${activeOption} degree level`;
                } else {
                  activeOptionLabel = `"${activeOption}" degree level`;
                }

                return (
                  <>
                    {`Showing ${startIndex}-${endIndex} of ${
                      filteredPrograms.length
                    } results for `}
                    {activeOptionLabel}
                  </>
                );
              })()}
          </p>
        )}
        <div className="degree-level-results vads-u-margin-bottom--1 vads-u-display--flex vads-u-flex-direction--column vads-u-align-items--stretch mobile-lg:vads-u-flex-direction--row">
          {currentPrograms.map(program => (
            <ProgramCard
              key={program.divisionProfessionalSchool}
              program={program}
            />
          ))}
        </div>
        {currentPrograms.length > 0 && (
          <VaPagination
            page={currentPage}
            pages={totalPages}
            maxPageListLength={3}
            showLastPage
            onPageSelect={e => handlePageChange(e.detail.page)}
            className="vads-u-border-top--0 vads-u-padding-y--0 vads-u-margin-bottom--0"
          />
        )}
      </div>
    </div>
  );
};

export default YellowRibbonSelector;
