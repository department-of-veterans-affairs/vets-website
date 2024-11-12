import React from 'react';
import PropTypes from 'prop-types';

export const deriveDegreeLevel = degreeLevel => {
  if (!degreeLevel) {
    return 'Not provided';
  }

  return degreeLevel;
};

export const deriveMaxAmount = contributionAmount => {
  if (!contributionAmount) {
    return 'Not provided';
  }

  const contributionAmountNum = parseFloat(contributionAmount);

  if (contributionAmountNum >= 99999) {
    return "Pays remaining tuition that Post-9/11 GI Bill doesn't cover";
  }

  return contributionAmountNum.toLocaleString('en-US', {
    currency: 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    style: 'currency',
  });
};

export const deriveEligibleStudents = numberOfStudents => {
  if (!numberOfStudents) {
    return 'Not provided';
  }

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

export function extractProperties(data) {
  const degreeLevel = [];
  const divisionProfessionalSchool = [];
  const numberOfStudents = [];
  const contributionAmount = [];

  data.forEach(program => {
    degreeLevel.push(program.degreeLevel);
    divisionProfessionalSchool.push(program.divisionProfessionalSchool);
    numberOfStudents.push(program.numberOfStudents);
    contributionAmount.push(program.contributionAmount);
  });

  return [
    degreeLevel,
    divisionProfessionalSchool,
    numberOfStudents,
    contributionAmount,
  ];
}

function YellowRibbonTableRows({ programs }) {
  // programs is an array of objects, with all values pertaining to one program
  // need an array of arrays, with each array holding the values of a single property, one from each program. e.g. one array holds all the 'numberOfStudents' values from each program

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

YellowRibbonTableRows.propTypes = { programs: PropTypes.array };
export default YellowRibbonTableRows;
