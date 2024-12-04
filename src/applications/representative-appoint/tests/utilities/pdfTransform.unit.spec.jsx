import formData from '../fixtures/data/form-data.json';
import transformedData from '../fixtures/data/pdf-transformed-form-data.json';
import { pdfTransform } from '../../utilities/pdfTransform';

const { expect } = require('chai');

describe('transformData', () => {
  it('should transform the input data into the expected output format', () => {
    const input = formData;

    const expectedOutput = transformedData;

    const result = pdfTransform(input);

    expect(result).to.deep.equal(expectedOutput);
  });
});
