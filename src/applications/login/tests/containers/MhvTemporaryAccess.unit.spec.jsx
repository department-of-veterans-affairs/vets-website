import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';
import MhvTemporaryAccess from '../../containers/MhvTemporaryAccess';

describe('MhvTemporaryAccess', () => {
  it('renders main title', () => {
    const screen = renderInReduxProvider(<MhvTemporaryAccess />);
    const mainTitle = screen.getByRole('heading', {
      name: /access the my healthevet sign-in option/i,
    });
    expect(mainTitle).to.exist;
  });

  it('renders information paragraph', () => {
    const screen = renderInReduxProvider(<MhvTemporaryAccess />);
    const description = screen.getByText(
      /get temporary access to the my healthevet sign-in option/i,
    );
    expect(description).to.exist;
  });

  it('renders button', () => {
    const screen = renderInReduxProvider(<MhvTemporaryAccess />);
    const signInHeading = screen.getByText(/sign in/i);
    expect(signInHeading).to.exist;
    const accessButton = screen.getByTestId('accessMhvBtn');
    expect(accessButton).to.exist;
    fireEvent.click(accessButton);
  });

  it('renders having trouble section', () => {
    const screen = renderInReduxProvider(<MhvTemporaryAccess />);
    const troubleHeading = screen.getByRole('heading', {
      name: /having trouble signing in/i,
    });
    expect(troubleHeading).to.exist;

    const troubleParagraph = screen.getByText(
      /contact the administrator who gave you access to this page/i,
    );
    expect(troubleParagraph).to.exist;
  });
});
