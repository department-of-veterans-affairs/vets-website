const { expect } = require('chai');
const {
  combineItemsInIndexedObject,
  getWysiwygString,
  unescapeUnicode,
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
});
