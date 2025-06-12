import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { TOGGLE_NAMES } from 'platform/utilities/feature-toggles';
import { CutoverAlert } from '../28-1900/components/CutoverAlert';

const featureToggleEnabled = {
  [TOGGLE_NAMES.vreCutoverNotice]: true,
  loading: false,
};
const featureToggleDisabled = {
  [TOGGLE_NAMES.vreCutoverNotice]: false,
  loading: false,
};

const enabledLocation = {
  pathname: '/veteran-information-review',
};
const disallowedLocation = {
  pathname: '/confirmation',
};

describe('CutoverAlert', () => {
  describe('when the feature toggle is disabled', () => {
    it('should not display the component', async () => {
      const defaultInitialState = {
        featureToggles: featureToggleDisabled,
      };
      const screen = renderInReduxProvider(
        <CutoverAlert location={enabledLocation} />,
        {
          initialState: defaultInitialState,
        },
      );
      expect(screen.queryByTestId('cutover-alert')).to.not.exist;
    });
  });

  describe('when the feature toggle is enabled', () => {
    describe('when the location is not disallowed', () => {
      it('should display the component', async () => {
        const defaultInitialState = {
          featureToggles: featureToggleEnabled,
        };
        const screen = renderInReduxProvider(
          <CutoverAlert location={enabledLocation} />,
          {
            initialState: defaultInitialState,
          },
        );
        expect(screen.getByTestId('cutover-alert')).to.exist;
      });
    });

    describe('when the location is disallowed', () => {
      it('should not display the component', async () => {
        const defaultInitialState = {
          featureToggles: featureToggleEnabled,
        };
        const screen = renderInReduxProvider(
          <CutoverAlert location={disallowedLocation} />,
          {
            initialState: defaultInitialState,
          },
        );
        expect(screen.queryByTestId('cutover-alert')).to.not.exist;
      });
    });
  });
});
