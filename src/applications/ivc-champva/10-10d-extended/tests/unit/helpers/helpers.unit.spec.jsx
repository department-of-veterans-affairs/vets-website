import { expect } from 'chai';
import {
  page15aDepends,
  populateFirstApplicant,
} from '../../../helpers/utilities';

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

describe('populateFirstApplicant', () => {
  const newAppInfo = {
    name: { first: 'First', last: 'Last' },
    email: 'fake@va.gov',
    phone: '1231231234',
    address: { street: '123 st' },
  };
  it('Should add an applicant to the start of `formData.applicants` array', () => {
    const formData = {
      applicants: [
        {
          applicantName: { first: 'Test' },
          applicantEmailAddress: 'fake@va.gov',
        },
      ],
    };
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
  it('Should override existing applicant in first slot if name matches', () => {
    const formData = {
      applicants: [{ applicantName: newAppInfo.name }],
    };
    const result = populateFirstApplicant(
      formData,
      newAppInfo.name,
      'emailoverride@va.gov',
      newAppInfo.phone,
      newAppInfo.address,
    );
    expect(result.applicants.length).to.equal(1);
    expect(result.applicants[0].applicantEmailAddress).to.equal(
      'emailoverride@va.gov',
    );
  });
  it('Should not override matching applicant if it is not the first applicant', () => {
    const formData = {
      applicants: [
        { applicantName: { first: 'test', last: 'lorem' } },
        { applicantName: newAppInfo.name },
      ],
    };
    const result = populateFirstApplicant(
      formData,
      newAppInfo.name,
      'emailoverride@va.gov',
      newAppInfo.phone,
      newAppInfo.address,
    );
    expect(result.applicants.length).to.equal(2);
    expect(result.applicants[0].applicantEmailAddress).to.equal(undefined);
    expect(result.applicants[1].applicantEmailAddress).to.equal(undefined);
  });
});
