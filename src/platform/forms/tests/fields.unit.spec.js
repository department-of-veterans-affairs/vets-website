import { dirtyAllFields, makeField } from '../fields';

describe('fields model', () => {
  test('field creation method defaults to clean', () => {
    const field = makeField('hi');
    expect(field)
      .toHaveProperty('value')
      .toBe('hi');
    expect(field).toBe(false);
  });

  describe('dirtyAllFields', () => {
    test('handles base cases', () => {
      const result = dirtyAllFields({
        a: makeField(1),
        b: makeField(''),
        c: makeField('str'),
        d: makeField(true),
        f: 5,
        g: false,
        h: null,
        i: undefined,
      });
      expect(result).toEqual({
        a: makeField(1, true),
        b: makeField('', true),
        c: makeField('str', true),
        d: makeField(true, true),
        f: 5,
        g: false,
        h: null,
        i: undefined,
      });
      expect(dirtyAllFields(makeField(1))).toEqual(makeField(1, true));
      expect(dirtyAllFields([])).toEqual([]);
      expect(dirtyAllFields({ a: [1] })).toEqual({ a: [1] });
    });

    test('handles nested objects', () => {
      const result = dirtyAllFields({
        a: {
          foo: makeField('1'),
          bar: makeField(''),
          baz: makeField(3),
          qux: 5,
          quux: false,
          corge: null,
          grault: undefined,
        },
        b: { foo: makeField(1) }, // Ensure multiple objects get processed.
      });
      expect(result).toEqual({
        a: {
          foo: makeField('1', true),
          bar: makeField('', true),
          baz: makeField(3, true),
          qux: 5,
          quux: false,
          corge: null,
          grault: undefined,
        },
        b: { foo: makeField(1, true) },
      });
    });

    test('handles arrays', () => {
      const result = dirtyAllFields({
        a: [
          { foo: makeField('1') },
          { bar: makeField('') },
          { baz: makeField(3) },
          { qux: 5 },
          { quux: false },
          { corge: null },
          { grault: undefined },
        ],
        b: [{ foo: makeField(1) }], // ensure multiple arrays get processed.
      });
      expect(result).toEqual({
        a: [
          { foo: makeField('1', true) },
          { bar: makeField('', true) },
          { baz: makeField(3, true) },
          { qux: 5 },
          { quux: false },
          { corge: null },
          { grault: undefined },
        ],
        b: [{ foo: makeField(1, true) }],
      });
    });
  });
});
