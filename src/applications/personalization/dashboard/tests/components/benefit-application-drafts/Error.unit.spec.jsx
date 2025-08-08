import React from 'react';
import { expect } from 'chai';
import FEATURE_FLAGS from '~/platform/utilities/feature-toggles/featureFlagNames';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import Error from '../../../components/benefit-application-drafts/Error';

describe('Dashboard benefit application drafts Error', () => {
  it('should render default error message when feature toggle is disabled', () => {
    const screen = renderInReduxProvider(<Error />, {
      initialState: {
        featureToggles: {
          [FEATURE_FLAGS.myVaAuthExpRedesignEnabled]: false,
        },
      },
    });

    expect(screen.getByTestId('benefit-application-error-original')).to.exist;
  });

  it('should render redesigned error message when feature toggle is enabled', () => {
    const screen = renderInReduxProvider(<Error />, {
      initialState: {
        featureToggles: {
          [FEATURE_FLAGS.myVaAuthExpRedesignEnabled]: true,
        },
      },
    });

    expect(screen.getByTestId('benefit-application-error-redesign')).to.exist;
  });
});
