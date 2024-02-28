import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import ExternalLink from '../ExternalLink';
import CheckInProvider from '../../tests/unit/utils/CheckInProvider';

describe('check-in', () => {
  describe('ExternalLink component - en', () => {
    it('renders link component - en', () => {
      const screen = render(
        <CheckInProvider>
          <ExternalLink hrefLang="en" href="/">
            LinkText
          </ExternalLink>
        </CheckInProvider>,
      );
      const link = screen.getByText(/LinkText/i);
      expect(link.getAttribute('href')).to.equal('/');
      expect(link.getAttribute('hrefLang')).to.equal('en');

      const inEnglish = screen.queryByText('(in english)');
      expect(inEnglish).to.be.null;
    });
    it('renders link component - es', () => {
      const screen = render(
        <CheckInProvider>
          <ExternalLink hrefLang="es" href="/">
            LinkText
          </ExternalLink>
        </CheckInProvider>,
      );
      const link = screen.getByRole('link');
      expect(link.textContent).to.equal('LinkText (in-es)');
      expect(link.getAttribute('href')).to.equal('/');
      expect(link.getAttribute('hrefLang')).to.equal('es');
    });
    it('renders link component - tl', () => {
      const screen = render(
        <CheckInProvider>
          <ExternalLink hrefLang="tl" href="/">
            LinkText
          </ExternalLink>
        </CheckInProvider>,
      );
      const link = screen.getByRole('link');
      expect(link.textContent).to.equal('LinkText (in-tl)');
      expect(link.getAttribute('href')).to.equal('/');
      expect(link.getAttribute('hrefLang')).to.equal('tl');
    });
    it('renders a test id', () => {
      const screen = render(
        <CheckInProvider>
          <ExternalLink hrefLang="tl" href="/" dataTestId="test-id">
            LinkText
          </ExternalLink>
        </CheckInProvider>,
      );
      const link = screen.getByRole('link');
      expect(link.getAttribute('data-testid')).to.equal('test-id');
    });
  });
});
