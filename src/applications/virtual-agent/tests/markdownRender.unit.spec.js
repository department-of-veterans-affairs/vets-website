import MarkdownRenderer from '../components/webchat/markdownRenderer';
import { expect } from 'chai';

describe('rendering telephone numbers', () => {
  it('should not add aria-label to non-tel links', () => {
    expect(MarkdownRenderer.render('[hi](http://example.com)')).to.not.include(
      'aria-label',
    );
  });

  it('should not add aria-label to links with no scheme', () => {
    expect(MarkdownRenderer.render('[hi](example.com)')).to.not.include(
      'aria-label',
    );
  });

  it('should handle links inside text blocks', () => {
    expect(
      MarkdownRenderer.render('howdy there have you seen [this](tel:922)'),
    ).to.include('aria-label="9 2 2."');
  });

  it('should handle multiple links', () => {
    expect(MarkdownRenderer.render('have [you](tel:011) seen [this](tel:922)'))
      .to.include('aria-label="9 2 2."')
      .and.include('aria-label="0 1 1."');
  });

  [
    {
      phoneNumberLink: '911',
      expectedLabel: '9 1 1.',
    },
    {
      phoneNumberLink: '1112223333',
      expectedLabel: '1 1 1. 2 2 2. 3 3 3 3.',
    },
    {
      phoneNumberLink: '11112223333',
      expectedLabel: '1. 1 1 1. 2 2 2. 3 3 3 3.',
    },
    {
      phoneNumberLink: '2223333',
      expectedLabel: '2 2 2. 3 3 3 3.',
    },
    {
      phoneNumberLink: '1-800-234-1234',
      expectedLabel: '1. 8 0 0. 2 3 4. 1 2 3 4.',
    },
    {
      phoneNumberLink: '+12223334444',
      expectedLabel: '1. 2 2 2. 3 3 3. 4 4 4 4.',
    },
    {
      phoneNumberLink: '+1(222)333-4444',
      expectedLabel: '1. 2 2 2. 3 3 3. 4 4 4 4.',
    },
  ].forEach(({ phoneNumberLink, expectedLabel }) => {
    it(`should add aria label for ${phoneNumberLink}`, () => {
      expect(
        MarkdownRenderer.render(`[hi](tel:${phoneNumberLink})`),
      ).to.include(`aria-label="${expectedLabel}"`);
    });
  });
});
