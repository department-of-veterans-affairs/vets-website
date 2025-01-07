import { expect } from 'chai';
import sinon from 'sinon';
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
  page15aDepends,
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

describe('getAgeInYears', () => {
  let clock;

  beforeEach(() => {
    // Mock Date.now() to always return a fixed value in 2024
    // (Similar to ReferralTaskCard.unit.spec.js)
    const fixedTimestamp = new Date('2024-12-31T00:00:00Z').getTime();
    clock = sinon.useFakeTimers({ now: fixedTimestamp, toFake: ['Date'] });
  });

  afterEach(() => {
    clock.restore();
  });

  it('should correctly calculate age in years', () => {
    const birthDate = '1990-07-01';
    const age = getAgeInYears(birthDate);
    expect(age).to.equal(34);
  });

  it('should correctly calculate age with a New Year’s Day birthdate', () => {
    const birthDate = '2000-01-01';
    const age = getAgeInYears(birthDate);
    expect(age).to.equal(24);
  });

  it('should correctly calculate age with a leap day birthdate', () => {
    const birthDate = '2004-02-29';
    const age = getAgeInYears(birthDate);
    expect(age).to.equal(20);
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

describe('page15a depends function', () => {
  const isApp = {
    certifierRole: 'applicant',
    certifierAddress: { street: '123' },
  };
  const notApp = {
    certifierRelationship: { relationshipToVeteran: { other: true } },
    certifierAddress: { street: '123' },
  };
  it('Should return false if certifier is an applicant and index is 0', () => {
    expect(page15aDepends(isApp, 0)).to.be.false;
  });
  it('Should return true if certifier is an applicant and index > 0', () => {
    expect(page15aDepends(isApp, 1)).to.be.true;
  });
  it('Should return true if certifier is NOT an applicant and index is 0', () => {
    expect(page15aDepends(notApp, 0)).to.be.true;
  });
  it('Should return true if certifier is NOT an applicant and index is > 0', () => {
    expect(page15aDepends(notApp, 0)).to.be.true;
  });
});
