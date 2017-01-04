import { expect } from 'chai';

import { createVeteran, veteranToApplication } from '../../../../src/js/edu-benefits/1990/utils/veteran.js';
import { makeField } from '../../../../src/js/common/model/fields';

describe('veteranToApplication', () => {
  it('converts empty fields to undefined', () => {
    const formData = createVeteran();
    const applicationData = JSON.parse(veteranToApplication(formData));

    expect(applicationData.educationStartDate).to.be.undefined;
    expect(applicationData.veteranFullName.first).to.be.undefined;
  });
  it('converts fields to values', () => {
    const formData = createVeteran();
    formData.veteranFullName.first.value = 'Bob';
    const applicationData = JSON.parse(veteranToApplication(formData));

    expect(applicationData.veteranFullName.first).to.equal(formData.veteranFullName.first.value);
  });
  it('converts array items to values', () => {
    const formData = createVeteran();
    formData.toursOfDuty.push({
      serviceBranch: makeField('army')
    });
    const applicationData = JSON.parse(veteranToApplication(formData));

    expect(applicationData.toursOfDuty[0].serviceBranch).to.equal('army');
  });
  it('converts dates to iso', () => {
    const formData = createVeteran();
    formData.toursOfDuty.push({
      serviceBranch: makeField('army'),
      fromDate: {
        month: makeField('9'),
        day: makeField('6'),
        year: makeField('1996')
      }
    });
    const applicationData = JSON.parse(veteranToApplication(formData));

    expect(applicationData.toursOfDuty[0].fromDate).to.equal('1996-09-06');
  });
  it('converts partial dates to iso', () => {
    const formData = createVeteran();
    formData.toursOfDuty.push({
      serviceBranch: makeField('army'),
      fromDate: {
        month: makeField(''),
        day: makeField('6'),
        year: makeField('1996')
      }
    });
    const applicationData = JSON.parse(veteranToApplication(formData));

    expect(applicationData.toursOfDuty[0].fromDate).to.equal('1996-XX-06');
  });
  it('converts month year dates to iso', () => {
    const formData = createVeteran();
    formData.highSchoolOrGedCompletionDate = {
      month: makeField('4'),
      year: makeField('1996')
    };
    const applicationData = JSON.parse(veteranToApplication(formData));

    expect(applicationData.highSchoolOrGedCompletionDate).to.equal('1996-04-XX');
  });
  it('converts date ranges to iso', () => {
    const formData = createVeteran();
    formData.toursOfDuty.push({
      serviceBranch: makeField('army'),
      dateRange: {
        from: {
          month: makeField('9'),
          day: makeField('6'),
          year: makeField('1996')
        },
        to: {
          month: makeField('9'),
          day: makeField('6'),
          year: makeField('1997')
        }
      }
    });
    const applicationData = JSON.parse(veteranToApplication(formData));

    expect(applicationData.toursOfDuty[0].dateRange.from).to.equal('1996-09-06');
    expect(applicationData.toursOfDuty[0].dateRange.to).to.equal('1997-09-06');
  });
  it('removes empty date ranges', () => {
    const formData = createVeteran();
    formData.toursOfDuty.push({
      serviceBranch: makeField('army'),
      dateRange: {
        to: {
          month: makeField(''),
          day: makeField(''),
          year: makeField('')
        },
        from: {
          month: makeField(''),
          day: makeField(''),
          year: makeField('')
        }
      }
    });
    const applicationData = JSON.parse(veteranToApplication(formData));

    expect(applicationData.toursOfDuty[0].dateRange).to.be.undefined;
  });
  it('removes partially empty date ranges', () => {
    const formData = createVeteran();
    formData.toursOfDuty.push({
      serviceBranch: makeField('army'),
      dateRange: {
        to: {
          month: makeField(''),
          day: makeField(''),
          year: makeField('')
        },
        from: {
          month: makeField('5'),
          day: makeField('5'),
          year: makeField('2001')
        }
      }
    });
    const applicationData = JSON.parse(veteranToApplication(formData));

    expect(applicationData.toursOfDuty[0].dateRange.to).to.be.undefined;
    expect(applicationData.toursOfDuty[0].dateRange.from).not.to.be.undefined;
  });
  it('converts yes/no fields to booleans', () => {
    const formData = createVeteran();
    formData.serviceBefore1977.married.value = 'Y';
    const applicationData = JSON.parse(veteranToApplication(formData));

    expect(applicationData.serviceBefore1977.married).to.equal(true);
  });
  it('removes dashes from ssn', () => {
    const formData = createVeteran();
    formData.veteranSocialSecurityNumber.value = '134-22-3355';
    const applicationData = JSON.parse(veteranToApplication(formData));

    expect(applicationData.veteranSocialSecurityNumber).to.equal('134223355');
  });
  it('removes seniorRotc when not applicable', () => {
    const formData = createVeteran();
    formData.seniorRotcCommissioned.value = 'N';
    let applicationData = JSON.parse(veteranToApplication(formData));

    expect(applicationData.seniorRotc).to.be.undefined;

    formData.seniorRotcCommissioned.value = 'Y';
    applicationData = JSON.parse(veteranToApplication(formData));

    expect(applicationData.seniorRotc).to.be.defined;
  });
  it('converts number fields to numbers', () => {
    const formData = createVeteran();
    formData.serviceAcademyGraduationYear.value = '1999';
    const applicationData = JSON.parse(veteranToApplication(formData));

    expect(applicationData.serviceAcademyGraduationYear).to.equal(1999);
  });
  it('removes empty number fields', () => {
    const formData = createVeteran();
    formData.serviceAcademyGraduationYear.value = '';
    const applicationData = JSON.parse(veteranToApplication(formData));

    expect(applicationData.serviceAcademyGraduationYear).to.be.undefined;
  });
  it('removes addresses with missing info', () => {
    const formData = createVeteran();
    formData.school.address = {
      city: makeField('Test'),
      street: makeField(''),
      state: makeField('MA'),
      country: makeField('USA'),
      postalCode: makeField('01060')
    };
    const applicationData = JSON.parse(veteranToApplication(formData));

    expect(applicationData.school.address).to.be.undefined;
  });
});
