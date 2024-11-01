import { expect } from 'chai';
import React from 'react';
import {
  applicantWording,
  getAgeInYears,
  makeHumanReadable,
} from '../../../../shared/utilities';
import {
  isInRange,
  sponsorWording,
  populateFirstApplicant,
} from '../../../helpers/utilities';
import { getTopLevelFormData } from '../../../components/Applicant/applicantFileUpload';
import ApplicantField from '../../../../shared/components/applicantLists/ApplicantField';
import { testComponentRender } from '../../../../shared/tests/pages/pageTests.spec';
import mockData from '../../e2e/fixtures/data/test-data.json';

describe('sponsorWording helper', () => {
  it('should return non-possesive form when isPosessive == false', () => {
    expect(sponsorWording({}, false)).to.equal('Sponsor');
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

describe('populateFirstApplicant', () => {
  const newAppInfo = {
    name: { first: 'First', last: 'Last' },
    email: 'fake@va.gov',
    phone: '1231231234',
    address: { street: '123 st' },
  };
  it('Should add an applicant to the start of `formData.applicants` array', () => {
    const formData = { applicants: [{ applicantName: { first: 'Test' } }] };
    const result = populateFirstApplicant(
      formData,
      newAppInfo.name,
      newAppInfo.email,
      newAppInfo.phone,
      newAppInfo.address,
    );
    expect(result.applicants.length).to.equal(2);
    expect(result.applicants[0].applicantName.first).to.equal(
      newAppInfo.name.first,
    );
  });
  it('Should add the applicants array if it is undefined', () => {
    const formData = {};
    const result = populateFirstApplicant(
      formData,
      newAppInfo.name,
      newAppInfo.email,
      newAppInfo.phone,
      newAppInfo.address,
    );
    expect(result.applicants.length).to.equal(1);
  });
});
