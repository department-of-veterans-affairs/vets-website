import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { NotificationCheckbox } from '~/applications/personalization/profile/components/notification-settings/NotificationCheckbox';

describe('<NotificationCheckbox />', () => {
  const defaultProps = {
    channelId: 'testChannel',
    channelType: 1,
    onValueChange: () => {},
    disabled: false,
    isOptedIn: false,
  };

  it('renders the component with a checkbox', () => {
    const view = render(<NotificationCheckbox {...defaultProps} />);
    const checkbox = view.getByTestId(`checkbox-${defaultProps.channelId}`);
    expect(checkbox).to.exist;
  });

  it('renders error message when provided', () => {
    const errorMessage = 'An error occurred';
    const view = render(
      <NotificationCheckbox {...defaultProps} errorMessage={errorMessage} />,
    );
    const errorSpan = view.getByText('Error');
    expect(errorSpan).to.exist;
    const errorText = view.getByText(errorMessage);
    expect(errorText).to.exist;
  });

  it('renders loading message when provided', () => {
    const loadingMessage = 'Loading...';
    const view = render(
      <NotificationCheckbox
        {...defaultProps}
        loadingMessage={loadingMessage}
      />,
    );
    const loadingSpan = view.getByText(loadingMessage);
    expect(loadingSpan).to.exist;
  });

  it('renders success message when provided', () => {
    const successMessage = 'Operation was successful';
    const view = render(
      <NotificationCheckbox
        {...defaultProps}
        successMessage={successMessage}
      />,
    );
    const successSpan = view.getByText('Success');
    expect(successSpan).to.exist;
    const successText = view.getByText(successMessage);
    expect(successText).to.exist;
  });
});
