import { expect } from 'chai';
import { normalizeFullName, replaceStrValues } from '../../../../utils/helpers';

describe('CG `normalizeFullName` method', () => {
  const fullName = {
    first: 'John',
    middle: 'David',
    last: 'Smith',
    suffix: 'Jr.',
  };
  const testCases = [
    {
      title:
        'should gracefully return an empty string when name object is omitted from the function',
      input: undefined,
      expected: '',
    },
    {
      title:
        'should return first title, last name and suffix when the `outputMiddle` param is excluded',
      input: fullName,
      expected: 'John Smith Jr.',
    },
    {
      title:
        'should return first title, last name and suffix when `outputMiddle` is set to `false`',
      input: fullName,
      options: false,
      expected: 'John Smith Jr.',
    },
    {
      title:
        'should return first title, middle title, last name and suffix when `outputMiddle` is set to `true`',
      input: fullName,
      options: true,
      expected: 'John David Smith Jr.',
    },
    {
      title:
        'should return first title, last name and suffix when middle name is `null`',
      input: { ...fullName, middle: null },
      options: true,
      expected: 'John Smith Jr.',
    },
  ];

  testCases.forEach(({ title, input, options, expected }) => {
    it(title, () => expect(normalizeFullName(input, options)).to.eq(expected));
  });
});

describe('CG `replaceStrValues` method', () => {
  const testCases = [
    {
      title:
        'should successfully replace the placeholder when the value is a string',
      input: ['Hello, %s!', 'World'],
      expected: 'Hello, World!',
    },
    {
      title:
        'should successfully replace the placeholders when the value is an array',
      input: ['Hello, %s! My name is %s.', ['World', 'John Smith']],
      expected: 'Hello, World! My name is John Smith.',
    },
    {
      title:
        'should successfully replace a custom placeholder with the given value',
      input: ['Value is %d', '42', '%d'],
      expected: 'Value is 42',
    },
    {
      title: 'should return an empty string if the source is null',
      input: [null, 'Test'],
      expected: '',
    },
    {
      title: 'should return an empty string if the source is undefined',
      input: [undefined, 'Test'],
      expected: '',
    },
    {
      title: 'should return an empty string if the value is null',
      input: ['Hello, %s!', null],
      expected: '',
    },
    {
      title: 'should return an empty string if the value is undefined',
      input: ['Hello, %s!', undefined],
      expected: '',
    },
    {
      title: 'should return an empty string if both source and value are null',
      input: [null, null],
      expected: '',
    },
    {
      title:
        'should return an empty string if both source and value are undefined',
      input: [undefined, undefined],
      expected: '',
    },
  ];

  testCases.forEach(({ title, input, expected }) => {
    it(title, () => expect(replaceStrValues(...input)).to.eq(expected));
  });
});
