// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import startCase from 'lodash/startCase';
import toLower from 'lodash/toLower';
// Relative imports.
import { capitalize } from '../../helpers';

const deriveNameLabel = school => {
  // Show unknown if there's no nameOfInstitution.
  if (!school?.nameOfInstitution) {
    return 'Not provided';
  }

  // Show the nameOfInstitution.
  return startCase(toLower(school?.nameOfInstitution));
};

const deriveLocationLabel = (school = {}) => {
  // Show unknown if there's no city or state.
  if (!school?.city && !school?.state) {
    return 'Not provided';
  }

  // Only show state if there's no city.
  if (!school?.city) {
    return school?.state;
  }

  // Only show city if there's no state.
  if (!school?.state) {
    return capitalize(school?.city);
  }

  // Show both city and state.
  return `${capitalize(school?.city)}, ${school?.state}`;
};

const deriveMaxAmountLabel = (school = {}) => {
  // Show unknown if there's no contributionAmount.
  if (!school?.contributionAmount) {
    return 'Not provided';
  }

  // Derive the contribution amount number.
  const contributionAmountNum = parseFloat(school?.contributionAmount);

  if (contributionAmountNum > 90000) {
    return 'All tuition and fees not covered by Post-9/11 GI Bill benefits';
  }

  // Show formatted contributionAmount.
  return contributionAmountNum.toLocaleString('en-US', {
    currency: 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    style: 'currency',
  });
};

const deriveEligibleStudentsLabel = (school = {}) => {
  // Show unknown if there's no numberOfStudents.
  if (!school?.numberOfStudents) {
    return 'Not provided';
  }

  // Escape early if the data indicates all eligible students.
  if (school?.numberOfStudents >= 99999) {
    return 'All eligible students';
  }

  // Show numberOfStudents.
  return `${school?.numberOfStudents} students`;
};

const deriveInstURLLabel = (school = {}) => {
  // Show unknown if there's no insturl.
  if (!school?.insturl) {
    return 'Not provided';
  }

  // Show the school's website URL.
  return (
    <a href={school?.insturl} rel="noreferrer noopener">
      {toLower(school?.insturl)}
    </a>
  );
};

const deriveDegreeLevel = (school = {}) => {
  // Show unknown if there's no degreeLevel.
  if (!school?.degreeLevel) {
    return 'Not provided';
  }

  // Show the degreeLevel.
  return school?.degreeLevel;
};

const deriveDivisionProfessionalSchool = (school = {}) => {
  // Show unknown if there's no divisionProfessionalSchool.
  if (!school?.divisionProfessionalSchool) {
    return 'Not provided';
  }

  // Show the divisionProfessionalSchool.
  return school?.divisionProfessionalSchool;
};

export const SearchResult = ({ school }) => (
  <li className="usa-unstyled-list vads-l-col vads-u-margin-bottom--2 vads-u-padding-x--2 vads-u-padding-y--2 vads-u-background-color--gray-light-alt">
    {/* School Name */}
    <p className="vads-u-font-size--h3 vads-u-font-weight--bold vads-u-margin--0">
      <span className="sr-only">School name</span>
      {deriveNameLabel(school)}
    </p>

    {/* School Location */}
    <p className="vads-u-margin-bottom--1 vads-u-margin-top--0">
      <span className="sr-only">School location</span>
      {deriveLocationLabel(school)}
    </p>

    <div className="vads-l-row vads-u-margin-top--2">
      <div className="vads-l-col--12 vads-u-display--flex vads-u-flex-direction--column vads-u-justify-content--space-between medium-screen:vads-l-col--6">
        {/* Max Contribution Amount */}
        <div className="vads-u-col">
          <p className="vads-u-font-weight--bold vads-u-font-family--sans vads-u-font-size--h5 vads-u-margin--0">
            Maximum Yellow Ribbon funding amount
            <br />
            (per student, per year)
          </p>
          <p className="vads-u-margin--0">
            <span className="sr-only">
              Maximum Yellow Ribbon funding amount (per student, per year)
            </span>
            {deriveMaxAmountLabel(school)}
          </p>
        </div>

        {/* Student Count */}
        <p className="vads-u-font-weight--bold vads-u-font-family--sans vads-u-font-size--h5 vads-u-margin-top--2 vads-u-margin-bottom--0">
          Funding available for
        </p>
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
          <span className="sr-only">Eligible students</span>
          {deriveEligibleStudentsLabel(school)}
        </p>

        {/* School Website */}
        <p className="vads-u-font-weight--bold vads-u-font-family--sans vads-u-font-size--h5 vads-u-margin-top--2 vads-u-margin-bottom--0">
          School website
        </p>
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
          <span className="sr-only">School website</span>
          {deriveInstURLLabel(school)}
        </p>
      </div>

      <div className="vads-l-col--12 medium-screen:vads-l-col--6 medium-screen:vads-u-padding-left--2">
        {/* Degree Level */}
        <p className="vads-u-font-weight--bold vads-u-margin-top--2 vads-u-margin-bottom--0 vads-u-font-family--sans vads-u-font-size--h5 medium-screen:vads-u-margin--0">
          Degree type
        </p>
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--0 medium-screen:vads-u-margin--0">
          <span className="sr-only">Degree level</span>
          {deriveDegreeLevel(school)}
        </p>

        {/* Division Professional School */}
        <p className="school-program vads-u-font-weight--bold vads-u-margin-top--2 vads-u-margin-bottom--0 vads-u-font-family--sans vads-u-font-size--h5 medium-screen:vads-u-margin-bottom--0">
          School or program
        </p>
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--0 medium-screen:vads-u-margin--0">
          <span className="sr-only">School or program</span>
          {deriveDivisionProfessionalSchool(school)}
        </p>
      </div>
    </div>
  </li>
);

SearchResult.propTypes = {
  school: PropTypes.shape({
    city: PropTypes.string.isRequired,
    contributionAmount: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    insturl: PropTypes.string,
    nameOfInstitution: PropTypes.string.isRequired,
    numberOfStudents: PropTypes.number.isRequired,
    state: PropTypes.string.isRequired,
  }).isRequired,
};

export default SearchResult;
