import { expect } from 'chai';

import formConfig from '../../../config/form';
import * as form from '../../e2e/fixtures/mocks/submitTransformerForm.json';
import transformForSubmit from '../../../config/submit-transformer';

describe('transformForSubmit', () => {
  it('should delete nonCitizenId form-data if preparerType is "citizen"', () => {
    const transformedDataString = transformForSubmit(formConfig, {
      ...form,
      data: {
        ...form.data,
        preparerType: 'citizen',
      },
    });

    const transformedData = JSON.parse(transformedDataString);

    expect(transformedData.nonCitizenId).to.be.undefined;
  });

  it('should delete citizenId form-data if preparerType is "non-citizen"', () => {
    const transformedDataString = transformForSubmit(formConfig, {
      ...form,
      data: { ...form.data, preparerType: 'non-citizen' },
    });

    const transformedData = JSON.parse(transformedDataString);

    expect(transformedData.citizenId).to.be.undefined;
  });

  it('should delete unneeded record-details form-data based on recordSelections', () => {
    const transformedDataString = transformForSubmit(formConfig, {
      ...form,
      data: {
        ...form.data,
        recordSelections: {
          'disability-exams': true,
          'other-comp-pen': false,
          financial: false,
          'life-ins': false,
          other: false,
        },
      },
    });

    const transformedData = JSON.parse(transformedDataString);

    expect(transformedData.otherCompAndPenDetails).to.be.undefined;
    expect(transformedData.financialRecordDetails).to.be.undefined;
    expect(transformedData.lifeInsuranceBenefitDetails).to.be.undefined;
    expect(transformedData.otherBenefitDetails).to.be.undefined;
  });

  it('should not delete record-details form-data based on recordSelections', () => {
    const transformedDataString = transformForSubmit(formConfig, {
      ...form,
      data: {
        ...form.data,
        recordSelections: {
          'disability-exams': true,
          'other-comp-pen': true,
          financial: true,
          'life-ins': true,
          other: true,
        },
      },
    });

    const transformedData = JSON.parse(transformedDataString);

    expect(transformedData.disabilityExams).to.be.an('array').that.is.not.empty;
  });
});
