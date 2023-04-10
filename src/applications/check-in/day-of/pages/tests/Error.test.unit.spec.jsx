import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import Error from '../Error';

describe('check-in', () => {
  describe('Error component', () => {
    it('renders without the phone number', () => {
      const component = render(
        <CheckInProvider>
          <Error />
        </CheckInProvider>,
      );
      expect(component.getByTestId('error-message-0')).to.exist;
      expect(component.getByTestId('error-message-0')).to.have.text(
        'We’re sorry. Something went wrong on our end. Check in with a staff member.',
      );
    });
  });
  it('renders the correct error', () => {
    const component = render(
      <CheckInProvider store={{ error: 'uuid-not-found' }}>
        <Error />
      </CheckInProvider>,
    );
    expect(component.getByTestId('error-message-0')).to.exist;
    expect(component.getByTestId('error-message-0')).to.have.text(
      'Trying to check in for an appointment? Text check in to .',
    );
    expect(component.getByTestId('error-message-sms')).to.exist;
  });
});
