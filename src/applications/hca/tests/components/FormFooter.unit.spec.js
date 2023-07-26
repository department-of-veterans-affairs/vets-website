import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { FormFooter } from '../../components/FormFooter';
import formConfig from '../../config/form';

describe('hca <FormFooter>', () => {
  describe('when not on the confirmation page', () => {
    describe('when `shouldHideFormFooter` returns `false`', () => {
      it('should render markup with the correct title', () => {
        const props = {
          currentLocation: { pathname: '/introduction' },
          isHidden: false,
          formConfig,
        };
        const { container } = render(<FormFooter {...props} />);
        const selectors = {
          title: container.querySelector('.help-heading'),
          content: container.querySelectorAll('.help-talk'),
        };
        expect(selectors.title).to.exist;
        expect(selectors.title).to.contain.text('Need help?');
        expect(selectors.content).to.have.length;
      });
    });

    describe('when `shouldHideFormFooter` returns `true`', () => {
      it('should not render', () => {
        const props = {
          currentLocation: { pathname: '/introduction' },
          isHidden: true,
          formConfig,
        };
        const { container } = render(<FormFooter {...props} />);
        expect(container).to.be.empty;
      });
    });
  });

  describe('when on the confirmation page', () => {
    it('should not render', () => {
      const props = {
        currentLocation: { pathname: '/confirmation' },
        formConfig,
      };
      const { container } = render(<FormFooter {...props} />);
      expect(container).to.be.empty;
    });
  });
});
