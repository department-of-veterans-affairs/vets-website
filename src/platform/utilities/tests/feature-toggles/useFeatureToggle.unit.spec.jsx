/* eslint-disable camelcase */
import React from 'react';
import * as redux from 'react-redux';
import { expect } from 'chai';
import sinon from 'sinon';
import PropTypes from 'prop-types';
import { waitFor } from '@testing-library/react';

import createSchemaFormReducer from 'platform/forms-system/src/js/state';
import { renderInReduxProvider } from '../../../testing/unit/react-testing-library-helpers';
import { useFeatureToggle } from '../../feature-toggles/useFeatureToggle';
import { Toggler } from '../../feature-toggles/Toggler';

const testToggleKey = 'profileUseExperimental';
const testToggleName = Toggler.TOGGLE_NAMES[testToggleKey];

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

const TestLoadingComponent = () => {
  const { useToggleLoadingValue } = useFeatureToggle();

  const loading = useToggleLoadingValue();

  return (
    <div>
      <p>{`Loading value: ${loading ? 'true' : 'false'}`}</p>
    </div>
  );
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

  it('should return a true loading value', () => {
    const wrapper = renderInReduxProvider(<TestLoadingComponent />, {
      initialState: {
        featureToggles: {
          loading: true,
        },
      },
    });
    expect(wrapper.findAllByText('Loading value: true')).to.exist;
  });

  it('should return a false loading value', () => {
    const wrapper = renderInReduxProvider(<TestLoadingComponent />, {
      initialState: {
        featureToggles: {
          loading: false,
        },
      },
    });
    expect(wrapper.findAllByText('Loading value: false')).to.exist;
  });
});

describe('useFormFeatureToggleSync hook', () => {
  const TestSyncComponent = ({ toggleConfigs, setStorageItem }) => {
    const { useFormFeatureToggleSync } = useFeatureToggle();
    useFormFeatureToggleSync(toggleConfigs, setStorageItem);
    return <div />;
  };

  TestSyncComponent.propTypes = {
    setStorageItem: PropTypes.func.isRequired,
    toggleConfigs: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          toggleName: PropTypes.string.isRequired,
          formKey: PropTypes.string,
        }),
      ]),
    ).isRequired,
  };

  let useDispatchStub;
  let dispatchSpy;
  let sessionStorageSpy;

  beforeEach(() => {
    useDispatchStub = sinon.stub(redux, 'useDispatch');
    dispatchSpy = sinon.spy();
    useDispatchStub.returns(dispatchSpy);
    sessionStorageSpy = sinon.spy();
  });

  afterEach(() => {
    useDispatchStub.restore();
  });

  it('should sync a single toggle using string configuration', async () => {
    const form = createSchemaFormReducer({}, {});
    renderInReduxProvider(
      <TestSyncComponent
        toggleConfigs={[testToggleKey]}
        setStorageItem={sessionStorageSpy}
      />,
      {
        initialState: {
          featureToggles: { [testToggleName]: true },
        },
        reducers: {
          form,
        },
      },
    );

    await waitFor(() => {
      expect(dispatchSpy.called).to.be.true;
      expect(
        dispatchSpy.calledWith({
          type: 'SET_DATA',
          data: { [testToggleKey]: true },
        }),
      ).to.be.true;
      expect(sessionStorageSpy.calledWith(testToggleKey, 'true')).to.be.true;
    });
  });

  it('should sync a single toggle using object configuration', async () => {
    const form = createSchemaFormReducer({}, {});
    const config = { toggleName: testToggleKey, formKey: 'customKey' };

    renderInReduxProvider(
      <TestSyncComponent
        toggleConfigs={[config]}
        setStorageItem={sessionStorageSpy}
      />,
      {
        initialState: {
          featureToggles: { [testToggleName]: true },
        },
        reducers: {
          form,
        },
      },
    );

    await waitFor(() => {
      expect(dispatchSpy.called).to.be.true;
      expect(
        dispatchSpy.calledWith({
          type: 'SET_DATA',
          data: { customKey: true },
        }),
      ).to.be.true;
      expect(sessionStorageSpy.calledWith('customKey', 'true')).to.be.true;
    });
  });

  it('should sync multiple toggles with mixed configuration types', async () => {
    const form = createSchemaFormReducer({}, {});
    const hlrKey = 'hlrBrowserMonitoringEnabled';
    const hlrFeatureName = Toggler.TOGGLE_NAMES[hlrKey];

    const configs = [
      testToggleKey,
      { toggleName: hlrKey, formKey: 'hlrMonitoring' },
    ];

    renderInReduxProvider(
      <TestSyncComponent
        toggleConfigs={configs}
        setStorageItem={sessionStorageSpy}
      />,
      {
        initialState: {
          featureToggles: {
            [testToggleName]: false,
            [hlrFeatureName]: true,
          },
        },
        reducers: {
          form,
        },
      },
    );

    await waitFor(() => {
      expect(dispatchSpy.called).to.be.true;
      expect(
        dispatchSpy.calledWith({
          type: 'SET_DATA',
          data: {
            [testToggleKey]: false,
            hlrMonitoring: true,
          },
        }),
      ).to.be.true;
      expect(sessionStorageSpy.calledWith(testToggleKey, 'false')).to.be.true;
      expect(sessionStorageSpy.calledWith('hlrMonitoring', 'true')).to.be.true;
    });
  });

  it('should not dispatch if toggle values match existing form data', async () => {
    const form = createSchemaFormReducer({}, {});
    renderInReduxProvider(
      <TestSyncComponent
        toggleConfigs={[testToggleKey]}
        setStorageItem={sessionStorageSpy}
      />,
      {
        initialState: {
          featureToggles: { [testToggleName]: true },
          form: {
            data: { [testToggleKey]: true },
          },
        },
        reducers: {
          form,
        },
      },
    );

    await waitFor(() => {
      expect(dispatchSpy.called).to.be.false;
      expect(sessionStorageSpy.called).to.be.false;
    });
  });

  it('should not update while feature flags are loading', async () => {
    renderInReduxProvider(
      <TestSyncComponent
        toggleConfigs={[testToggleKey]}
        setStorageItem={sessionStorageSpy}
      />,
      {
        initialState: {
          featureToggles: {
            [testToggleName]: true,
            loading: true,
          },
        },
      },
    );

    await waitFor(() => {
      expect(dispatchSpy.called).to.be.false;
      expect(sessionStorageSpy.called).to.be.false;
    });
  });
});
