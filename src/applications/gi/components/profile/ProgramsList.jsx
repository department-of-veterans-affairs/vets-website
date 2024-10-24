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
    'Master of Business Administration (MBA)',
    'Master of Public Administration (MPA)',
    'Master of Fine Arts (MFA)',
    'Master of Science in Computer Science',
    'Master of Science in Data Science',
    'Master of Science in Artificial Intelligence',
    'Master of Science in Information Technology',
    'Master of Science in Cybersecurity',
    'Master of Science in Software Engineering',
    'Master of Science in Data Analytics',
    'Master of Science in Electrical Engineering',
    'Master of Science in Mechanical Engineering',
    'Master of Science in Civil Engineering',
    'Master of Science in Chemical Engineering',
    'Master of Science in Biomedical Engineering',
    'Master of Science in Aerospace Engineering',
    'Master of Science in Environmental Engineering',
    'Master of Science in Engineering Management',
    'Master of Science in Industrial Engineering',
    'Master of Science in Systems Engineering',
    'Master of Science in Robotics',
    'Master of Science in Physics',
    'Master of Science in Chemistry',
    'Master of Science in Biology',
    'Master of Science in Molecular Biology',
    'Master of Science in Biotechnology',
    'Master of Science in Microbiology',
    'Master of Science in Marine Biology',
    'Master of Science in Ecology',
    'Master of Science in Environmental Science',
    'Master of Science in Geology',
    'Master of Science in Geography',
    'Master of Science in Meteorology',
    'Master of Science in Astronomy',
    'Master of Science in Astrophysics',
    'Master of Science in Mathematics',
    'Master of Science in Statistics',
    'Master of Science in Actuarial Science',
    'Master of Science in Economics',
    'Master of Science in Finance',
    'Master of Science in Accounting',
    'Master of Science in Marketing',
    'Master of Science in Supply Chain Management',
    'Master of Science in Operations Research',
    'Master of Science in Management',
    'Master of Science in Organizational Leadership',
    'Master of Science in Human Resources',
    'Master of Science in Education',
    'Master of Science in Special Education',
    'Master of Science in Curriculum and Instruction',
    'Master of Science in Educational Leadership',
    'Master of Science in Higher Education',
    'Master of Science in School Counseling',
    'Master of Science in Clinical Psychology',
    'Master of Science in Counseling Psychology',
    'Master of Science in Industrial-Organizational Psychology',
    'Master of Science in Applied Psychology',
    'Master of Social Work (MSW)',
    'Master of Public Health (MPH)',
    'Master of Healthcare Administration (MHA)',
    'Master of Science in Nursing (MSN)',
    'Master of Science in Occupational Therapy',
    'Master of Science in Physical Therapy',
    'Master of Science in Speech-Language Pathology',
    'Master of Science in Nutrition',
    'Master of Science in Public Policy',
    'Master of Science in International Relations',
    'Master of Science in Political Science',
    'Master of Science in Sociology',
    'Master of Science in Anthropology',
    'Master of Science in History',
    'Master of Science in Philosophy',
    'Master of Science in Linguistics',
    'Master of Science in English',
    'Master of Science in Comparative Literature',
    'Master of Science in Creative Writing',
    'Master of Science in Journalism',
    'Master of Science in Media Studies',
    'Master of Science in Communication',
    'Master of Science in Film Studies',
    'Master of Science in Art History',
    'Master of Science in Musicology',
    'Master of Science in Theatre',
    'Master of Science in Dance',
    'Master of Science in Urban Planning',
    'Master of Science in Architecture',
    'Master of Science in Interior Design',
    'Master of Science in Landscape Architecture',
    'Master of Science in Real Estate',
    'Master of Science in Construction Management',
    'Master of Science in Law',
    'Master of Science in Criminal Justice',
    'Master of Science in Forensic Science',
    'Master of Science in International Development',
    'Master of Science in Peace and Conflict Studies',
    'Master of Science in Social Work',
    'Master of Divinity (M.Div.)',
    'Master of Theology (Th.M.)',
    'Master of Arts in Religious Studies',
    'Master of Science in Library Science',
    'Master of Science in Museum Studies',
    'Master of Science in Biomedical Engineering',
    'Master of Science in Aerospace Engineering',
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
      {/* 1b1b1b */}
      {/* font-family: "Source Sans Pro"; font-size: 16.96px; font-style: normal;
      font-weight: 400; line-height: 22.048px; */}
      <p className="vads-u-margin-bottom--0p5">Search for a program name:</p>
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
          <li className="list-item" key={index}>
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
