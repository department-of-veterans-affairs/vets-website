import { expect } from 'chai';
import sinon from 'sinon';
import * as transformHelpers from 'platform/forms-system/src/js/helpers';
import { transform } from '../../../config/submit-transformer';

describe('submit transformer', () => {
  let transformForSubmitStub;
  beforeEach(() => {
    transformForSubmitStub = sinon
      .stub(transformHelpers, 'transformForSubmit')
      .callsFake((formConfig, form) => {
        return JSON.stringify({
          ...form,
        });
      });
  });

  afterEach(() => {
    transformForSubmitStub.restore();
  });
  it('should transform form data correctly for submission as veteran', () => {
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
  it('should transform form data correctly for submission as not veteran', () => {
    const formConfig = {}; // Mock form config if needed
    const formData = {
      claimantNotVeteran: true,
      claimantFullName: {
        first: 'John',
        middle: 'A',
        last: 'Doe',
        suffix: 'Jr',
      },
      veteranFullName: {
        first: 'Jane',
        middle: 'C',
        last: 'Doee',
        suffix: 'Sr',
      },
    };

    const result = transform(formConfig, formData);
    const parsedResult = JSON.parse(result);
    expect(parsedResult).to.have.property('medicalExpenseReportsClaim');
    expect(parsedResult.medicalExpenseReportsClaim).to.have.property('form');
    expect(parsedResult.medicalExpenseReportsClaim.form).to.deep.equal({
      claimantNotVeteran: true,
      claimantFullName: {
        first: 'John',
        middle: 'A',
        last: 'Doe',
        suffix: 'Jr',
      },
      veteranFullName: {
        first: 'Jane',
        middle: 'C',
        last: 'Doee',
        suffix: 'Sr',
      },
    });
    expect(parsedResult).to.have.property('localTime');
    // Additional checks for localTime format can be added here
  });
});
