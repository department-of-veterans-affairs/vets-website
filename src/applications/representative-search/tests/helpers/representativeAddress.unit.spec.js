import { expect } from 'chai';
import { titleCaseRepresentativeName } from '../../utils/representativeAddress';

describe('titleCaseRepresentativeName', () => {
  it('Should convert all caps to title case', () => {
    const actual = titleCaseRepresentativeName(
      'FAYETTEVILLE VA MEDICAL CENTER',
    );
    expect(actual).to.equal('Fayetteville VA Medical Center');
  });
});
