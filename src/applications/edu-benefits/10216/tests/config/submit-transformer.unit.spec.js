import { expect } from 'chai';
import { transform } from '../../config/submit-transformer';

describe('transform function', () => {
  before(() => {
    global.calculatedPercentage = () => {
      return 75;
    };
  });

  after(() => {
    delete global.calculatedPercentage;
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

    expect(result).to.equal(
      JSON.stringify({
        educationBenefitsClaim: {
          form: JSON.stringify({
            institutionDetails: {
              institutionName: 'test',
              facilityCode: '1234567890',
              startDate: '2024-01-01',
            },
            studentRatioCalcChapter: {
              numOfStudent: '100',
              beneficiaryStudent: '75',
              VABeneficiaryStudentsPercentage: '75.0%',
            },
          }),
        },
      }),
    );
  });
});
