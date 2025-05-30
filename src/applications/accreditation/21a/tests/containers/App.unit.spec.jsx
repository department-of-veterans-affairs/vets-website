import React from 'react';
import sinon from 'sinon';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';

import * as constants from '../../constants';
// import * as navigation from '../../selectors/navigation';
// import * as user from '../../selectors/user';

import App from '../../containers/App';

const getState = ({
  featureTogglesAreLoading = false,
  accreditedRepresentativePortalFrontend = true,
  accreditedRepresentativePortalForm21a = true,
} = {}) => ({
  featureToggles: {
    loading: featureTogglesAreLoading,
    /* eslint-disable camelcase */
    accredited_representative_portal_frontend: accreditedRepresentativePortalFrontend,
    accredited_representative_portal_form_21a: accreditedRepresentativePortalForm21a,
    /* eslint-enable camelcase */
  },
  location: {
    path:
      'representative/accreditation/attorney-claims-agent-form-21a/introduction',
  },
});

describe('<App>', () => {
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

  context(
    'when isProduction and accreditedRepresentativePortalFrontend is false',
    () => {
      let isProduction;
      let oldLocation;

      beforeEach(() => {
        isProduction = sinon.stub(constants, 'isProduction').returns(true);
        oldLocation = global.window.location;
        global.window.location = {
          replace: sinon.spy(),
        };
      });

      afterEach(() => {
        isProduction.restore();
        global.window.location = oldLocation;
      });

      it('should exit app', () => {
        renderWithStoreAndRouter(<App />, {
          initialState: {
            ...getState({ accreditedRepresentativePortalFrontend: false }),
          },
        });
        expect(window.location.replace.calledWith('/')).to.be.true;
      });
    },
  );
});
