/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import { useFeatureToggle } from './useFeatureToggle';

const TestComponent = ({ customToggleName = null }) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  const toggleValue = useToggleValue(
    customToggleName || TOGGLE_NAMES.profileUseInfoCard,
  );

  return (
    <div>
      <p>{`Toggle value: ${toggleValue ? 'true' : 'false'}`}</p>
    </div>
  );
};

describe('useFeatureToggle hook', () => {
  it('should return a feature toggle names objects and a function for use', () => {
    const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
    expect(useToggleValue).to.be.a('function');
    expect(TOGGLE_NAMES).to.be.a('object');
  });

  // renders the component that uses the hook
  // and checks that the toggle value is false
  it('should return a false toggle value', () => {
    const wrapper = renderInReduxProvider(<TestComponent />, {
      initialState: {
        featureToggles: {
          profile_use_info_card: false,
        },
      },
    });
    expect(wrapper.findAllByText('Toggle value: false')).to.exist;
  });

  it('should return a true toggle value', () => {
    const wrapper = renderInReduxProvider(<TestComponent />, {
      initialState: {
        featureToggles: {
          profile_use_info_card: true,
        },
      },
    });
    expect(wrapper.findAllByText('Toggle value: true')).to.exist;
  });

  it('should throw an error if the toggle name is not found', () => {
    try {
      renderInReduxProvider(
        <TestComponent customToggleName="fakeToggleName" />,
        {
          initialState: {
            featureToggles: {
              profile_use_info_card: true,
            },
          },
        },
      );
    } catch (error) {
      expect(error).to.exist;
    }
  });
});
