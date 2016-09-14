import { expect } from 'chai';

import { createVeteran, veteranToApplication } from '../../../src/js/edu-benefits/utils/veteran.js';
import { makeField } from '../../../src/js/common/model/fields';

describe.only('veteranToApplication', () => {
  it('converts empty fields to undefined', () => {
    const formData = createVeteran();
    const applicationData = veteranToApplication(formData);

    expect(applicationData.educationStartDate).to.be.undefined;
    expect(applicationData.veteranFullName.first).to.be.undefined;
  });
  it('converts fields to values', () => {
    const formData = createVeteran();
    formData.veteranFullName.first.value = 'Bob';
    const applicationData = veteranToApplication(formData);

    expect(applicationData.veteranFullName.first).to.equal(formData.veteranFullName.first.value);
  });
  it('converts array items to values', () => {
    const formData = createVeteran();
    formData.toursOfDuty.push({
      serviceBranch: makeField('army')
    });
    const applicationData = veteranToApplication(formData);

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
    const applicationData = veteranToApplication(formData);

    expect(applicationData.toursOfDuty[0].fromDate).to.equal('1996-09-06');
  });
  it('converts yes/no fields too boolean', () => {
    const formData = createVeteran();
    formData.seniorRotcCommissioned.value = 'Y';
    const applicationData = veteranToApplication(formData);

    expect(applicationData.seniorRotcCommissioned).to.equal(true);
  });
});
