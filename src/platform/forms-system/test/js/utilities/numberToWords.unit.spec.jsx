import { expect } from 'chai';

import numberToWords from '../../../src/js/utilities/data/numberToWords';

describe('Convert numbers to words', () => {
  it('should return the original value for non-numbers', () => {
    expect(numberToWords('')).to.eql('');
    expect(numberToWords()).to.be.undefined;
    expect(numberToWords(null)).to.be.null;
    expect(numberToWords(NaN)).to.be.NaN;
    expect(numberToWords('foo')).to.eql('foo');
    expect(numberToWords('bar 1')).to.eql('bar 1');
    expect(numberToWords('1 baz')).to.eql('1 baz');
    expect(numberToWords(true)).to.eql(true);
    expect(numberToWords(false)).to.eql(false);
  });

  it('should return the original value for out of range numbers & fractions', () => {
    expect(numberToWords(-1)).to.eql(-1);
    expect(numberToWords(0)).to.eql(0);
    expect(numberToWords(0.5)).to.eql(0.5);
    expect(numberToWords(1.5)).to.eql(1.5);
    expect(numberToWords(Infinity)).to.eql(Infinity);
  });

  it('should return preset values of numbers less than 21', () => {
    expect(numberToWords(1)).to.eql('first');
    expect(numberToWords(2)).to.eql('second');
    expect(numberToWords(3)).to.eql('third');
    expect(numberToWords(4)).to.eql('fourth');
    expect(numberToWords(5)).to.eql('fifth');
    expect(numberToWords(6)).to.eql('sixth');
    expect(numberToWords(7)).to.eql('seventh');
    expect(numberToWords(8)).to.eql('eighth');
    expect(numberToWords(9)).to.eql('ninth');
    expect(numberToWords(10)).to.eql('tenth');
    expect(numberToWords(11)).to.eql('eleventh');
    expect(numberToWords(12)).to.eql('twelveth');
    expect(numberToWords(13)).to.eql('thirteenth');
    expect(numberToWords(14)).to.eql('fourteenth');
    expect(numberToWords(15)).to.eql('fifteenth');
    expect(numberToWords(16)).to.eql('sixteenth');
    expect(numberToWords(17)).to.eql('seventeenth');
    expect(numberToWords(18)).to.eql('eighteenth');
    expect(numberToWords(19)).to.eql('nineteenth');
    expect(numberToWords(20)).to.eql('twentieth');
  });

  it('should generate numbers between 21 and 40', () => {
    expect(numberToWords(21)).to.eql('twenty-first');
    expect(numberToWords(22)).to.eql('twenty-second');
    expect(numberToWords(23)).to.eql('twenty-third');
    expect(numberToWords(24)).to.eql('twenty-fourth');
    expect(numberToWords(25)).to.eql('twenty-fifth');
    expect(numberToWords(26)).to.eql('twenty-sixth');
    expect(numberToWords(27)).to.eql('twenty-seventh');
    expect(numberToWords(28)).to.eql('twenty-eighth');
    expect(numberToWords(29)).to.eql('twenty-ninth');
    expect(numberToWords(30)).to.eql('thirtieth');
    expect(numberToWords(31)).to.eql('thirty-first');
    expect(numberToWords(32)).to.eql('thirty-second');
    expect(numberToWords(33)).to.eql('thirty-third');
    expect(numberToWords(34)).to.eql('thirty-fourth');
    expect(numberToWords(35)).to.eql('thirty-fifth');
    expect(numberToWords(36)).to.eql('thirty-sixth');
    expect(numberToWords(37)).to.eql('thirty-seventh');
    expect(numberToWords(38)).to.eql('thirty-eighth');
    expect(numberToWords(39)).to.eql('thirty-ninth');
  });

  it('should add an appropriate suffix to numbers >= 40', () => {
    expect(numberToWords(40)).to.eql('40th');
    expect(numberToWords(41)).to.eql('41st');
    expect(numberToWords(42)).to.eql('42nd');
    expect(numberToWords(43)).to.eql('43rd');
    expect(numberToWords(44)).to.eql('44th');
    expect(numberToWords(99)).to.eql('99th');
    expect(numberToWords(100)).to.eql('100th');
    expect(numberToWords(1003)).to.eql('1003rd');
  });
});
