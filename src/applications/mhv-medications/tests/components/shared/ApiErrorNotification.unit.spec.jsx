import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import ApiErrorNotification from '../../../components/shared/ApiErrorNotification';

describe('ApiErrorNotification', () => {
  const setup = () => {
    return render(<ApiErrorNotification />);
  };
  it('alert is visible', () => {
    const screen = setup();
    const alertHeadline = screen.getByText(
      'We can’t access your medications right now',
    );
    expect(alertHeadline).to.exist;
  });
});
