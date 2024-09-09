import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import FEATURE_FLAGS from '~/platform/utilities/feature-toggles/featureFlagNames';
import { ProfilePrivacyPolicy } from '../../components/ProfilePrivacyPolicy';

describe('<ProfilePrivacyPolicy />', () => {
  it('should render when profileShowPrivacyPolicy feature toggle is true', () => {
    const view = renderInReduxProvider(<ProfilePrivacyPolicy />, {
      initialState: {
        featureToggles: {
          loading: false,
          [FEATURE_FLAGS.profileShowPrivacyPolicy]: true,
        },
      },
    });

    // renders heading
    expect(view.queryByText('Privacy policy')).to.exist;

    // renders link
    expect(
      view.container.querySelector('va-link').getAttribute('href') ===
        '/privacy-policy',
    ).to.be.true;
  });

  it('should not render when profileShowPrivacyPolicy feature toggle is false', async () => {
    const view = renderInReduxProvider(<ProfilePrivacyPolicy />, {
      initialState: {
        featureToggles: {
          loading: false,
          [FEATURE_FLAGS.profileShowPrivacyPolicy]: false,
        },
      },
    });

    // does not render heading
    expect(view.queryByText('Privacy policy')).to.be.null;
  });
});
