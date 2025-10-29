import { expect } from 'chai';
import { transform } from '../../../config/transform';

describe('submit transformer', () => {
  it('should transform form data correctly for submission', () => {
    const formConfig = {}; // Mock form config if needed
    const formData = {
      claimantNotVeteran: false,
      claimantFullName: {
        first: 'John',
        middle: 'A',
        last: 'Doe',
        suffix: 'Jr',
      },
      veteranFullName: {
        first: '',
        middle: '',
        last: '',
        suffix: '',
      },
    };

    const result = transform(formConfig, formData);
    const parsedResult = JSON.parse(result);
    expect(parsedResult).to.have.property('medicalExpenseReportsClaim');
    expect(parsedResult.medicalExpenseReportsClaim).to.have.property('form');
    expect(parsedResult.medicalExpenseReportsClaim.form).to.deep.equal({
      claimantNotVeteran: false,
      claimantFullName: {},
      veteranFullName: {
        first: 'John',
        middle: 'A',
        last: 'Doe',
        suffix: 'Jr',
      },
    });
    expect(parsedResult).to.have.property('localTime');
    // Additional checks for localTime format can be added here
  });
});
