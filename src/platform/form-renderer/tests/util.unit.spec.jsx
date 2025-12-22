import { getNestedProperty, renderStr } from '../util';

describe('getNestedProperty', () => {
  it('should retrieve a nested property', () => {
    expect(getNestedProperty({ a: { b: 1, c: 2 } }, 'a.b')).toBe(1);
  });

  it('should return undefined for missing properties', () => {
    expect(getNestedProperty({ a: { b: 1, c: 2 } }, 'a.b.c')).toBeUndefined();
  });
});

describe('renderStr', () => {
  const data = {
    ssn: '123456789',
    birthdate: '1970-01-01',
    address: {
      street: '123 Main Street',
      city: 'Anytown',
      state: 'NY',
      postal: '12345',
    },
    valid: true,
  };

  it('should render a nested property', () => {
    expect(renderStr('I <3 {{address.state}}', data)).toBe('I <3 NY');
  });

  it('should render a redacted SSN', () => {
    expect(renderStr('{{lastFour ssn}}', data)).toBe('6789');
  });

  it('should render a localized date string', () => {
    expect(renderStr('{{formatDate birthdate}}', data)).toBe('January 1, 1970');
  });

  it('should render a boolean', () => {
    expect(renderStr("{{formatBool valid 'Valid' 'Invalid'}}", data)).toBe(
      'Valid',
    );
  });
});
