import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import LinkTranslation from '../LinkTranslation';

describe('check-in', () => {
  describe('LinkTranslation component - en', () => {
    it('renders link component - en', () => {
      const screen = render(
        <LinkTranslation hrefLang="en" href="/">
          LinkText
        </LinkTranslation>,
      );
      const link = screen.getByText(/LinkText/i);
      expect(link.getAttribute('href')).to.equal('/');
      expect(link.getAttribute('hrefLang')).to.equal('en');
    });
    it('renders link component - es', () => {
      const screen = render(
        <LinkTranslation hrefLang="es" href="/">
          LinkText
        </LinkTranslation>,
      );
      const link = screen.getByRole('link');
      expect(link.textContent).to.equal('LinkText (in spanish)');
      expect(link.getAttribute('href')).to.equal('/');
      expect(link.getAttribute('hrefLang')).to.equal('es');
    });
  });
});
