import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { useDefaultFormData } from '../../../hooks/useDefaultFormData';

// create wrapper component for our hook
const TestComponent = () => {
  useDefaultFormData();
  return null;
};

describe('CG `useDefaultFormData` hook', () => {
  const getData = () => ({
    mockStore: {
      getState: () => ({
        form: { data: {} },
        featureToggles: {
          /* eslint-disable camelcase */
          caregiver_use_facilities_API: false,
          loading: false,
        },
      }),
      subscribe: () => {},
      dispatch: sinon.stub(),
    },
  });
  const subject = ({ mockStore }) =>
    render(
      <Provider store={mockStore}>
        <TestComponent />
      </Provider>,
    );

  it('should fire the `setData` dispatch with the correct data', () => {
    const { mockStore } = getData();
    const { dispatch } = mockStore;
    const expectedData = {
      'view:useFacilitiesAPI': false,
    };

    subject({ mockStore });
    expect(dispatch.firstCall.args[0].type).to.eq('SET_DATA');
    expect(dispatch.firstCall.args[0].data).to.deep.eq(expectedData);
  });
});
