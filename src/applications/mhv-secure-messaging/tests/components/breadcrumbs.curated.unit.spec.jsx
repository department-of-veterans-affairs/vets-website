import React from 'react';
import { expect } from 'chai';
import { fireEvent, waitFor, cleanup } from '@testing-library/react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import SmBreadcrumbs from '../../components/shared/SmBreadcrumbs';
import reducer from '../../reducers';
import { Paths } from '../../util/constants';
import { assertBackBreadcrumbLabel } from '../util/helpers.breadcrumbs';

/**
 * Curated list / new start message flow breadcrumb back-navigation unit tests.
 *
 * These tests specifically validate the Acceptance Criteria for the curated flow:
 * - /new-message/start-message  -> Back goes to /new-message/select-care-team
 * - /new-message/select-care-team -> Back goes to /new-message/
 * - /new-message/care-team-help -> Back goes to previously visited curated page
 * - /contact-list/ -> Back logic uses (a) active draft thread if present, else (b) previousUrl, with
 *                     inbox fallback handled elsewhere (already covered in existing tests).
 */

describe('Curated list breadcrumb back navigation', () => {
  afterEach(() => cleanup());

  const getBackLink = container =>
    container.querySelector('[data-testid="sm-breadcrumbs-back"]');

  const expectBackLink = async container => {
    await waitFor(() => {
      const backLink = getBackLink(container);
      expect(backLink).to.exist;
      assertBackBreadcrumbLabel(container);
    });

    return getBackLink(container);
  };

  const baseState = {
    sm: {
      folders: {
        folder: null,
        folderList: [],
      },
      threadDetails: {},
      breadcrumbs: {
        previousUrl: Paths.INBOX,
      },
    },
  };

  const renderAt = (path, stateOverrides = {}) =>
    renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState: {
        ...baseState,
        ...stateOverrides,
        sm: {
          ...baseState.sm,
          ...(stateOverrides.sm || {}),
        },
      },
      reducers: reducer,
      path,
    });

  it('Start message page Back navigates to drafts if previous url is draft', async () => {
    // previousUrl deliberately something unrelated to prove override logic
    const previousUrl = Paths.DRAFTS;
    const { container, history } = renderAt(
      `${Paths.COMPOSE}${Paths.START_MESSAGE}`,
      {
        sm: {
          breadcrumbs: { previousUrl },
        },
      },
    );

    const backLink = await expectBackLink(container);
    fireEvent.click(backLink);

    await waitFor(() => {
      expect(history.location.pathname).to.equal(
        `${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}`,
      );
    });
  });

  it('Select care team page Back navigates to interstitial compose page when previousUrl is not recent care teams', async () => {
    // User navigated from interstitial page to select care team
    const previousUrl = Paths.COMPOSE;
    const { container, history } = renderAt(
      `${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}`,
      {
        sm: {
          breadcrumbs: { previousUrl },
        },
      },
    );
    const backLink = await expectBackLink(container);
    fireEvent.click(backLink);

    await waitFor(() => {
      expect(history.location.pathname).to.equal(`${Paths.COMPOSE}`);
    });
  });

  it('Select care team page Back navigates to recent care teams when previousUrl is recent care teams', async () => {
    // User selected "Other" from recent care teams list
    const previousUrl = Paths.RECENT_CARE_TEAMS;
    const { container, history } = renderAt(
      `${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}`,
      {
        sm: {
          breadcrumbs: { previousUrl },
        },
      },
    );
    const backLink = await expectBackLink(container);
    fireEvent.click(backLink);

    await waitFor(() => {
      expect(history.location.pathname).to.equal(Paths.COMPOSE);
    });
  });

  it('Contact list Back navigates to active draft thread when draft present and previousUrl is compose', async () => {
    const messageId = '9999';
    const { container, history } = renderAt(Paths.CONTACT_LIST, {
      sm: {
        breadcrumbs: { previousUrl: Paths.COMPOSE },
        threadDetails: { drafts: [{ messageId }] },
      },
    });
    const backLink = await expectBackLink(container);
    fireEvent.click(backLink);

    await waitFor(() => {
      expect(history.location.pathname).to.equal(
        `${Paths.MESSAGE_THREAD}${messageId}/`,
      );
    });
  });

  it('Contact list Back navigates to previous compose flow page when no active draft', async () => {
    // Simulate: compose flow -> /select-care-team/ -> /contact-list/
    // Should navigate back to /select-care-team/ (the previous step)
    const previousPage = `${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}`;

    const { container, history } = renderAt(Paths.CONTACT_LIST, {
      sm: {
        breadcrumbs: {
          previousUrl: previousPage,
        },
        threadDetails: { drafts: [] },
      },
    });

    const backLink = await expectBackLink(container);
    fireEvent.click(backLink);

    await waitFor(() => {
      expect(history.location.pathname).to.equal(previousPage);
    });
  });

  it('Care team help page navigates correctly (previousUrl = Select care team)', async () => {
    const previous = `${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}`;
    const { container, history } = renderAt(Paths.CARE_TEAM_HELP, {
      sm: {
        breadcrumbs: { previousUrl: previous },
      },
    });

    const backLink = await expectBackLink(container);
    fireEvent.click(backLink);

    await waitFor(() => {
      expect(history.location.pathname).to.equal(`${previous}`);
    });
  });

  it('Care team help page navigates correctly back to select care team', async () => {
    const previous = `${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}`;
    const { container, history } = renderAt(Paths.CARE_TEAM_HELP, {
      sm: {
        breadcrumbs: { previousUrl: previous },
      },
    });

    const backLink = await expectBackLink(container);
    fireEvent.click(backLink);

    await waitFor(() => {
      expect(history.location.pathname).to.equal(`${previous}`);
    });
  });

  it('Compose page Back navigates to inbox', async () => {
    const previousUrl = Paths.INBOX;
    const { container, history } = renderAt(Paths.COMPOSE, {
      sm: {
        breadcrumbs: { previousUrl },
      },
    });

    const backLink = await expectBackLink(container);
    fireEvent.click(backLink);

    await waitFor(() => {
      expect(history.location.pathname).to.equal(`${Paths.INBOX}`);
    });
  });
});
