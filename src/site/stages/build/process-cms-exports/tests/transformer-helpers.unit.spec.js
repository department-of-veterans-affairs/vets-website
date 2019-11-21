const { expect } = require('chai');
const { getWysiwygString } = require('../transformers/helpers');

describe('CMS export transformer helpers', () => {
  describe('getWysiwygString', () => {
    it('transforms wysiwyg strings', () => {
      const raw =
        '<p>If you need support for a specific mental health problem\u2014or if you\u2019re having problems sleeping, controlling your anger, or readjusting to civilian life\u2014you are not alone. And we can help.</p>\r\n\r\n';

      const transformed =
        '<p>If you need support for a specific mental health problem—or if you’re having problems sleeping, controlling your anger, or readjusting to civilian life—you are not alone. And we can help.</p>\r\n\r\n';

      expect(getWysiwygString(raw)).to.equal(transformed);
    });
  });
});
