import { expect } from 'chai';
import { replaceDashesWithSlashes } from '../../../utils/date-formatting/helpers';

describe('replaceDashesWithSlashes function', () => {
  it('should replace the dashes in a string with slashes', () => {
    expect(replaceDashesWithSlashes('2023-10-23')).to.equal('2023/10/23');
  });
});
