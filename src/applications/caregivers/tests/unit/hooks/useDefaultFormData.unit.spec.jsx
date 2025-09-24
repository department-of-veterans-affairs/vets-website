import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import sinon from 'sinon-v20';
import { useDefaultFormData } from '../../../hooks/useDefaultFormData';

// create wrapper component for our hook
const TestComponent = () => {
  useDefaultFormData();
  return null;
};

describe('CG `useDefaultFormData` hook', () => {
  let dispatch;
  const subject = () => {
    const mockStore = {
      getState: () => ({
        form: { data: {} },
        featureToggles: {
          /* eslint-disable camelcase */
          caregiver_use_facilities_API: false,
          loading: false,
        },
      }),
      subscribe: () => {},
      dispatch,
    };
    return render(
      <Provider store={mockStore}>
        <TestComponent />
      </Provider>,
    );
  };

  beforeEach(() => {
    dispatch = sinon.spy();
  });

  afterEach(() => {
    dispatch.resetHistory();
  });

  it('should fire the `setData` dispatch with the correct data', () => {
    subject();
    sinon.assert.calledOnceWithExactly(dispatch, {
      type: 'SET_DATA',
      data: { 'view:useFacilitiesAPI': false },
    });
  });
});
