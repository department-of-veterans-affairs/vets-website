import { expect } from 'chai';
import sinon from 'sinon';
import * as transformHelpers from 'platform/forms-system/src/js/helpers';
import * as utilities from '../../utilities';
import { transform } from '../../config/submit-transformer';

describe('transform function', () => {
  let transformForSubmitStub;
  let calculatedPercentageStub;

  beforeEach(() => {
    transformForSubmitStub = sinon
      .stub(transformHelpers, 'transformForSubmit')
      .callsFake((formConfig, form) => {
        return {
          data: {
            ...form.data,
            transformForSubmitCalled: true,
          },
        };
      });

    calculatedPercentageStub = sinon
      .stub(utilities, 'calculatedPercentage')
      .returns(99);
  });

  afterEach(() => {
    transformForSubmitStub.restore();
    calculatedPercentageStub.restore();
  });
  it('should transform form data correctly', () => {
    const formConfig = {};
    const form = {
      data: {
        institutionDetails: {
          institutionName: 'test',
          facilityCode: '1234567890',
          startDate: '2024-01-01',
        },
        studentRatioCalcChapter: {
          numOfStudent: '100',
          beneficiaryStudent: '75',
        },
      },
    };

    const result = transform(formConfig, form);
    const parsedResult = JSON.parse(result);
    expect(parsedResult).to.deep.equal({
      educationBenefitsClaim: {
        form: {
          data: {
            institutionDetails: {
              institutionName: 'test',
              facilityCode: '1234567890',
              startDate: '2024-01-01',
            },
            studentRatioCalcChapter: {
              numOfStudent: 100,
              beneficiaryStudent: 75,
              VABeneficiaryStudentsPercentage: 99,
            },
            transformForSubmitCalled: true,
            dateSigned: utilities.dateSigned(),
          },
        },
      },
    });
  });
  it('should transform form data correctly', () => {
    const formConfig = { mockConfig: true };
    const form = {
      data: {
        studentRatioCalcChapter: {
          studentPercentageCalc: 'someValue',
          beneficiaryStudent: '2',
          numOfStudent: '4',
        },
      },
    };
    const result = transform(formConfig, form);
    const parsedResult = JSON.parse(result);
    expect(parsedResult).to.have.property('educationBenefitsClaim');
    expect(parsedResult.educationBenefitsClaim).to.have.property('form');
    const finalFormData = parsedResult.educationBenefitsClaim.form.data;
    expect(finalFormData).to.be.an('object');
    expect(finalFormData).to.have.property('transformForSubmitCalled', true);
    expect(finalFormData.studentRatioCalcChapter).to.exist;
    expect(finalFormData.studentRatioCalcChapter).to.not.have.property(
      'studentPercentageCalc',
    );
    expect(finalFormData.studentRatioCalcChapter).to.have.property(
      'beneficiaryStudent',
      2,
    );
    expect(finalFormData.studentRatioCalcChapter).to.have.property(
      'numOfStudent',
      4,
    );
    expect(finalFormData.studentRatioCalcChapter).to.have.property(
      'VABeneficiaryStudentsPercentage',
      99,
    );
    expect(calculatedPercentageStub.calledOnce).to.be.true;
    expect(transformForSubmitStub.calledOnce).to.be.true;
  });
});
