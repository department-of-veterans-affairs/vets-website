import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import FormFooter from '../../../../components/FormFooter';
import formConfig from '../../../../config/form';

describe('hca <FormFooter>', () => {
  const getData = ({ pathname = '/introduction' }) => ({
    props: {
      formConfig,
      currentLocation: { pathname },
    },
  });

  context('when not on the confirmation page', () => {
    it('should render markup with the correct title', () => {
      const { props } = getData({});
      const { container } = render(<FormFooter {...props} />);
      const selectors = {
        title: container.querySelector('.help-heading'),
        content: container.querySelectorAll('.help-talk'),
      };
      expect(selectors.title).to.exist;
      expect(selectors.content).to.have.length;
    });
  });

  context('when on the confirmation page', () => {
    it('should not render', () => {
      const { props } = getData({ pathname: '/confirmation' });
      const { container } = render(<FormFooter {...props} />);
      expect(container).to.be.empty;
    });
  });
});
