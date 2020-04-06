import numberToWords from '../../../src/js/utilities/data/numberToWords';

describe('Convert numbers to words', () => {
  test('should return the original value for non-numbers', () => {
    expect(numberToWords('')).toBe('');
    expect(numberToWords()).toBeUndefined();
    expect(numberToWords(null)).toBeNull();
    expect(numberToWords(NaN)).toBeNaN();
    expect(numberToWords('foo')).toBe('foo');
    expect(numberToWords('bar 1')).toBe('bar 1');
    expect(numberToWords('1 baz')).toBe('1 baz');
    expect(numberToWords(true)).toBe(true);
    expect(numberToWords(false)).toBe(false);
  });

  test('should return the original value for out of range numbers & fractions', () => {
    expect(numberToWords(-1)).toEqual(-1);
    expect(numberToWords(0)).toBe(0);
    expect(numberToWords(0.5)).toBe(0.5);
    expect(numberToWords(1.5)).toBe(1.5);
    expect(numberToWords(Infinity)).toEqual(Infinity);
  });

  test('should return preset values of numbers less than 21', () => {
    expect(numberToWords(1)).toBe('first');
    expect(numberToWords(2)).toBe('second');
    expect(numberToWords(3)).toBe('third');
    expect(numberToWords(4)).toBe('fourth');
    expect(numberToWords(5)).toBe('fifth');
    expect(numberToWords(6)).toBe('sixth');
    expect(numberToWords(7)).toBe('seventh');
    expect(numberToWords(8)).toBe('eighth');
    expect(numberToWords(9)).toBe('ninth');
    expect(numberToWords(10)).toBe('tenth');
    expect(numberToWords(11)).toBe('eleventh');
    expect(numberToWords(12)).toBe('twelveth');
    expect(numberToWords(13)).toBe('thirteenth');
    expect(numberToWords(14)).toBe('fourteenth');
    expect(numberToWords(15)).toBe('fifteenth');
    expect(numberToWords(16)).toBe('sixteenth');
    expect(numberToWords(17)).toBe('seventeenth');
    expect(numberToWords(18)).toBe('eighteenth');
    expect(numberToWords(19)).toBe('nineteenth');
    expect(numberToWords(20)).toBe('twentieth');
  });

  test('should generate numbers between 21 and 40', () => {
    expect(numberToWords(21)).toBe('twenty-first');
    expect(numberToWords(22)).toBe('twenty-second');
    expect(numberToWords(23)).toBe('twenty-third');
    expect(numberToWords(24)).toBe('twenty-fourth');
    expect(numberToWords(25)).toBe('twenty-fifth');
    expect(numberToWords(26)).toBe('twenty-sixth');
    expect(numberToWords(27)).toBe('twenty-seventh');
    expect(numberToWords(28)).toBe('twenty-eighth');
    expect(numberToWords(29)).toBe('twenty-ninth');
    expect(numberToWords(30)).toBe('thirtieth');
    expect(numberToWords(31)).toBe('thirty-first');
    expect(numberToWords(32)).toBe('thirty-second');
    expect(numberToWords(33)).toBe('thirty-third');
    expect(numberToWords(34)).toBe('thirty-fourth');
    expect(numberToWords(35)).toBe('thirty-fifth');
    expect(numberToWords(36)).toBe('thirty-sixth');
    expect(numberToWords(37)).toBe('thirty-seventh');
    expect(numberToWords(38)).toBe('thirty-eighth');
    expect(numberToWords(39)).toBe('thirty-ninth');
  });

  test('should add an appropriate suffix to numbers >= 40', () => {
    expect(numberToWords(40)).toBe('40th');
    expect(numberToWords(41)).toBe('41st');
    expect(numberToWords(42)).toBe('42nd');
    expect(numberToWords(43)).toBe('43rd');
    expect(numberToWords(44)).toBe('44th');
    expect(numberToWords(99)).toBe('99th');
    expect(numberToWords(100)).toBe('100th');
    expect(numberToWords(1003)).toBe('1003rd');
  });
});
