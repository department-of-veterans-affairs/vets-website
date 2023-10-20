import { expect } from 'chai';
import {
  convertDateFormat,
  formatPhoneNumber,
  bytesToKB,
} from '../../components/SectionField';

describe('convertDateFormat', () => {
  it('correctly converts YYYY-MM-DD to MM/DD/YYYY', () => {
    const inputDate = '2023-10-19';
    const expectedDate = '10/19/2023';
    const result = convertDateFormat(inputDate);
    expect(result).to.equal(expectedDate);
  });

  it('returns undefined for null or undefined input', () => {
    expect(convertDateFormat(null)).to.be.null;
    expect(convertDateFormat()).to.be.undefined;
  });
});

describe('formatPhoneNumber', () => {
  it('correctly converts YYYY-MM-DD to MM/DD/YYYY', () => {
    const inputDate = '5555555555';
    const expectedDate = '(555) 555-5555';
    const result = formatPhoneNumber(inputDate);
    expect(result).to.equal(expectedDate);
  });

  it('returns undefined for null or undefined input', () => {
    expect(formatPhoneNumber(null)).to.be.null;
    expect(formatPhoneNumber()).to.be.undefined;
  });
});

describe('bytesToKB', () => {
  it('correctly converts bytes to KB', () => {
    const inputBytes = 2048;
    const expectedKB = '2 KB';
    const result = bytesToKB(inputBytes);
    expect(result).to.equal(expectedKB);
  });
});
