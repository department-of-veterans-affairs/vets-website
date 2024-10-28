import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  VaButton,
  VaPagination,
  VaSearchInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { formatProgramType } from '../../utils/helpers';

export default function ProgramsList({ match }) {
  const gradPrograms = [
    'CERT ADAPTATIONS-GLOBAL CLIMATE CHG',
    'CERT WEB DEVELOPMENT CERTIFICATE',
    'CERT APPLIED ARCHEOLOGY',
    'CERT ART HISTORY',
    'CERT BUSINESS ANALYTICS FLEX OPTION',
    'CERT BUSINESS FUNDAMENTALS',
    'CERT CAMPAIGNS',
    'CERT CHILD AND FAMILY ADVOCACY',
    'CERT COMMUNITY ENGAGEMENT',
    'CERT CONFLICT ANALYSIS AND RESOLUTION',
    'CERT CREATIVE WRITING',
    'CERT DATA SCIENCE',
    'CERT DESIGN',
    'CERT DIGITAL AND MEDIA LITERACY',
    'CERT DIGITAL DESIGN AND FABRICATION',
    'CERT DIGITAL MEDIA AND PRODUCTION',
    'CERT DIVERSITY AND INCLUSION',
    'CERT ENVIRONMENTAL SUSTAINABILITY',
    'CERT ETHICS',
    'CERT FILM STUDIES',
    'CERT CREATIVE WRITING',
    'CERT DATA SCIENCE',
    'CERT DESIGN',
    'CERT DIGITAL AND MEDIA LITERACY',
    'CERT DIGITAL DESIGN AND FABRICATION',
    'CERT DIGITAL MEDIA AND PRODUCTION',
    'CERT DIVERSITY AND INCLUSION',
    'CERT ENVIRONMENTAL SUSTAINABILITY',
    'CERT ETHICS',
    'CERT FILM STUDIES',
  ];

  const { programType } = match.params;
  const formatedProgramType = formatProgramType(programType);
  const location = useLocation();
  const { name } = location.state;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [searchQuery, setSearchQuery] = useState('');
  const [key, setKey] = useState(0);

  // Filter the programs based on the search query
  const filteredPrograms = gradPrograms.filter(program =>
    program.toLowerCase().includes(searchQuery.toLowerCase()),
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
      <h1 className="vads-u-margin-bottom--4">{name}</h1>
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
        {currentPrograms.map((program, index) => (
          <li className="vads-u-margin-bottom--2" key={index}>
            {program}
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
}
