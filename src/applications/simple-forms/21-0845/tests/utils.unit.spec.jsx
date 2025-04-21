import { expect } from 'chai';

import {
  getFullNameString,
  camelCaseToSnakeAllCaps,
  snakeAllCapsToCamelCase,
  getLabelsFromConstants,
  getEnumsFromConstants,
} from '../utils';

describe('getFullNameString', () => {
  it('Returns the full name when a middle name is provided', () => {
    const fullName = {
      first: 'John',
      middle: 'Doe',
      last: 'Smith',
    };
    expect(getFullNameString(fullName)).to.equal('John Doe Smith');
  });

  it('Returns the full name when no middle name is provided', () => {
    const fullName = {
      first: 'John',
      last: 'Smith',
    };
    expect(getFullNameString(fullName)).to.equal('John Smith');
  });
});

describe('camelCaseToSnakeAllCaps', () => {
  it('Converts camelCase to SNAKE_CASE', () => {
    const input = 'camelCaseString';
    expect(camelCaseToSnakeAllCaps(input)).to.equal('CAMEL_CASE_STRING');
  });

  it('Handles single words', () => {
    const input = 'word';
    expect(camelCaseToSnakeAllCaps(input)).to.equal('WORD');
  });

  it('Handles empty strings', () => {
    const input = '';
    expect(camelCaseToSnakeAllCaps(input)).to.equal('');
  });

  it('Handles strings with no camel casing', () => {
    const input = 'nocamelcasing';
    expect(camelCaseToSnakeAllCaps(input)).to.equal('NOCAMELCASING');
  });
});

describe('snakeAllCapsToCamelCase', () => {
  it('Converts SNAKE_CASE to camelCase', () => {
    const input = 'SNAKE_CASE_STRING';
    expect(snakeAllCapsToCamelCase(input)).to.equal('snakeCaseString');
  });

  it('Handles single words', () => {
    const input = 'WORD';
    expect(snakeAllCapsToCamelCase(input)).to.equal('word');
  });

  it('Handles empty strings', () => {
    const input = '';
    expect(snakeAllCapsToCamelCase(input)).to.equal('');
  });

  it('Handles strings with no snake casing', () => {
    const input = 'NOSNAKECASING';
    expect(snakeAllCapsToCamelCase(input)).to.equal('nosnakecasing');
  });
});

describe('getLabelsFromConstants', () => {
  it('should convert SNAKE_CASE keys to camelCase', () => {
    const constants = {
      KEY_A: 'Value A',
      KEY_B: 'Value B',
      KEY_C: 'Value C',
    };
    const expected = {
      keyA: 'Value A',
      keyB: 'Value B',
      keyC: 'Value C',
    };
    expect(getLabelsFromConstants(constants)).to.deep.equal(expected);
  });

  it('should handle empty objects', () => {
    const constants = {};
    const expected = {};
    expect(getLabelsFromConstants(constants)).to.deep.equal(expected);
  });
});

describe('getEnumsFromConstants', () => {
  it('should convert SNAKE_CASE keys to an array of camelCase strings', () => {
    const constants = {
      KEY_A: 'Value A',
      KEY_B: 'Value B',
      KEY_C: 'Value C',
    };
    const expected = ['keyA', 'keyB', 'keyC'];
    expect(getEnumsFromConstants(constants)).to.deep.equal(expected);
  });

  it('should handle empty objects', () => {
    const constants = {};
    const expected = [];
    expect(getEnumsFromConstants(constants)).to.deep.equal(expected);
  });
});
