import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import FormFooter from '../../../../components/FormFooter';
import formConfig from '../../../../config/form';
import content from '../../../../locales/en/content.json';

describe('ezr <FormFooter>', () => {
  context('when not on the confirmation page', () => {
    it('should render markup with the correct title', () => {
      const props = {
        currentLocation: { pathname: '/introduction' },
        formConfig,
      };
      const { container } = render(<FormFooter {...props} />);
      const selectors = {
        title: container.querySelector('.help-heading'),
        content: container.querySelectorAll('.help-talk'),
      };
      expect(selectors.title).to.exist;
      expect(selectors.title).to.contain.text(content['form-footer-title']);
      expect(selectors.content).to.have.length;
    });
  });

  context('when on the confirmation page', () => {
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
