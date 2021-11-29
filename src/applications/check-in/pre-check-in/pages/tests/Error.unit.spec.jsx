import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import Error from '../Error';

describe('check-in', () => {
  describe('Pre-check-in Error page', () => {
    it('renders error page', () => {
      const component = render(<Error />);
      expect(component.getByTestId('error-message')).to.exist;
    });
    it('Passes AxeCheck', () => {
      axeCheck(<Error />);
    });
  });
});
