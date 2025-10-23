import { expect } from 'chai';
import { translateDatePeriod } from '../../helpers';

describe('translateDatePeriod', () => {
  it('correctly formats and concatenates date periods into MM/DD/YYYY format', () => {
    expect(translateDatePeriod('2023-01-01', '2023-01-31')).to.equal(
      '01/01/2023 - 01/31/2023',
    );
    expect(translateDatePeriod('2022-02-15', '2022-02-20')).to.equal(
      '02/15/2022 - 02/20/2022',
    );
    expect(translateDatePeriod('2021-12-25', '2022-01-05')).to.equal(
      '12/25/2021 - 01/05/2022',
    );
  });
});
