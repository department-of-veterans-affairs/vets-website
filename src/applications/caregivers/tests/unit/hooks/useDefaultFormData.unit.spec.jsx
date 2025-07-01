import React from 'react';
import { Provider } from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';
import sinon from 'sinon-v20';
import { useDefaultFormData } from '../../../hooks/useDefaultFormData';

describe('CG `useDefaultFormData` hook', () => {
  let dispatch;
  let wrapper;

  beforeEach(() => {
    dispatch = sinon.spy();

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
    wrapper = ({ children }) => (
      <Provider store={mockStore}>{children}</Provider>
    );
  });

  afterEach(() => {
    dispatch.resetHistory();
  });

  it('should fire the `setData` dispatch with the correct data', () => {
    renderHook(() => useDefaultFormData(), { wrapper });
    sinon.assert.calledOnceWithExactly(dispatch, {
      type: 'SET_DATA',
      data: { 'view:useFacilitiesAPI': false },
    });
  });
});
