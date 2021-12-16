import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import ErrorMessage from '../ErrorMessage';

describe('check-in', () => {
  describe('ErrorMessage', () => {
    it('Renders error message', () => {
      const component = render(<ErrorMessage />);
      expect(component.getByText('We couldn’t check you in')).to.exist;

      expect(component.getByTestId('error-message')).to.exist;
      expect(component.getByTestId('error-message')).to.have.text(
        'We’re sorry. Something went wrong on our end. Check in with a staff member.',
      );
    });
  });
});
