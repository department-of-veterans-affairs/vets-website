import React from 'react';
import { expect } from 'chai';
import ReferralLayout from './ReferralLayout';
import {
  renderWithStoreAndRouter,
  createTestStore,
} from '../../tests/mocks/setup';

describe('VAOS Component: ReferralLayout', () => {
  const initialFullState = {
    featureToggles: {
      vaOnlineSchedulingCCDirectScheduling: true,
    },
  };
  it('should render the layout with the correct header and children', () => {
    const screen = renderWithStoreAndRouter(
      <ReferralLayout
        hasEyebrow
        apiFailure={false}
        heading="A tribute to the best heading in the world"
      >
        <div data-testid="child">I'm a child</div>
      </ReferralLayout>,
      {
        store: createTestStore(initialFullState),
      },
    );

    expect(screen.getByTestId('child')).to.exist;
    expect(screen.getByText('A tribute to the best heading in the world')).to
      .exist;
    expect(screen.getByText('New Appointment')).to.exist;
  });
  it('should render the error with the correct header and children', () => {
    const screen = renderWithStoreAndRouter(
      <ReferralLayout
        hasEyebrow
        apiFailure
        heading="A tribute to the best heading in the world"
      >
        <div data-testid="child">I'm a child</div>
      </ReferralLayout>,
      {
        store: createTestStore(initialFullState),
      },
    );

    expect(screen.getByTestId('error')).to.exist;
    expect(screen.queryByTestId('child')).to.not.exist;
    expect(screen.getByText('A tribute to the best heading in the world')).to
      .exist;
    expect(screen.getByText('New Appointment')).to.exist;
  });
  it('should render the error with the custom error body and children', () => {
    const screen = renderWithStoreAndRouter(
      <ReferralLayout
        hasEyebrow
        apiFailure
        errorBody="I'm a custom error body"
        heading="A tribute to the best heading in the world"
      />,
      {
        store: createTestStore(initialFullState),
      },
    );

    expect(screen.getByTestId('error')).to.exist;
    expect(screen.getByTestId('error-body')).to.exist;
    expect(screen.getByTestId('referral-community-care-office')).to.exist;
    expect(screen.queryByTestId('child')).to.not.exist;
    expect(screen.getByText('A tribute to the best heading in the world')).to
      .exist;
    expect(screen.getByText("I'm a custom error body")).to.exist;
    expect(screen.getByText('New Appointment')).to.exist;
  });
  it('should render the loading message', () => {
    const screen = renderWithStoreAndRouter(
      <ReferralLayout
        hasEyebrow
        apiFailure={false}
        loadingMessage="Loading..."
        heading="A tribute to the best heading in the world"
      >
        <div data-testid="child">I'm a child</div>
      </ReferralLayout>,
      {
        store: createTestStore(initialFullState),
      },
    );

    expect(screen.getByTestId('loading-container')).to.exist;
    expect(screen.queryByTestId('child')).to.not.exist;
    expect(screen.getByText('A tribute to the best heading in the world')).to
      .exist;
    expect(screen.getByTestId('loading')).to.have.attribute(
      'message',
      'Loading...',
    );
    expect(screen.getByText('New Appointment')).to.exist;
  });
  it('should set the form current page to error when apiFailure is true', () => {
    const store = createTestStore(initialFullState);
    renderWithStoreAndRouter(
      <ReferralLayout
        hasEyebrow
        apiFailure
        heading="A tribute to the best heading in the world"
      />,
      {
        store,
      },
    );

    expect(store.getState().referral.currentPage).to.equal('error');
  });
});
