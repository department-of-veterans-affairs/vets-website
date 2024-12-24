import { expect } from 'chai';
import transform from '../../config/transform';

describe('transform function', () => {
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
        programs: [],
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
            },
            // programs: [],
          }),
        },
      }),
    );
  });
});
