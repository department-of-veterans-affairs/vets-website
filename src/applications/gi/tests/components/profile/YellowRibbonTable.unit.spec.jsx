import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import YellowRibbonTable, {
  matchColumn,
  handleSort,
} from '../../../components/profile/YellowRibbonTable';
import { yellowRibbonColumns as _yellowRibbonColumns } from '../../../constants';

// matchColumn
describe('matchColumn', () => {
  it('should return the correct column number from the element id', () => {
    const element = { id: 'column-3' };
    const result = matchColumn(element);
    expect(result).to.equal(3);
  });
});

describe('handleSort', () => {
  let setSortConfigStub;
  let setSortedProgramsStub;
  let sortedPrograms;
  let yellowRibbonColumns;

  beforeEach(() => {
    sortedPrograms = [
      {
        degreeLevel: 'Graduate',
        program: 'School of Law',
        numberOfStudents: '25',
        contributionAmount: 2000,
      },
      {
        degreeLevel: 'Undergraduate',
        program: 'School of Medicine',
        numberOfStudents: '35',
        contributionAmount: 1500,
      },
    ];

    yellowRibbonColumns = _yellowRibbonColumns;

    setSortConfigStub = sinon.stub();
    setSortedProgramsStub = sinon.stub();
  });

  it('should sort the programs by the selected column in ascending order', () => {
    const prevSortConfig = { column: 'amount', direction: 'descending' };
    const id = 3; // ID for contributionAmount (funding column)

    setSortConfigStub.callsFake(callback => {
      const result = callback(prevSortConfig);
      expect(result).to.eql({ column: 3, direction: 'ascending' });
    });

    handleSort(
      id,
      sortedPrograms,
      yellowRibbonColumns,
      setSortConfigStub,
      setSortedProgramsStub,
    );

    expect(setSortedProgramsStub.calledOnce).to.be.true;
    const sorted = setSortedProgramsStub.firstCall.args[0];
    expect(sorted[0].contributionAmount).to.equal(1500); // Ascending order
    expect(sorted[1].contributionAmount).to.equal(2000);
  });

  it('should sort the programs by the selected column in descending order', () => {
    const prevSortConfig = { column: 3, direction: 'ascending' };
    const id = 3; // ID for contributionAmount (funding column)

    setSortConfigStub.callsFake(callback => {
      const result = callback(prevSortConfig);
      expect(result).to.eql({ column: 3, direction: 'descending' });
    });

    handleSort(
      id,
      sortedPrograms,
      yellowRibbonColumns,
      setSortConfigStub,
      setSortedProgramsStub,
    );

    expect(setSortedProgramsStub.calledOnce).to.be.true;
    const sorted = setSortedProgramsStub.firstCall.args[0];
    expect(sorted[0].contributionAmount).to.equal(2000); // Descending order
    expect(sorted[1].contributionAmount).to.equal(1500);
  });

  it('should reset sorting when a new column is selected', () => {
    const prevSortConfig = { column: 3, direction: 'ascending' };
    const id = 1; // ID for program column

    setSortConfigStub.callsFake(callback => {
      const result = callback(prevSortConfig);
      expect(result).to.eql({ column: 1, direction: 'ascending' });
    });

    handleSort(
      id,
      sortedPrograms,
      yellowRibbonColumns,
      setSortConfigStub,
      setSortedProgramsStub,
    );

    expect(setSortedProgramsStub.calledOnce).to.be.true;
    const sorted = setSortedProgramsStub.firstCall.args[0];
    expect(sorted[0].program).to.equal('School of Law');
    expect(sorted[1].program).to.equal('School of Medicine');
  });
});

describe('YellowRibbonTable Component', () => {
  const mockPrograms = [
    {
      degreeLevel: 'Graduate',
      divisionProfessionalSchool: 'School of Law',
      numberOfStudents: '25',
      contributionAmount: 2000,
    },
    {
      degreeLevel: 'Undergraduate',
      divisionProfessionalSchool: 'School of Medicine',
      numberOfStudents: '35',
      contributionAmount: 1500,
    },
    {
      degreeLevel: 'Undergraduate',
      divisionProfessionalSchool: 'School of Engineering',
      numberOfStudents: '20',
      contributionAmount: 3000,
    },
  ];

  it('renders the YellowRibbonTable component with programs', () => {
    const { getByText } = render(<YellowRibbonTable programs={mockPrograms} />);

    // Check if the table rows are rendered correctly
    expect(getByText('School of Law')).to.exist;
    expect(getByText('School of Medicine')).to.exist;
    expect(getByText('School of Engineering')).to.exist;
  });
});
