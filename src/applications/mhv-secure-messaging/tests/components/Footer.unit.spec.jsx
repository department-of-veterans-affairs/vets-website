import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import configureStore from 'redux-mock-store';
import { expect } from 'chai';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import reducer from '../../reducers';
import folders from '../fixtures/folder-inbox-response.json';
import folderList from '../fixtures/folder-response.json';

import { Paths, smFooter } from '../../util/constants';
import Footer from '../../components/Footer';

describe('SM Footer component', () => {
  const mockStore = configureStore();
  let store;

  beforeEach(() => {
    store = mockStore({
      sm: { folders: { folder: { folderId: 0 } } },
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvSecureMessagingRemoveLandingPage]: true,
      },
    });
  });

  const folder = folders.inbox;

  const initialState = {
    sm: {
      folders: {
        folderList,
        folder,
      },
    },
  };

  it('renders without errors', () => {
    const screen = renderWithStoreAndRouter(<Footer />, {
      initialState,
      reducers: reducer,
      path: Paths.INBOX,
      store,
    });

    expect(screen).to.exist;
  });

  it('renders Footer content', () => {
    const screen = renderWithStoreAndRouter(<Footer />, {
      initialState,
      reducers: reducer,
      path: Paths.INBOX,
      store,
    });
    expect(screen.getByTestId('inbox-footer')).to.exist;
    expect(screen.getByText(smFooter.NEED_HELP)).to.exist;
    expect(screen.getByText(smFooter.HAVE_QUESTIONS)).to.exist;
    expect(screen.getByText(smFooter.LEARN_MORE)).to.exist;
    expect(screen.getByText(smFooter.CONTACT_FACILITY)).to.exist;
    expect(screen.getByText(smFooter.FIND_FACILITY)).to.exist;
  });

  it('should not render the footer when the feature flag is off', () => {
    store = mockStore({
      sm: { folders: { folder: { folderId: 0 } } },
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvSecureMessagingRemoveLandingPage]: false,
      },
    });

    const screen = renderWithStoreAndRouter(<Footer />, {
      initialState,
      reducers: reducer,
      path: Paths.INBOX,
      store,
    });
    expect(screen.queryByTestId('inbox-footer')).not.to.exist;
  });

  it('should not render the footer when NOT on the INBOX page', () => {
    store = mockStore({
      sm: { folders: { folder: { folderId: -1 } } },
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvSecureMessagingRemoveLandingPage]: true,
      },
    });

    const screen = renderWithStoreAndRouter(<Footer />, {
      initialState,
      reducers: reducer,
      path: Paths.INBOX,
      store,
    });
    expect(screen.queryByTestId('inbox-footer')).not.to.exist;
  });

  it('renders correct links', () => {
    const { getByText } = renderWithStoreAndRouter(<Footer />, {
      initialState,
      reducers: reducer,
      path: Paths.INBOX,
      store,
    });

    const learnMoreLink = getByText(smFooter.LEARN_MORE).closest('a');
    const findFacilityLink = getByText(smFooter.FIND_FACILITY).closest('a');

    expect(learnMoreLink).to.have.attribute(
      'href',
      '/health-care/secure-messaging',
    );
    expect(findFacilityLink).to.have.attribute('href', '/find-locations');
  });
});
