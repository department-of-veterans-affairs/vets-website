const path = require('path');
const { expect } = require('chai');
const sinon = require('sinon');
const {
  combineItemsInIndexedObject,
  createLink,
  getWysiwygString,
  unescapeUnicode,
  createMetaTagArray,
  partialSchema,
  findMatchingEntities,
  entityObjectForKey,
} = require('../transformers/helpers');

describe('CMS export transformer helpers', () => {
  describe('getWysiwygString', () => {
    it('should transform wysiwyg strings', () => {
      const raw =
        '<p>If you need support for a specific mental health problem\u2014or if you\u2019re having problems sleeping, controlling your anger, or readjusting to civilian life\u2014you are not alone. And we can help.</p>\r\n\r\n';

      const transformed =
        '<p>If you need support for a specific mental health problem—or if you’re having problems sleeping, controlling your anger, or readjusting to civilian life—you are not alone. And we can help.</p>\r\n\r\n';

      expect(getWysiwygString(raw)).to.equal(transformed);
    });
  });

  describe('combineItemsInIndexedObject', () => {
    it('turns an index-keyed object into an array', () => {
      /* eslint-disable quote-props */
      const obj = {
        '1': ['world'],
        '0': ['hello'],
      };
      /* eslint-enable quote-props */
      const arr = [['hello'], ['world']];

      expect(combineItemsInIndexedObject(obj)).to.deep.equal(arr);
    });

    it('keeps an array as an array', () => {
      expect(combineItemsInIndexedObject([['hello'], ['world']])).to.deep.equal(
        [['hello'], ['world']],
      );
    });
  });

  describe('unescapeUnicode', () => {
    // These examples came from the tome-sync content
    // rg --no-filename ".*(\\\u\d{2,4}).*" -r '$1' | sort | uniq
    it('should translate unicode code points into unicode characters', () => {
      const pairs = [
        ['\\u200', 'Ȁ'],
        ['\\u201', 'ȁ'],
        ['\\u2012', '‒'],
        ['\\u2013', '–'],
        ['\\u2014', '—'],
        ['\\u2019', '’'],
        ['\\u2022', '•'],
        ['\\u2026', '…'],
        ['\\u2122', '™'],
        ['\\u3000', '　'],
      ];
      pairs.forEach(([codePoint, character]) => {
        // Make sure it replaces all instances in a string, not just the first
        expect(unescapeUnicode(`a ${codePoint} ${codePoint} a`)).to.equal(
          `a ${character} ${character} a`,
        );
      });
    });
  });

  describe('createLink', () => {
    it('should return null for an empty array', () => {
      expect(createLink([])).to.equal(null);
    });

    it('returns a properly formatted link object', () => {
      const fieldLink = [
        {
          uri: 'foo',
          title: 'Hello, World!',
          options: ['big'],
        },
      ];

      expect(createLink(fieldLink)).to.deep.equal({
        url: {
          path: 'foo',
        },
        title: 'Hello, World!',
        options: ['big'],
      });
    });

    it('can select only part of the returned object properties', () => {
      const fieldLink = [
        {
          uri: 'foo',
          title: 'Hello, World!',
          options: ['big'],
        },
      ];

      const urlOnly = ['url'];
      const titleOnly = ['title'];

      expect(createLink(fieldLink, urlOnly)).to.deep.equal({
        url: {
          path: 'foo',
        },
      });

      expect(createLink(fieldLink, titleOnly)).to.deep.equal({
        title: 'Hello, World!',
      });

      expect(createLink(fieldLink, [...urlOnly, ...titleOnly])).to.deep.equal({
        url: {
          path: 'foo',
        },
        title: 'Hello, World!',
      });
    });
  });

  describe('createMetaTagArray', () => {
    it('should create all the tags', () => {
      /* eslint-disable camelcase */
      const raw = {
        title:
          'VA Pittsburgh health care | Veterans Town Hall on the Move | Veterans Affairs',
        twitter_cards_type: 'summary_large_image',
        og_site_name: 'Veterans Affairs',
        twitter_cards_description:
          'VA Pittsburgh Healthcare System Interim Director Barbara Forsha invites you to attend the Town Hall event. Veterans, their families and the public are welcome to attend.',
        description:
          'VA Pittsburgh Healthcare System Interim Director Barbara Forsha invites you to attend the Town Hall event. Veterans, their families and the public are welcome to attend.',
        twitter_cards_title:
          'Veterans Town Hall on the Move | VA Pittsburgh health care | Veterans Affairs',
        twitter_cards_site: '@DeptVetAffairs',
        og_title:
          'Veterans Town Hall on the Move | VA Pittsburgh health care | Veterans Affairs',
        og_description:
          'VA Pittsburgh Healthcare System Interim Director Barbara Forsha invites you to attend the Town Hall event. Veterans, their families and the public are welcome to attend.',
        og_image_height: '314',
      };
      /* eslint-enable camelcase */

      const transformed = [
        {
          __typename: 'MetaValue',
          key: 'title',
          value:
            'VA Pittsburgh health care | Veterans Town Hall on the Move | Veterans Affairs',
        },
        {
          __typename: 'MetaValue',
          key: 'twitter:card',
          value: 'summary_large_image',
        },
        {
          __typename: 'MetaProperty',
          key: 'og:site_name',
          value: 'Veterans Affairs',
        },
        {
          __typename: 'MetaValue',
          key: 'twitter:description',
          value:
            'VA Pittsburgh Healthcare System Interim Director Barbara Forsha invites you to attend the Town Hall event. Veterans, their families and the public are welcome to attend.',
        },
        {
          __typename: 'MetaValue',
          key: 'description',
          value:
            'VA Pittsburgh Healthcare System Interim Director Barbara Forsha invites you to attend the Town Hall event. Veterans, their families and the public are welcome to attend.',
        },
        {
          __typename: 'MetaValue',
          key: 'twitter:title',
          value:
            'Veterans Town Hall on the Move | VA Pittsburgh health care | Veterans Affairs',
        },
        {
          __typename: 'MetaValue',
          key: 'twitter:site',
          value: '@DeptVetAffairs',
        },
        {
          __typename: 'MetaProperty',
          key: 'og:title',
          value:
            'Veterans Town Hall on the Move | VA Pittsburgh health care | Veterans Affairs',
        },
        {
          __typename: 'MetaProperty',
          key: 'og:description',
          value:
            'VA Pittsburgh Healthcare System Interim Director Barbara Forsha invites you to attend the Town Hall event. Veterans, their families and the public are welcome to attend.',
        },
        {
          __typename: 'MetaProperty',
          key: 'og:image:height',
          value: '314',
        },
      ];

      expect(createMetaTagArray(raw)).to.deep.equal(transformed);
    });

    it('should omit tags with no value', () => {
      const raw = {
        title: 'foo',
      };

      const transformed = [
        {
          __typename: 'MetaValue',
          key: 'title',
          value: 'foo',
        },
      ];

      expect(createMetaTagArray(raw)).to.deep.equal(transformed);
    });

    it('should ignore unrecognized tags', () => {
      const raw = { unknown: 'Dunno' };
      const transformed = [];
      expect(createMetaTagArray(raw)).to.deep.equal(transformed);
    });
  });

  describe('partialSchema', () => {
    it('Should throw an error when a non-object schema is passed', () => {
      expect(() => partialSchema({ type: 'array' })).to.throw();
      expect(() => partialSchema(['invalid schema'])).to.throw();
    });

    it('Should throw an error when properties is not an array', () => {
      expect(() =>
        partialSchema({ type: 'object' }, { foo: 'invalid properties' }),
      ).to.throw();
    });

    it('Should throw an error when properties contains non-strings', () => {
      expect(() =>
        partialSchema({ type: 'object' }, [{ invalid: 'prop name' }]),
      ).to.throw();
    });

    it('Should throw an error when a property specified is missing from the schema', () => {
      expect(() =>
        partialSchema(
          { type: 'object', properties: { stuff: { type: 'string' } } },
          ['thingy'],
        ),
      ).to.throw();
    });

    it('should omit $id', () => {
      const schema = {
        $id: 'foo',
        type: 'object',
        properties: {
          foo: { type: 'string' },
        },
      };
      expect(partialSchema(schema, ['foo'])).to.deep.equal({
        type: 'object',
        properties: {
          foo: { type: 'string' },
        },
      });
    });

    it('should keep only the properties listed', () => {
      const schema = {
        $id: 'foo',
        type: 'object',
        properties: {
          foo: { type: 'string' },
          var: { type: 'string' },
        },
      };
      expect(partialSchema(schema, ['foo'])).to.deep.equal({
        type: 'object',
        properties: {
          foo: { type: 'string' },
        },
      });
    });

    it('should remove unused properties from the required array', () => {
      const schema = {
        $id: 'foo',
        type: 'object',
        properties: {
          foo: { type: 'string' },
          var: { type: 'string' },
        },
        required: ['foo', 'bar'],
      };
      expect(partialSchema(schema, ['foo'])).to.deep.equal({
        type: 'object',
        properties: {
          foo: { type: 'string' },
        },
        required: ['foo'],
      });
    });
  });

  describe('findMatchingEntities', () => {
    const contentDir = path.join(__dirname, 'helper-test-entities');

    it('should reject non-string baseTypes', () => {
      expect(() => findMatchingEntities(123, contentDir, () => {})).to.throw();
    });

    it('should reject paths to a non-existent directory', () => {
      // Path to nothing
      expect(() =>
        findMatchingEntities(
          path.join(__dirname, 'this-directory-does-not-exist'),
          'node',
          () => {},
        ),
      ).to.throw();
      // Path to a file
      expect(() =>
        findMatchingEntities('node', __filename, () => {}),
      ).to.throw();
    });

    it('should reject a truthy non-string subType', () => {
      expect(() =>
        findMatchingEntities('node', contentDir, () => {}, { subType: 123 }),
      ).to.throw();
    });

    it('should reject a truthy non-function filter', () => {
      expect(() =>
        findMatchingEntities('node', contentDir, () => {}, { filter: 123 }),
      ).to.throw();
    });

    it('should return all (and only) entities of a baseType', () => {
      expect(findMatchingEntities('node', contentDir, () => {})).to.have.length(
        3,
      );
    });

    it('should return only entities of a baseType and subType', () => {
      expect(
        findMatchingEntities('node', contentDir, () => {}, {
          subType: 'some_type',
        }),
      ).to.have.length(2);
    });

    it('should filter out entities not passing the filter function', () => {
      expect(
        findMatchingEntities('node', contentDir, () => {}, {
          subType: 'some_type',
          filter: e => e.field_keep_me,
        }),
      ).to.have.length(1);
    });

    it('should transform the entities', () => {
      const spy = sinon.spy();
      findMatchingEntities('node', contentDir, spy, {
        subType: 'some_type',
        filter: e => e.field_keep_me,
      });
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('entityObjectForKey', () => {
    it('Returns an object with a single key "entity" and value entity[key][0]', () => {
      const testEntity = {
        foo: [{ bar: 1 }],
      };
      expect(entityObjectForKey(testEntity, 'foo')).to.deep.equal({
        entity: { bar: 1 },
      });
    });

    it('Returns null if entity is null', () => {
      expect(entityObjectForKey(null, 'foo')).to.be.null;
    });

    it('Returns null if entity[key] is null', () => {
      expect(entityObjectForKey({}, 'foo')).to.be.null;
    });
  });
});
