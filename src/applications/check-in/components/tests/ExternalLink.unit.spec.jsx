import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import ExternalLink from '../ExternalLink';

describe('check-in', () => {
  describe('ExternalLink component - en', () => {
    it('renders link component - en', () => {
      const screen = render(
        <ExternalLink hrefLang="en" href="/">
          LinkText
        </ExternalLink>,
      );
      const link = screen.getByText(/LinkText/i);
      expect(link.getAttribute('href')).to.equal('/');
      expect(link.getAttribute('hrefLang')).to.equal('en');
    });
    it('renders link component - es', () => {
      const screen = render(
        <ExternalLink hrefLang="es" href="/">
          LinkText
        </ExternalLink>,
      );
      const link = screen.getByRole('link');
      expect(link.textContent).to.equal('LinkText (in-es)');
      expect(link.getAttribute('href')).to.equal('/');
      expect(link.getAttribute('hrefLang')).to.equal('es');
    });
  });
});
