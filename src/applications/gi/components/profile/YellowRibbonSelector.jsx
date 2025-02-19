import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
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

ProgramCard.propTypes = {
  program: PropTypes.shape({
    divisionProfessionalSchool: PropTypes.string,
    numberOfStudents: PropTypes.number,
    contributionAmount: PropTypes.string,
    degreeLevel: PropTypes.string,
  }).isRequired,
};

const YellowRibbonSelector = ({ programs }) => {
  programs.map(program => ({
    degreeLevel: program.degreeLevel,
    divisionProfessionalSchool: program.divisionProfessionalSchool,
    numberOfStudents: program.numberOfStudents,
    contributionAmount: program.contributionAmount,
  }));

  const resultsSummaryRef = useRef(null);
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
    const lowerCaseKey = degreeLevelKey.toLowerCase();
    return yellowRibbonDegreeLevelTypeHash[lowerCaseKey] || [];
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
    setTimeout(() => {
      if (resultsSummaryRef.current) {
        resultsSummaryRef.current.focus();
      }
    }, 0);
  };

  const handlePageChange = page => {
    setCurrentPage(page);
    setTimeout(() => {
      if (resultsSummaryRef.current) {
        resultsSummaryRef.current.focus();
      }
    }, 0);
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

  const resultText = filteredPrograms.length === 1 ? 'result' : 'results';
  const resultDegreeLevel =
    degreeLevelOptions.length === 1
      ? `${activeOption} degree levels`
      : `"${activeOption}" degree levels`;

  const renderResultsSummary = () => {
    let activeOptionLabel = '';
    if (activeOption === 'All' || activeOption === 'Other') {
      activeOptionLabel = resultDegreeLevel;
    } else if (degreeLevelOptions.length === 1) {
      activeOptionLabel = `${activeOption} degree level`;
    } else {
      activeOptionLabel = `"${activeOption}" degree level`;
    }
    return (
      <p
        id="results-summary"
        data-testid="results-summary"
        ref={resultsSummaryRef}
        tabIndex="-1"
        className="vads-u-margin-top--3 vads-u-margin-bottom--3"
      >
        {`Showing ${startIndex}-${endIndex} of ${
          filteredPrograms.length
        } ${resultText} for ${activeOptionLabel}`}
      </p>
    );
  };

  return (
    <div className="yellow-ribbon-selector-container">
      {degreeLevelOptions.length > 1 && (
        <div>
          <p className="vads-u-margin-bottom--0">
            To see participating schools select a degree.
          </p>
          <div className="selector-wrapper vads-u-display--flex vads-u-align-items--flex-end vads-u-margin-top--0">
            <VaSelect
              className="degree-selector"
              id="degree"
              name="degree"
              data-testid="degree-selector"
              message-aria-describedby="Degree level selector"
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
        {filteredPrograms.length > 0 && activeOption && renderResultsSummary()}
        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
        <ul
          role="list"
          className="degree-level-results vads-u-margin-bottom--1"
        >
          {currentPrograms.map((program, index) => (
            <li
              className="degree-item"
              key={`${program.divisionProfessionalSchool}-${index}`}
            >
              <ProgramCard program={program} />
            </li>
          ))}
        </ul>
        {currentPrograms.length > 0 && (
          <VaPagination
            page={currentPage}
            pages={totalPages}
            maxPageListLength={3}
            showLastPage
            onPageSelect={e => handlePageChange(e.detail.page)}
            className="vads-u-border-top--0 vads-u-padding-y--0 vads-u-margin-bottom--0"
            data-testid="yellow-ribbon-pagination"
          />
        )}
        {currentPrograms.length > 0 && (
          <va-additional-info
            trigger="Yellow Ribbon Program definitions"
            class="vads-u-margin-top--2 hydrated"
            uswds
          >
            <ul className="getting-started-with-benefits-li">
              <li>
                <strong>Degree level:</strong> Type of degree such as
                Undergraduate, Graduate, Masters, or Doctoral
              </li>
              <li>
                <strong>College or professional school:</strong> A school within
                a college or university that has a specialized professional or
                academic focus
              </li>
              <li>
                <strong>Funding available:</strong> Total number of students
                eligible to receive funding
              </li>
              <li>
                <strong>Max school contribution:</strong> Maximum amount the IHL
                will contribute per student each academic year toward unmet
                tuition and fee costs
              </li>
            </ul>
          </va-additional-info>
        )}
      </div>
    </div>
  );
};

YellowRibbonSelector.propTypes = {
  programs: PropTypes.arrayOf(
    PropTypes.shape({
      divisionProfessionalSchool: PropTypes.string,
      numberOfStudents: PropTypes.number,
      contributionAmount: PropTypes.string,
      degreeLevel: PropTypes.string,
    }),
  ).isRequired,
};

export default YellowRibbonSelector;
