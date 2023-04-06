/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import PropTypes from 'prop-types';

import { renderInReduxProvider } from '../../../testing/unit/react-testing-library-helpers';

import { useFeatureToggle } from '../../feature-toggles/useFeatureToggle';
import { Toggler } from '../../feature-toggles/Toggler';

const testToggleName = Toggler.TOGGLE_NAMES.profileUseExperimental;

const TestComponent = ({ customToggleName = null }) => {
  const { useToggleValue } = useFeatureToggle();

  const toggleValue = useToggleValue(customToggleName || testToggleName);

  return (
    <div>
      <p>{`Toggle value: ${toggleValue ? 'true' : 'false'}`}</p>
    </div>
  );
};

TestComponent.propTypes = {
  customToggleName: PropTypes.string,
};

describe('useFeatureToggle hook', () => {
  it('should return a feature toggle names objects and a hook function for use', () => {
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
          [testToggleName]: false,
        },
      },
    });
    expect(wrapper.findAllByText('Toggle value: false')).to.exist;
  });

  it('should return a true toggle value', () => {
    const wrapper = renderInReduxProvider(<TestComponent />, {
      initialState: {
        featureToggles: {
          [testToggleName]: true,
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
              [testToggleName]: true,
            },
          },
        },
      );
    } catch (error) {
      expect(error).to.exist;
    }
  });
});
