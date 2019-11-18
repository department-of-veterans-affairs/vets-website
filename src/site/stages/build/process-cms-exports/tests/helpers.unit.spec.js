const { expect } = require('chai');
const transformerHelpers = require('../transformers/helpers');

describe('CMS export transformer helpers', () => {
  describe('getWysiwygString', () => {
    const raw =
      '<p>If you need support for a specific mental health problem\u2014or if you\u2019re having problems sleeping, controlling your anger, or readjusting to civilian life\u2014you are not alone. And we can help.</p>\r\n\r\n';

    const transformed =
      '<p>If you need support for a specific mental health problem—or if you’re having problems sleeping, controlling your anger, or readjusting to civilian life—you are not alone. And we can help.</p>\n\n';

    it('transforms wysiwyg strings', () => {
      expect(transformerHelpers.getWysiwygString(raw)).to.equal(transformed);
    });
  });
});
