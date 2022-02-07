import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import ErrorMessage from '../ErrorMessage';

describe('check-in', () => {
  describe('ErrorMessage', () => {
    it('Renders default error message', () => {
      const component = render(<ErrorMessage />);
      expect(component.getByText('We couldn’t check you in')).to.exist;

      expect(component.getByTestId('error-message')).to.exist;
      expect(component.getByTestId('error-message')).to.have.text(
        'We’re sorry. Something went wrong on our end. Check in with a staff member.',
      );
    });
    it('Renders passed error string', () => {
      const component = render(
        <ErrorMessage header="test heading" message="test message" />,
      );
      expect(component.getByText('test heading')).to.exist;

      expect(component.getByTestId('error-message')).to.exist;
      expect(component.getByTestId('error-message')).to.have.text(
        'test message',
      );
    });
    it('Renders passed error jsx', () => {
      const msg = (
        <>
          <p data-testid="error-line-1">Error line 1</p>
          <p data-testid="error-line-2">Error line 2</p>
        </>
      );
      const component = render(<ErrorMessage message={msg} />);

      expect(component.getByTestId('error-line-1')).to.exist;
      expect(component.getByTestId('error-line-1')).to.have.text(
        'Error line 1',
      );
      expect(component.getByTestId('error-line-2')).to.exist;
      expect(component.getByTestId('error-line-2')).to.have.text(
        'Error line 2',
      );
    });
  });
});
