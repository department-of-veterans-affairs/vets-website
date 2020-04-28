// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import startCase from 'lodash/startCase';
import toLower from 'lodash/toLower';
import startsWith from 'lodash/startsWith';
// Relative imports.
import { capitalize } from '../../helpers';

export const deriveNameLabel = school => {
  // Show unknown if there's no nameOfInstitution.
  if (!school?.nameOfInstitution) {
    return 'Not provided';
  }

  // Show the nameOfInstitution.
  return startCase(toLower(school?.nameOfInstitution));
};

export const deriveLocationLabel = (school = {}) => {
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

export const deriveMaxAmountLabel = (school = {}) => {
  // Show unknown if there's no contributionAmount.
  if (!school?.contributionAmount) {
    return 'Not provided';
  }

  // Derive the contribution amount number.
  const contributionAmountNum = parseFloat(school?.contributionAmount);

  // Show unlimited contribution amount state.
  if (contributionAmountNum > 90000) {
    return "Pays remaining tuition that Post-9/11 GI Bill doesn't cover";
  }

  // Show formatted contributionAmount.
  return contributionAmountNum.toLocaleString('en-US', {
    currency: 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    style: 'currency',
  });
};

export const deriveEligibleStudentsLabel = (school = {}) => {
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

export const deriveInstURLLabel = (school = {}) => {
  // Show unknown if there's no insturl.
  if (!school?.insturl) {
    return 'Not provided';
  }

  // Derive the a tag's href.
  const href = startsWith(school?.insturl, 'http')
    ? school?.insturl
    : `https://${school?.insturl}`;

  // Show the school's website URL.
  return (
    <a href={href} rel="noreferrer noopener" target="_blank">
      {toLower(school?.insturl)}
    </a>
  );
};

export const deriveDegreeLevel = (school = {}) => {
  // Show unknown if there's no degreeLevel.
  if (!school?.degreeLevel) {
    return 'Not provided';
  }

  // Show the degreeLevel.
  return school?.degreeLevel;
};

export const deriveDivisionProfessionalSchool = (school = {}) => {
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
    <p
      className="vads-u-font-size--h3 vads-u-font-weight--bold vads-u-font-family--serif vads-u-margin--0"
      data-e2e-id="result-title"
    >
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
            <span className="sr-only">:</span>
          </p>
          <p className="vads-u-margin--0">{deriveMaxAmountLabel(school)}</p>
        </div>

        {/* Student Count */}
        <p className="vads-u-font-weight--bold vads-u-font-family--sans vads-u-font-size--h5 vads-u-margin-top--2 vads-u-margin-bottom--0">
          Funding available for
          <span className="sr-only">:</span>
        </p>
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
          {deriveEligibleStudentsLabel(school)}
        </p>

        {/* School Website */}
        <p className="vads-u-font-weight--bold vads-u-font-family--sans vads-u-font-size--h5 vads-u-margin-top--2 vads-u-margin-bottom--0">
          School website
          <span className="sr-only">:</span>
        </p>
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
          {deriveInstURLLabel(school)}
        </p>
      </div>

      <div className="vads-l-col--12 medium-screen:vads-l-col--6 medium-screen:vads-u-padding-left--2">
        {/* Degree Level */}
        <p className="vads-u-font-weight--bold vads-u-margin-top--2 vads-u-margin-bottom--0 vads-u-font-family--sans vads-u-font-size--h5 medium-screen:vads-u-margin--0">
          Degree type
          <span className="sr-only">:</span>
        </p>
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--0 medium-screen:vads-u-margin--0">
          {deriveDegreeLevel(school)}
        </p>

        {/* Division Professional School */}
        <p className="school-program vads-u-font-weight--bold vads-u-margin-top--2 vads-u-margin-bottom--0 vads-u-font-family--sans vads-u-font-size--h5 medium-screen:vads-u-margin-bottom--0">
          School or program
          <span className="sr-only">:</span>
        </p>
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--0 medium-screen:vads-u-margin--0">
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
