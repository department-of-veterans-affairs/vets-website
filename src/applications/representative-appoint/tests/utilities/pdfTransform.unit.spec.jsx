import formData from '../fixtures/data/form-data.json';
import transformedData from '../fixtures/data/pdf-transformed-form-data.json';
import { pdfTransform } from '../../utilities/pdfTransform';

const { expect } = require('chai');

describe('transformData', () => {
  let input;

  beforeEach(() => {
    input = { ...formData };
  });

  it('should transform the input data into the expected output format', () => {
    const expectedOutput = transformedData;

    const result = pdfTransform(input);

    expect(result).to.deep.equal(expectedOutput);
  });

  context('when authorizationRadio is all records', () => {
    it('should ignore the previously selected consent limitations', () => {
      input.authorizationRadio =
        'Yes, they can access all of these types of records';

      const result = pdfTransform(input);

      expect(result.consentLimits).to.be.empty;
    });
  });

  context('when authorizationRadio is some records', () => {
    it('should include the previously selected consent limitations', () => {
      const result = pdfTransform(input);

      expect(result.consentLimits).to.deep.equal(['ALCOHOLISM', 'DRUG_ABUSE']);
    });
  });

  context('when authorizationRadio is no records', () => {
    it('should ignore the previously selected consent limitations', () => {
      input.authorizationRadio =
        "No, they can't access any of these types of records";

      const result = pdfTransform(input);

      expect(result.consentLimits).to.be.empty;
    });
  });
});
