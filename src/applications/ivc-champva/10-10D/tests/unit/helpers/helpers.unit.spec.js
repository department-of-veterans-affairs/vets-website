import { expect } from 'chai';
import React from 'react';
import { applicantWording, getAgeInYears } from '../../../../shared/utilities';
import { isInRange } from '../../../helpers/utilities';
import ApplicantField from '../../../../shared/components/applicantLists/ApplicantField';
import { testComponentRender } from '../../../../shared/tests/pages/pageTests.spec';
import mockData from '../../e2e/fixtures/data/test-data.json';

describe('applicantWording helper', () => {
  it('should concatenate first and last names', () => {
    expect(
      applicantWording({
        applicantName: { first: 'Firstname', last: 'Lastname' },
      }),
    ).to.equal('Firstname Lastname’s');
  });
});

describe('getAgeInYears helper', () => {
  const year = Number(
    new Date()
      .getFullYear()
      .toString()
      .slice(-2),
  );

  it('should return the proper age in years', () => {
    expect(getAgeInYears('2000-01-01')).to.equal(year);
  });
});

describe('isInRange helper', () => {
  it('should return true if number in range', () => {
    expect(isInRange(22, 18, 23)).to.be.true;
  });
  it('should return false if number not in range', () => {
    expect(isInRange(25, 18, 23)).to.be.false;
  });
});

// describe('getParts helper', () => {
//   it('should clean up presentation of medicare part text', () => {
//     expect(getParts('partA, partB, partD')).to.equal('Part A, Part B');
//   });
// });

testComponentRender(
  'ApplicantField',
  <ApplicantField formData={mockData.data.applicants[0]} />,
);
