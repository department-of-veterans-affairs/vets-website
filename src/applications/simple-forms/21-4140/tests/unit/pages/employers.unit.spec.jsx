import { expect } from 'chai';

import { options } from '../../../pages/employers';

describe(`employers options`, () => {
  it('has item with all fields', () => {
    const item = { employerName: '', employmentDates: { from: '' } };
    expect(options.isItemIncomplete(item)).to.be.true;
    const item2 = {
      employerName: 'placeholder',
      employmentDates: { from: '12-19-1905' },
    };
    expect(options.isItemIncomplete(item2)).to.be.false;
  });

  it('retrieves right name from getItenName helper', () => {
    const item = { employerName: 'placeholder' };
    expect(options.text.getItemName(item, 0)).to.equal('placeholder');
    const item2 = {};
    expect(options.text.getItemName(item2, 0)).to.equal('Employer 1');
  });

  it('gets the summary description', () => {
    expect(options.text.summaryDescription()).to.equal(
      'You can add up to 4 employers.',
    );
  });

  it('gets the right card description', () => {
    const item = {
      employmentDates: { from: '12-12-2003', to: '01-01-2004' },
    };
    expect(options.text.cardDescription(item)).to.equal(
      '12-12-2003 to 01-01-2004',
    );
    const item1 = {
      employmentDates: { from: 'invalid date', to: 'invalid date' },
    };
    expect(options.text.cardDescription(item1)).to.equal(
      'invalid date to invalid date',
    );

    const item2 = {};
    expect(options.text.cardDescription(item2)).to.equal('');
  });
});
