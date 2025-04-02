import React from 'react';
import PropTypes from 'prop-types';

export const deriveDegreeLevel = degreeLevel => {
  // Show unknown if there's no degreeLevel.
  if (!degreeLevel) {
    return 'Not provided';
  }

  // Show the degreeLevel.
  return degreeLevel;
};

export const deriveMaxAmount = contributionAmount => {
  // Show unknown if there's no contributionAmount.
  if (!contributionAmount) {
    return 'Not provided';
  }

  // Derive the contribution amount number.
  const contributionAmountNum = parseFloat(contributionAmount);

  // Show unlimited contribution amount state.
  if (contributionAmountNum >= 99999) {
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

export const deriveEligibleStudents = numberOfStudents => {
  // Show unknown if there's no numberOfStudents.
  if (!numberOfStudents) {
    return 'Not provided';
  }

  // Escape early if the data indicates all eligible students.
  if (numberOfStudents >= 99999) {
    return 'All eligible students';
  }

  // Show numberOfStudents.
  return `${numberOfStudents} students`;
};

export const formatDegree = degreeLevel => {
  let degreeLevels;

  if (degreeLevel.includes(',')) {
    degreeLevels = degreeLevel.split(',');
    return `${degreeLevels[0]}/${degreeLevels[1].trim()}`;
  }

  return degreeLevel;
};

function YellowRibbonTableRows({ programs }) {
  return (
    <>
      {programs.map((program, index) => {
        const {
          degreeLevel,
          divisionProfessionalSchool,
          numberOfStudents,
          contributionAmount,
        } = program;

        return (
          <va-table-row key={`row-default-${index}`}>
            <span>{formatDegree(deriveDegreeLevel(degreeLevel))}</span>
            <span>{divisionProfessionalSchool}</span>
            <span>{deriveEligibleStudents(numberOfStudents)}</span>
            <span>{deriveMaxAmount(contributionAmount)}</span>
          </va-table-row>
        );
      })}
    </>
  );
}

YellowRibbonTableRows.propTypes = { programs: PropTypes.object };
export default YellowRibbonTableRows;
