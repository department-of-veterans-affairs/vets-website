const { expect } = require('chai');

const { formatViolations, defaultAxeConfig } = require('./axeCheck');

describe('Playwright axeCheck helpers (unit)', () => {
  describe('defaultAxeConfig', () => {
    it('includes Section 508 and WCAG tags', () => {
      const { values } = defaultAxeConfig.runOnly;
      expect(values).to.include('section508');
      expect(values).to.include('wcag2a');
      expect(values).to.include('wcag2aa');
      expect(values).to.include('wcag21a');
      expect(values).to.include('wcag21aa');
    });

    it('disables color-contrast rule', () => {
      expect(defaultAxeConfig.rules['color-contrast'].enabled).to.be.false;
    });

    it('enables heading rules', () => {
      expect(defaultAxeConfig.rules['empty-heading'].enabled).to.be.true;
      expect(defaultAxeConfig.rules['heading-order'].enabled).to.be.true;
      expect(defaultAxeConfig.rules['page-has-heading-one'].enabled).to.be.true;
    });
  });

  describe('formatViolations', () => {
    it('returns empty string for empty violations array', () => {
      expect(formatViolations([])).to.equal('');
    });

    it('formats a single violation with all fields', () => {
      const violations = [
        {
          id: 'label',
          impact: 'critical',
          description: 'Form elements must have labels',
          help: 'Ensure form elements have labels',
          helpUrl: 'https://example.com/label',
          nodes: [
            {
              target: ['input#name'],
              html: '<input id="name">',
            },
          ],
        },
      ];

      const result = formatViolations(violations);
      expect(result).to.include('[critical] label');
      expect(result).to.include('Form elements must have labels');
      expect(result).to.include('Help: Ensure form elements have labels');
      expect(result).to.include('URL: https://example.com/label');
      expect(result).to.include('input#name');
      expect(result).to.include('<input id="name">');
    });

    it('formats multiple violations separated by blank lines', () => {
      const violations = [
        {
          id: 'rule-a',
          impact: 'serious',
          description: 'Desc A',
          help: 'Help A',
          helpUrl: 'https://a.com',
          nodes: [{ target: ['#a'], html: '<div id="a">' }],
        },
        {
          id: 'rule-b',
          impact: 'moderate',
          description: 'Desc B',
          help: 'Help B',
          helpUrl: 'https://b.com',
          nodes: [{ target: ['#b'], html: '<div id="b">' }],
        },
      ];

      const result = formatViolations(violations);
      expect(result).to.include('[serious] rule-a');
      expect(result).to.include('[moderate] rule-b');
      // Separated by double newline
      expect(result).to.include('\n\n');
    });

    it('formats multiple nodes within a single violation', () => {
      const violations = [
        {
          id: 'image-alt',
          impact: 'critical',
          description: 'Images must have alt text',
          help: 'Add alt text',
          helpUrl: 'https://example.com',
          nodes: [
            { target: ['img.hero'], html: '<img class="hero">' },
            { target: ['img.thumb'], html: '<img class="thumb">' },
          ],
        },
      ];

      const result = formatViolations(violations);
      expect(result).to.include('img.hero');
      expect(result).to.include('img.thumb');
    });

    it('handles nodes with multiple target selectors', () => {
      const violations = [
        {
          id: 'color-contrast',
          impact: 'serious',
          description: 'Elements must have sufficient color contrast',
          help: 'Fix contrast',
          helpUrl: 'https://example.com',
          nodes: [
            {
              target: ['#main', '.content', 'p.low-contrast'],
              html: '<p class="low-contrast">text</p>',
            },
          ],
        },
      ];

      const result = formatViolations(violations);
      // Multiple targets joined with comma
      expect(result).to.include('#main, .content, p.low-contrast');
    });
  });
});
