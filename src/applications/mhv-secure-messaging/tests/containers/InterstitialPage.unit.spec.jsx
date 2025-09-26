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
  const initialState = (isNewFlow = false) => {
    return {
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: isNewFlow,
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

    const startMessageLink = screen.getByTestId('start-message-link');

    expect(startMessageLink).to.have.attribute('data-dd-action-name');

    expect(startMessageLink.nextSibling.textContent).to.contain(
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
    const startMessageLink = screen.queryByTestId('start-message-link');
    expect(startMessageLink.getAttribute('text')).to.contain(
      'Continue to draft',
    );
  });

  it('renders "Continue to reply" on type reply', () => {
    const acknowledgeSpy = sinon.spy();
    const screen = setup({
      props: { type: 'reply', acknowledge: acknowledgeSpy },
    });
    const startMessageLink = screen.queryByTestId('start-message-link');
    expect(startMessageLink.getAttribute('text')).to.contain(
      'Continue to reply',
    );
  });

  it('"Start a new message" link responds on Enter key', async () => {
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
    const startMessageLink = screen.queryByTestId('start-message-link');
    userEvent.type(startMessageLink, '{enter}');
    sinon.assert.calledWith(updateAcknowledgeSpy);
    updateAcknowledgeSpy.restore();
  });

  it('"Start a new message" link responds on Space key', async () => {
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
    const startMessageLink = screen.queryByTestId('start-message-link');
    userEvent.type(startMessageLink, '{space}');
    sinon.assert.calledWith(updateAcknowledgeSpy);
    updateAcknowledgeSpy.restore();
  });

  it('"Start a new message" link does respond on Tab key', async () => {
    const acknowledgeSpy = sinon.spy();
    const screen = setup({
      props: { acknowledge: acknowledgeSpy },
    });
    const startMessageLink = screen.getByTestId('start-message-link');
    startMessageLink.focus();
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

    const startMessageLink = getByTestId('start-message-link');
    userEvent.click(startMessageLink);

    await waitFor(() => {
      expect(acknowledgeSpy.called).to.be.false;
      expect(history.location.pathname).to.equal('/new-message/recent/');
    });
  });
});
