import React from 'react';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';
import { expect } from 'chai';
import sinon from 'sinon';
import reducer from '../../reducers';
import InterstitialPage from '../../containers/InterstitialPage';
import * as threadDetailsActions from '../../actions/threadDetails';
import * as prescriptionActions from '../../actions/prescription';
import * as recipientsActions from '../../actions/recipients';
import { getByBrokenText } from '../../util/testUtils';
import { Paths } from '../../util/constants';

describe('Interstitial page', () => {
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
  }) =>
    renderWithStoreAndRouter(<InterstitialPage {...props} />, {
      initialState: customState,
      reducers: reducer,
      path,
    });

  describe('with curated list flow feature flag disabled (old flow)', () => {
    it('renders with continue button instead of link', () => {
      const screen = setup({});

      // Old flow uses va-button with continue-button testid
      const continueButton = screen.getByTestId('continue-button');
      expect(continueButton).to.exist;
      expect(continueButton).to.have.attribute('data-dd-action-name');
      expect(continueButton).to.have.attribute(
        'text',
        'Continue to start message',
      );

      // Should not have the new link
      const startMessageLink = screen.queryByTestId('start-message-link');
      expect(startMessageLink).to.not.exist;

      // Verify crisis line content exists
      expect(
        document.querySelector(
          'va-button[text="Connect with the Veterans Crisis Line"]',
        ),
      ).to.exist;
    });

    it('renders "Continue to draft" button text on type draft', () => {
      const screen = setup({
        props: { type: 'draft' },
      });
      const continueButton = screen.getByTestId('continue-button');
      expect(continueButton.getAttribute('text')).to.contain(
        'Continue to draft',
      );
    });

    it('renders "Continue to reply" button text on type reply', () => {
      const screen = setup({
        props: { type: 'reply' },
      });
      const continueButton = screen.getByTestId('continue-button');
      expect(continueButton.getAttribute('text')).to.contain(
        'Continue to reply',
      );
    });
  });

  describe('with curated list flow feature flag enabled (new flow)', () => {
    it('renders with start message link instead of button', () => {
      const screen = setup({ customState: initialState(true) });

      // New flow uses va-link-action with start-message-link testid
      const startMessageLink = screen.getByTestId('start-message-link');
      expect(startMessageLink).to.exist;
      expect(startMessageLink).to.have.attribute('data-dd-action-name');
      expect(startMessageLink).to.have.attribute(
        'text',
        'Continue to start message',
      );
      expect(startMessageLink).to.have.attribute('type', 'primary');

      // Should not have the old button
      const continueButton = screen.queryByTestId('continue-button');
      expect(continueButton).to.not.exist;

      // Verify urgent communications heading is present
      expect(startMessageLink.nextSibling.textContent).to.contain(
        'If you need help sooner, use one of these urgent communications options:',
      );

      // Verify crisis line content exists
      expect(
        document.querySelector(
          'va-button[text="Connect with the Veterans Crisis Line"]',
        ),
      ).to.exist;
    });

    it('renders "Continue to draft" link text on type draft', () => {
      const screen = setup({
        customState: initialState(true),
        props: { type: 'draft' },
      });
      const startMessageLink = screen.getByTestId('start-message-link');
      expect(startMessageLink.getAttribute('text')).to.contain(
        'Continue to draft',
      );
    });

    it('renders "Continue to reply" link text on type reply', () => {
      const screen = setup({
        customState: initialState(true),
        props: { type: 'reply' },
      });
      const startMessageLink = screen.getByTestId('start-message-link');
      expect(startMessageLink.getAttribute('text')).to.contain(
        'Continue to reply',
      );
    });

    it('"Start a new message" link responds on Enter key', async () => {
      const updateAcknowledgeSpy = sinon.spy(
        threadDetailsActions,
        'acceptInterstitial',
      );
      const screen = renderWithStoreAndRouter(<InterstitialPage />, {
        initialState: initialState(true),
        reducers: reducer,
        path: '/new-message/',
      });
      const startMessageLink = screen.getByTestId('start-message-link');
      userEvent.type(startMessageLink, '{enter}');
      sinon.assert.calledWith(updateAcknowledgeSpy);
      updateAcknowledgeSpy.restore();
    });

    it('"Start a new message" link responds on Space key', async () => {
      const updateAcknowledgeSpy = sinon.spy(
        threadDetailsActions,
        'acceptInterstitial',
      );
      const screen = renderWithStoreAndRouter(<InterstitialPage />, {
        initialState: initialState(true),
        reducers: reducer,
        path: '/new-message/',
      });
      const startMessageLink = screen.getByTestId('start-message-link');
      userEvent.type(startMessageLink, '{space}');
      sinon.assert.calledWith(updateAcknowledgeSpy);
      updateAcknowledgeSpy.restore();
    });

    it('"Start a new message" link does not respond on Tab key', async () => {
      const acknowledgeSpy = sinon.spy();
      const screen = setup({
        customState: initialState(true),
        props: { acknowledge: acknowledgeSpy },
      });
      const startMessageLink = screen.getByTestId('start-message-link');
      startMessageLink.focus();
      userEvent.tab();
      expect(acknowledgeSpy.called).to.be.false;
    });

    it('clicking the start message link navigates to recent care teams page when recent recipients exist', async () => {
      const acknowledgeSpy = sinon.spy();
      const stateWithRecentRecipients = {
        ...initialState(true),
        sm: {
          recipients: {
            recentRecipients: [
              { id: 1, name: 'Team 1' },
              { id: 2, name: 'Team 2' },
            ],
          },
        },
      };
      const { history, getByTestId } = renderWithStoreAndRouter(
        <InterstitialPage acknowledge={acknowledgeSpy} />,
        {
          initialState: stateWithRecentRecipients,
          reducers: reducer,
          path: '/new-message/',
        },
      );

      const startMessageLink = getByTestId('start-message-link');
      userEvent.click(startMessageLink);

      await waitFor(() => {
        expect(acknowledgeSpy.called).to.be.false;
        expect(history.location.pathname).to.equal(Paths.RECENT_CARE_TEAMS);
      });
    });

    it('clicking the start message link navigates to select care team page when no recent recipients', async () => {
      const acknowledgeSpy = sinon.spy();
      const stateWithoutRecentRecipients = {
        ...initialState(true),
        sm: {
          recipients: {
            recentRecipients: [],
          },
        },
      };
      const { history, getByTestId } = renderWithStoreAndRouter(
        <InterstitialPage acknowledge={acknowledgeSpy} />,
        {
          initialState: stateWithoutRecentRecipients,
          reducers: reducer,
          path: '/new-message/',
        },
      );

      const startMessageLink = getByTestId('start-message-link');
      userEvent.click(startMessageLink);

      await waitFor(() => {
        expect(acknowledgeSpy.called).to.be.false;
        expect(history.location.pathname).to.equal(
          `/new-message/${Paths.SELECT_CARE_TEAM}`,
        );
      });
    });
  });

  it('dispatches getRecentRecipients when allRecipients exist and recentRecipients is undefined', async () => {
    const getRecentRecipientsSpy = sinon.spy(
      recipientsActions,
      'getRecentRecipients',
    );

    const stateWithAllRecipientsOnly = {
      ...initialState(true),
      sm: {
        recipients: {
          allRecipients: [
            { id: 1, name: 'Team 1' },
            { id: 2, name: 'Team 2' },
            { id: 3, name: 'Team 3' },
          ],
          recentRecipients: undefined,
        },
      },
    };

    renderWithStoreAndRouter(<InterstitialPage />, {
      initialState: stateWithAllRecipientsOnly,
      reducers: reducer,
      path: '/new-message/',
    });

    await waitFor(() => {
      expect(getRecentRecipientsSpy.calledOnce).to.be.true;
      expect(getRecentRecipientsSpy.calledWith(6)).to.be.true;
    });

    getRecentRecipientsSpy.restore();
  });

  it('does NOT dispatch getRecentRecipients when recentRecipients is already defined', async () => {
    const getRecentRecipientsSpy = sinon.spy(
      recipientsActions,
      'getRecentRecipients',
    );

    const stateWithRecentRecipients = {
      ...initialState(true),
      sm: {
        recipients: {
          allRecipients: [{ id: 1, name: 'Team 1' }, { id: 2, name: 'Team 2' }],
          recentRecipients: [{ id: 1, name: 'Team 1' }],
        },
      },
    };

    renderWithStoreAndRouter(<InterstitialPage />, {
      initialState: stateWithRecentRecipients,
      reducers: reducer,
      path: '/new-message/',
    });

    await waitFor(() => {
      expect(getRecentRecipientsSpy.called).to.be.false;
    });

    getRecentRecipientsSpy.restore();
  });

  it('clicking continue link with type=reply calls acceptInterstitial but does not navigate', async () => {
    const acceptInterstitialSpy = sinon.spy(
      threadDetailsActions,
      'acceptInterstitial',
    );

    const stateWithRecentRecipients = {
      ...initialState(true),
      sm: {
        recipients: {
          recentRecipients: [
            { id: 1, name: 'Team 1' },
            { id: 2, name: 'Team 2' },
          ],
        },
      },
    };

    const { history, getByTestId } = renderWithStoreAndRouter(
      <InterstitialPage type="reply" />,
      {
        initialState: stateWithRecentRecipients,
        reducers: reducer,
        path: '/new-message/',
      },
    );

    const initialPath = history.location.pathname;
    const startMessageLink = getByTestId('start-message-link');
    userEvent.click(startMessageLink);

    await waitFor(() => {
      expect(acceptInterstitialSpy.calledOnce).to.be.true;
      // Should not navigate when type is 'reply'
      expect(history.location.pathname).to.equal(initialPath);
    });

    acceptInterstitialSpy.restore();
  });

  it('renders without errors when prescriptionId is in URL params', () => {
    setup({
      path: '/new-message/?prescriptionId=123',
    });

    expect(
      getByBrokenText(
        'If you’re in crisis or having thoughts of suicide, ',
        document.querySelector('.interstitial-page'),
      ),
    ).to.exist;
  });

  it('renders without errors when prescriptionId is not in URL params', () => {
    setup({
      path: '/new-message/',
    });

    expect(
      getByBrokenText(
        'If you’re in crisis or having thoughts of suicide, ',
        document.querySelector('.interstitial-page'),
      ),
    ).to.exist;
  });

  it('dispatches clearPrescription when prescriptionId is not in URL params', async () => {
    const clearPrescriptionSpy = sinon.spy(
      prescriptionActions,
      'clearPrescription',
    );

    // Component now only dispatches clearPrescription when recentRecipients is defined
    const stateWithRecentRecipients = {
      ...initialState(),
      sm: {
        recipients: {
          recentRecipients: [],
        },
      },
    };

    renderWithStoreAndRouter(<InterstitialPage />, {
      initialState: stateWithRecentRecipients,
      reducers: reducer,
      path: '/new-message/',
    });

    await waitFor(() => {
      expect(clearPrescriptionSpy.calledOnce).to.be.true;
    });

    clearPrescriptionSpy.restore();
  });

  it('dispatches redirectPath when redirectPath is in URL params', async () => {
    const redirectPathSpy = sinon.spy(prescriptionActions, 'setRedirectPath');

    // Component only dispatches setRedirectPath when recentRecipients is defined
    const stateWithRecentRecipients = {
      ...initialState(),
      sm: {
        recipients: {
          recentRecipients: [],
        },
      },
    };

    renderWithStoreAndRouter(<InterstitialPage />, {
      initialState: stateWithRecentRecipients,
      reducers: reducer,
      path: '/new-message/?redirectPath=/some/other/path',
    });

    await waitFor(() => {
      expect(redirectPathSpy.calledOnce).to.be.true;
      expect(redirectPathSpy.calledWith('/some/other/path')).to.be.true;
    });

    redirectPathSpy.restore();
  });

  it('dispatches getPrescriptionById and acceptInterstitial when prescriptionId is in URL params', async () => {
    const getPrescriptionSpy = sinon.spy(
      prescriptionActions,
      'getPrescriptionById',
    );
    const acceptInterstitialSpy = sinon.spy(
      threadDetailsActions,
      'acceptInterstitial',
    );

    // Component requires recentRecipients to be defined to process prescriptionId
    const stateWithRecentRecipients = {
      ...initialState(true), // curated list flow enabled
      sm: {
        recipients: {
          recentRecipients: [
            { id: 1, name: 'Team 1' },
            { id: 2, name: 'Team 2' },
          ],
        },
      },
    };

    const { history } = renderWithStoreAndRouter(<InterstitialPage />, {
      initialState: stateWithRecentRecipients,
      reducers: reducer,
      path: '/new-message/?prescriptionId=123',
    });

    await waitFor(() => {
      expect(getPrescriptionSpy.calledOnce).to.be.true;
      expect(getPrescriptionSpy.calledWith('123')).to.be.true;
      expect(acceptInterstitialSpy.calledOnce).to.be.true;
      expect(history.location.pathname).to.equal('/new-message/recent/');
    });

    getPrescriptionSpy.restore();
    acceptInterstitialSpy.restore();
  });

  it('does NOT dispatch redirectPath when redirectPath is NOT in URL params', async () => {
    const redirectPathSpy = sinon.spy(prescriptionActions, 'setRedirectPath');

    // Component requires recentRecipients to be defined to process URL params
    const stateWithRecentRecipients = {
      ...initialState(),
      sm: {
        recipients: {
          recentRecipients: [],
        },
      },
    };

    renderWithStoreAndRouter(<InterstitialPage />, {
      initialState: stateWithRecentRecipients,
      reducers: reducer,
      path: '/new-message/',
    });

    await waitFor(() => {
      expect(redirectPathSpy.calledOnce).to.be.false;
    });

    redirectPathSpy.restore();
  });
});
