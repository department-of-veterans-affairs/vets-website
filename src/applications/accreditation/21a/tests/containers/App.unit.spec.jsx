import React from 'react';
import sinon from 'sinon';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';

import * as constants from '../../constants';
import App from '../../containers/App';

const getState = ({
  featureTogglesAreLoading = false,
  accreditedRepresentativePortalFrontend = true,
  accreditedRepresentativePortalForm21a = true,
  showLoginModal = false,
  profileLoading = false,
} = {}) => ({
  featureToggles: {
    loading: featureTogglesAreLoading,
    /* eslint-disable camelcase */
    accredited_representative_portal_frontend: accreditedRepresentativePortalFrontend,
    accredited_representative_portal_form_21a: accreditedRepresentativePortalForm21a,
    /* eslint-enable camelcase */
  },
  navigation: {
    showLoginModal,
  },
  user: {
    profile: {
      loading: profileLoading,
      loa: { current: 1 },
    },
  },
});

describe('<App>', () => {
  it('should render the app', () => {
    const { container, getByTestId } = renderWithStoreAndRouter(<App />, {
      initialState: {
        ...getState(),
      },
    });

    const loadingIndicator = $('va-loading-indicator', container);
    expect(loadingIndicator).to.not.exist;
    expect(getByTestId('form21a-content')).to.exist;
  });

  context('when app is loading', () => {
    it('should render loading', () => {
      const { container } = renderWithStoreAndRouter(<App />, {
        initialState: {
          ...getState({ featureTogglesAreLoading: true }),
        },
      });
      const loadingIndicator = $('va-loading-indicator', container);
      expect(loadingIndicator).to.exist;
      expect(loadingIndicator.getAttribute('message')).to.contain(
        'Loading the Accredited Representative Portal...',
      );
    });
  });

  context.skip(
    // TODO: Remove skip when migration to Node 22 is complete
    'when isProduction and accredited_representative_portal_frontend is false',
    () => {
      let isProduction;
      let replaceSpy;

      beforeEach(() => {
        isProduction = sinon.stub(constants, 'isProduction').returns(true);
        replaceSpy = sinon.stub(window.location, 'replace');
      });

      afterEach(() => {
        isProduction.restore();
        replaceSpy.restore();
      });

      it('should exit app', () => {
        renderWithStoreAndRouter(<App />, {
          initialState: {
            ...getState({ accreditedRepresentativePortalFrontend: false }),
          },
        });
        expect(replaceSpy.calledWith('/')).to.be.true;
      });
    },
  );

  context.skip(
    // TODO: Remove skip when migration to Node 22 is complete
    'when accredited_representative_portal_form_21a is false',
    () => {
      let replaceSpy;

      beforeEach(() => {
        replaceSpy = sinon.stub(window.location, 'replace');
      });

      afterEach(() => {
        replaceSpy.restore();
      });

      it('should go to Accredited Representative Portal', () => {
        renderWithStoreAndRouter(<App />, {
          initialState: {
            ...getState({ accreditedRepresentativePortalForm21a: false }),
          },
        });
        expect(replaceSpy.calledWith('/representative')).to.be.true;
      });
    },
  );

  // TODO: Remove skip when migration to Node 22 is complete
  context.skip('when selectShouldGoToSignIn is true', () => {
    let assignSpy;

    beforeEach(() => {
      assignSpy = sinon.stub(window.location, 'assign');
    });

    afterEach(() => {
      assignSpy.restore();
    });

    it('should go to the sign in page', () => {
      renderWithStoreAndRouter(<App />, {
        initialState: {
          ...getState({
            showLoginModal: true,
          }),
        },
      });
      expect(assignSpy.called).to.be.true;
    });
  });

  context('when isUserLoading is true', () => {
    it('should show va loading indicator', () => {
      const { container } = renderWithStoreAndRouter(<App />, {
        initialState: {
          ...getState({
            profileLoading: true,
          }),
        },
      });

      const loadingIndicator = $('va-loading-indicator', container);
      expect(loadingIndicator).to.exist;
      // TODO: Figure out why this test isnt working
      // expect(loadingIndicator.getAttribute('message')).to.contain(
      //   'Loading user information...',
      // );
    });
  });
});
