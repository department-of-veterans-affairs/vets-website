import { expect } from 'chai';
import {
  toSlug,
  getEditButtonFromHash,
  getScrollTarget,
} from '../../util/hashUtils';

describe('contact-information hashUtils', () => {
  describe('toSlug', () => {
    it('normalizes punctuation and case', () => {
      expect(toSlug('Home Phone #')).to.equal('home-phone');
      expect(toSlug('Edit   Mailing   Address!')).to.equal(
        'edit-mailing-address',
      );
    });
    it('collapses multiple separators', () => {
      expect(toSlug('A--B__C***D')).to.equal('a-b-c-d');
    });
    it('handles empty/undefined safely', () => {
      expect(toSlug('')).to.equal('');
      expect(toSlug(undefined)).to.equal('');
      expect(toSlug(null)).to.equal('');
    });
  });

  describe('getEditButtonFromHash', () => {
    let root;
    beforeEach(() => {
      root = document.createElement('div');
      document.body.appendChild(root);
    });
    afterEach(() => {
      document.body.removeChild(root);
    });

    const addButton = label => {
      const btn = document.createElement('va-button');
      btn.setAttribute('label', label);
      root.appendChild(btn);
      return btn;
    };

    it('returns null for non edit hash', () => {
      expect(getEditButtonFromHash('#home-phone', root)).to.equal(null);
    });

    it('matches direct id when present', () => {
      const direct = document.createElement('div');
      direct.id = 'edit-email-address';
      root.appendChild(direct);
      expect(getEditButtonFromHash('#edit-email-address', root)).to.equal(
        direct,
      );
    });

    it('matches by normalized label (leading Edit stripped)', () => {
      const btn = addButton('Edit Home Phone');
      expect(getEditButtonFromHash('#edit-home-phone', root)).to.equal(btn);
    });

    it('normalizes complex label spacing/punctuation', () => {
      const btn = addButton('Edit   Mailing Address (Primary)');
      expect(
        getEditButtonFromHash('#edit-mailing-address-primary', root),
      ).to.equal(btn);
    });

    it('does not strip internal "edit" words (only leading)', () => {
      const btn = addButton('Primary Editor Contact');
      // slug becomes 'primary-editor-contact'; hash must match that
      expect(
        getEditButtonFromHash('#edit-primary-editor-contact', root),
      ).to.equal(btn);
    });

    it('returns null when no matching button', () => {
      addButton('Edit Home Phone');
      expect(getEditButtonFromHash('#edit-something-else', root)).to.equal(
        null,
      );
    });
  });

  describe('getScrollTarget', () => {
    let root;
    beforeEach(() => {
      root = document.createElement('div');
      document.body.appendChild(root);
    });
    afterEach(() => {
      document.body.removeChild(root);
    });

    it('transforms edit hash to legacy anchor', () => {
      const legacy = document.createElement('section');
      legacy.id = 'home-phone';
      root.appendChild(legacy);
      expect(getScrollTarget('#edit-home-phone', root)).to.equal(legacy);
    });

    it('returns element for non edit hash unchanged', () => {
      const el = document.createElement('div');
      el.id = 'mailing-address';
      root.appendChild(el);
      expect(getScrollTarget('#mailing-address', root)).to.equal(el);
    });

    it('returns null when element missing', () => {
      expect(getScrollTarget('#edit-non-existent', root)).to.equal(null);
    });
  });
});
