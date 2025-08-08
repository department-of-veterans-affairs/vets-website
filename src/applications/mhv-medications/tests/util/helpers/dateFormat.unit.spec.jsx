import { expect } from 'chai';
import { FIELD_NONE_NOTED } from '../../../util/constants';
import { dateFormat } from '../../../util/helpers';

describe('Date Format function', () => {
  it("should return 'None noted' when no values are passed", () => {
    expect(dateFormat()).to.equal(FIELD_NONE_NOTED);
  });
  it('should return a formatted date', () => {
    expect(dateFormat('2023-10-26T20:18:00.000Z', 'MMMM D, YYYY')).to.equal(
      'October 26, 2023',
    );
  });
});
