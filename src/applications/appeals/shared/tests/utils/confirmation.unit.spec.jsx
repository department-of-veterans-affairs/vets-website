import { expect } from 'chai';

import { showValueOrNotSelected } from '../../utils/confirmation';

describe('showValueOrNotSelected', () => {
  it('should return "Yes" for truthy values', () => {
    expect(showValueOrNotSelected(true)).to.eq('Yes');
    expect(showValueOrNotSelected(1)).to.eq('Yes');
    expect(showValueOrNotSelected('foo')).to.eq('Yes');
  });
  it('should return "No" for falsy values', () => {
    expect(showValueOrNotSelected(false)).to.eq('No');
    expect(showValueOrNotSelected(0)).to.eq('No');
    expect(showValueOrNotSelected('')).to.eq('No');
  });
  it('should return "Not selected" for undefined & null values', () => {
    expect(showValueOrNotSelected(null)).to.eq('Not selected');
    expect(showValueOrNotSelected()).to.eq('Not selected');
  });

  it('should return "Yep" for truthy values', () => {
    expect(showValueOrNotSelected(true, 'Yep', 'Nope')).to.eq('Yep');
    expect(showValueOrNotSelected(1, 'Yep', 'Nope')).to.eq('Yep');
    expect(showValueOrNotSelected('foo', 'Yep', 'Nope')).to.eq('Yep');
  });
  it('should return "No" for falsy values', () => {
    expect(showValueOrNotSelected(false, 'Yep', 'Nope')).to.eq('Nope');
    expect(showValueOrNotSelected(0, 'Yep', 'Nope')).to.eq('Nope');
    expect(showValueOrNotSelected('', 'Yep', 'Nope')).to.eq('Nope');
  });
});
