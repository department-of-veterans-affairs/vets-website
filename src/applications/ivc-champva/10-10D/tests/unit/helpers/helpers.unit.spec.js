import { expect } from 'chai';
import React from 'react';
import {
  applicantWording,
  getAgeInYears,
  makeHumanReadable,
} from '../../../../shared/utilities';
import { isInRange, sponsorWording } from '../../../helpers/utilities';
import { getTopLevelFormData } from '../../../components/Applicant/applicantFileUpload';
import ApplicantField from '../../../../shared/components/applicantLists/ApplicantField';
import { testComponentRender } from '../../../../shared/tests/pages/pageTests.spec';
import mockData from '../../e2e/fixtures/data/test-data.json';

describe('sponsorWording helper', () => {
  it('should return non-possesive form when isPosessive == false', () => {
    expect(sponsorWording({ certifierRole: 'sponsor' }, false, false)).to.equal(
      'you',
    );
    expect(sponsorWording({ certifierRole: 'applicant' }, false)).to.equal(
      'Sponsor',
    );
  });
});

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

describe('makeHumanReadable helper', () => {
  it('should convert camelCase into separate, capitalized words', () => {
    expect(makeHumanReadable('camelCaseTest')).to.equal('Camel Case Test');
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

describe('getTopLevelFormData helper', () => {
  it('should return data if `contentAfterButtons` is present in formContext', () => {
    expect(
      getTopLevelFormData({
        contentAfterButtons: {
          props: {
            form: {
              data: {
                veteransFullName: { first: 'firstname', last: 'lastname' },
              },
            },
          },
        },
      }),
    ).to.not.be.undefined;
  });
  it('should return data if `contentAfterButtons` is not present in formContext', () => {
    expect(
      getTopLevelFormData({
        data: {
          veteransFullName: { first: 'firstname', last: 'lastname' },
        },
      }),
    ).to.not.be.undefined;
  });
});
