import React from 'react';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';
import { expect } from 'chai';
import sinon from 'sinon';
import reducer from '../../reducers';
import InterstitialPage from '../../containers/InterstitialPage';
import { getByBrokenText } from '../../util/testUtils';
import * as threadDetailsActions from '../../actions/threadDetails';

describe('Interstitial page header', () => {
  const initialState = (isPilot = false) => {
    return {
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvSecureMessagingCernerPilot]: isPilot,
      },
    };
  };

  const setup = ({
    customState = initialState(),
    path = '/new-message/',
    props,
  }) => {
    return renderWithStoreAndRouter(<InterstitialPage {...props} />, {
      initialState: customState,
      reducers: reducer,
      path,
    });
  };

  it('renders without errors', async () => {
    const screen = setup({});

    expect(
      getByBrokenText(
        'If you’re in crisis or having thoughts of suicide, ',
        document.querySelector('.interstitial-page'),
      ),
    ).to.exist;

    const continueButton = screen.getByTestId('continue-button');

    expect(continueButton).to.have.attribute('data-dd-action-name');

    expect(continueButton.nextSibling.textContent).to.contain(
      'If you need help sooner, use one of these urgent communications options:',
    );
    expect(
      document.querySelector(
        'va-button[text="Connect with the Veterans Crisis Line"]',
      ),
    ).to.exist;
  });

  it('renders "Continue to draft" on type draft', () => {
    const acknowledgeSpy = sinon.spy();
    const screen = setup({
      props: { type: 'draft', acknowledge: acknowledgeSpy },
    });
    const continueButton = screen.queryByTestId('continue-button');
    expect(continueButton.textContent).to.contain('Continue to draft');
  });

  it('renders "Continue to reply" on type reply', () => {
    const acknowledgeSpy = sinon.spy();
    const screen = setup({
      props: { type: 'reply', acknowledge: acknowledgeSpy },
    });
    const continueButton = screen.queryByTestId('continue-button');
    expect(continueButton.textContent).to.contain('Continue to reply');
  });

  it('"Continue to start message" button responds on Enter key', async () => {
    let updateAcknowledgeSpy = sinon.spy();
    updateAcknowledgeSpy = sinon.spy(
      threadDetailsActions,
      'acceptInterstitial',
    );
    const screen = renderWithStoreAndRouter(<InterstitialPage />, {
      initialState: initialState(true),
      reducers: reducer,
      path: '/new-message/',
    });
    const continueButton = screen.queryByTestId('continue-button');
    userEvent.type(continueButton, '{enter}');
    sinon.assert.calledWith(updateAcknowledgeSpy);
    updateAcknowledgeSpy.restore();
  });

  it('"Continue to start message" button responds on Space key', async () => {
    let updateAcknowledgeSpy = sinon.spy();
    updateAcknowledgeSpy = sinon.spy(
      threadDetailsActions,
      'acceptInterstitial',
    );
    const screen = renderWithStoreAndRouter(<InterstitialPage />, {
      initialState: initialState(true),
      reducers: reducer,
      path: '/new-message/',
    });
    const continueButton = screen.queryByTestId('continue-button');
    userEvent.type(continueButton, '{space}');
    sinon.assert.calledWith(updateAcknowledgeSpy);
    updateAcknowledgeSpy.restore();
  });

  it('"Continue to start message" button does respond on Tab key', async () => {
    const acknowledgeSpy = sinon.spy();
    const screen = setup({
      props: { acknowledge: acknowledgeSpy },
    });
    const continueButton = screen.getByTestId('continue-button');
    continueButton.focus();
    userEvent.tab();
    expect(acknowledgeSpy.called).to.be.false;
  });

  it('when isPilot is true, clicking the continue button navigates to the select health care system page', async () => {
    const acknowledgeSpy = sinon.spy();
    const { history, getByTestId } = renderWithStoreAndRouter(
      <InterstitialPage acknowledge={acknowledgeSpy} />,
      {
        initialState: initialState(true),
        reducers: reducer,
        path: '/new-message/',
      },
    );

    const continueButton = getByTestId('continue-button');
    userEvent.click(continueButton);

    await waitFor(() => {
      expect(acknowledgeSpy.called).to.be.false;
      expect(history.location.pathname).to.equal(
        '/new-message/select-care-team',
      );
    });
  });
});
