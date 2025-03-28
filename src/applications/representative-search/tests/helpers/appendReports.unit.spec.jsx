import { expect } from 'chai';
import { appendReportsFromLocalStorage } from '../../utils/helpers';

describe('appendReportsFromLocalStorage', () => {
  it('should return the original results array when localStorage is empty', () => {
    const resultsArray = [{ id: 1, reports: [] }, { id: 2, reports: [] }];

    global.localStorage.getItem = () => null;

    const updatedResultsArray = appendReportsFromLocalStorage(resultsArray);

    expect(updatedResultsArray).to.deep.equal(resultsArray);
  });

  it('should only output report items with matching representativeId', () => {
    localStorage.setItem(
      'vaReports',
      '[{"representativeId":"28162","reports":{"address":"1521 Scottsdale Ave Columbus, OH 43235","otherComment":"test"}}, {"representativeId":"28164","reports":{"address":"1531 Michigan Ave Cleveland, OH 48295","otherComment":"another test"}}]',
    );

    const resultsArray = [{ representativeId: '28162' }];

    const output = appendReportsFromLocalStorage(resultsArray);
    const expectedOutput = [{ representativeId: '28162' }];
    expect(output).to.eql(expectedOutput);
  });
});
