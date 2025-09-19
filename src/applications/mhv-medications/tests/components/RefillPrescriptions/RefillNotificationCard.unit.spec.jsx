import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import RefillNotificationCard from '../../../components/RefillPrescriptions/RefillNotificationCard';

describe('RefillNotificationCard', () => {
  const defaultConfig = {
    id: 'success-refill',
    testId: 'success-refill',
    status: 'success',
    className: 'vads-u-margin-y--2',
    title: 'Refill request submitted',
    description:
      'To check the status of your refill requests, go to your medications list and filter by "recently requested."',
    linkText: 'Go to your medications list',
  };

  const mockChildren = (
    <>
      <p data-testid="success-refill-description">
        {defaultConfig.description}
      </p>
      <a data-testid="back-to-medications-page-link" href="/medications">
        {defaultConfig.linkText}
      </a>
    </>
  );

  const setup = (children = mockChildren) => {
    return renderWithStoreAndRouterV6(
      <RefillNotificationCard config={defaultConfig}>
        {children}
      </RefillNotificationCard>,
      {
        initialState: {},
        reducers: {},
        initialEntries: ['/refill'],
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });
  it('should display the title, description, and link text', () => {
    const screen = setup();

    expect(screen.getByTestId('success-refill-title')).to.include.text(
      defaultConfig.title,
    );
    expect(screen.getByTestId('success-refill-description')).to.include.text(
      defaultConfig.description,
    );
    expect(screen.getByTestId('back-to-medications-page-link')).to.include.text(
      defaultConfig.linkText,
    );
  });
});
