import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';
import MhvAccess from '../../containers/MhvAccess';

describe('MhvAccess', () => {
  it('renders main title', () => {
    const screen = renderInReduxProvider(<MhvAccess />);
    const mainTitle = screen.getByRole('heading', {
      name: /get temporary access to my healthevet/i,
    });
    expect(mainTitle).to.exist;
  });

  it('renders information paragraph', () => {
    const screen = renderInReduxProvider(<MhvAccess />);
    const description = screen.getByText(
      /Some groups are approved to access the My HealtheVet sign-in option/i,
    );
    expect(description).to.exist;
  });

  it('renders button', () => {
    const screen = renderInReduxProvider(<MhvAccess />);
    const accessButton = screen.getByTestId('accessMhvBtn');
    expect(accessButton).to.exist;
    fireEvent.click(accessButton);
  });

  it('renders having trouble section', () => {
    const screen = renderInReduxProvider(<MhvAccess />);
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
